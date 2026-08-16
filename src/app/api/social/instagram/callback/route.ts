import { NextResponse } from 'next/server';
import { validateOAuthStateByToken, exchangeInstagramCode, getInstagramAccounts, createSocialAccount, getBaseUrl } from '@/lib/oauth';
import { User } from '@/models/User';
import { OrganizationMember } from '@/models/OrganizationMember';
import { connectDB } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const baseUrl = getBaseUrl(request);

  if (error) {
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=fb_${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=missing_params`);
  }

  try {
    const stateData = await validateOAuthStateByToken('instagram', state);
    if (!stateData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=invalid_state`);
    }

    await connectDB();
    const user = await User.findById(stateData.userId).select('-password');
    if (!user) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=user_not_found`);
    }

    const tokenData = await exchangeInstagramCode(code, baseUrl);
    if (!tokenData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=token_exchange_failed`);
    }

    const accounts = await getInstagramAccounts(tokenData.access_token);
    if (accounts.length === 0) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=no_instagram_accounts`);
    }

    const account = accounts[0];

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

    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?success=instagram`);
  } catch (error) {
    console.error('Instagram callback error:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=callback_failed`);
  }
}
