import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { validateOAuthState, exchangeFacebookCode, getFacebookPages, createSocialAccount } from '@/lib/oauth';

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

    const isValidState = await validateOAuthState(user._id.toString(), 'facebook', state);
    if (!isValidState) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=invalid_state`);
    }

    const tokenData = await exchangeFacebookCode(code);
    if (!tokenData) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=token_exchange_failed`);
    }

    const pages = await getFacebookPages(tokenData.access_token);
    if (pages.length === 0) {
      return NextResponse.redirect(`${origin}/dashboard/accounts?error=no_facebook_pages`);
    }

    const page = pages[0];

    await createSocialAccount(
      user._id.toString(),
      'facebook',
      page.id,
      page.name,
      null,
      page.access_token,
      null,
      null,
      { pages: pages.map((p) => ({ id: p.id, name: p.name })) }
    );

    return NextResponse.redirect(`${origin}/dashboard/accounts?success=facebook`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    return NextResponse.redirect(`${origin}/dashboard/accounts?error=callback_failed`);
  }
}
