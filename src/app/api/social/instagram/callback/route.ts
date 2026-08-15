import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { validateOAuthState, exchangeInstagramCode, getInstagramAccounts, createSocialAccount } from '@/lib/oauth';
import { OrganizationMember } from '@/models/OrganizationMember';
import { connectDB } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=missing_params`);
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(`${origin}/login`);
    }

    const isValidState = await validateOAuthState(user._id.toString(), 'instagram', state);
    if (!isValidState) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=invalid_state`);
    }

    const tokenData = await exchangeInstagramCode(code);
    if (!tokenData) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=token_exchange_failed`);
    }

    const accounts = await getInstagramAccounts(tokenData.access_token);
    if (accounts.length === 0) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=no_instagram_accounts`);
    }

    const account = accounts[0];

    await connectDB();
    const membership = await OrganizationMember.findOne({ userId: user._id });

    await createSocialAccount(
      user._id.toString(),
      'instagram',
      account.id,
      account.name,
      account.username,
      tokenData.access_token,
      null,
      null,
      { account_type: account.account_type },
      account.profile_picture_url
    );

    return NextResponse.redirect(`${origin}/dashboard/accounts?success=instagram`);
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=callback_failed`);
  }
}
