import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { validateOAuthState, exchangeLinkedInCode, getLinkedInProfile, createSocialAccount } from '@/lib/oauth';

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

    const isValidState = await validateOAuthState(user._id.toString(), 'linkedin', state);
    if (!isValidState) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=invalid_state`);
    }

    const tokenData = await exchangeLinkedInCode(code);
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
