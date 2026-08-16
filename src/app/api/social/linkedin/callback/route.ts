import { NextResponse } from 'next/server';
import { validateOAuthStateByToken, exchangeLinkedInCode, getLinkedInProfile, createSocialAccount } from '@/lib/oauth';
import { User } from '@/models/User';
import { connectDB } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=fb_${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=missing_params`);
  }

  try {
    const stateData = await validateOAuthStateByToken('linkedin', state);
    if (!stateData) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=invalid_state`);
    }

    await connectDB();
    const user = await User.findById(stateData.userId).select('-password');
    if (!user) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=user_not_found`);
    }

    const tokenData = await exchangeLinkedInCode(code, origin);
    if (!tokenData) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=token_exchange_failed`);
    }

    const profile = await getLinkedInProfile(tokenData.access_token);
    if (!profile) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=profile_fetch_failed`);
    }

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

    await createSocialAccount(
      user._id.toString(),
      'linkedin',
      profile.sub,
      profile.name,
      null,
      tokenData.access_token,
      null,
      expiresAt,
      { email: profile.email },
      profile.profilePicture
    );

    return NextResponse.redirect(`${origin}/dashboard/accounts?success=linkedin`);
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=callback_failed`);
  }
}
