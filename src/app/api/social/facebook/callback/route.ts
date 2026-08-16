import { NextResponse } from 'next/server';
import { validateOAuthStateByToken, exchangeFacebookCode, getFacebookPages, createSocialAccount, getBaseUrl } from '@/lib/oauth';
import { User } from '@/models/User';
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
    const stateData = await validateOAuthStateByToken('facebook', state);
    if (!stateData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=invalid_state`);
    }

    await connectDB();
    const user = await User.findById(stateData.userId).select('-password');
    if (!user) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=user_not_found`);
    }

    const tokenData = await exchangeFacebookCode(code, baseUrl);
    if (!tokenData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=token_exchange_failed`);
    }

    const pages = await getFacebookPages(tokenData.access_token);
    if (pages.length === 0) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=no_facebook_pages`);
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

    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?success=facebook`);
  } catch (error) {
    console.error('Facebook callback error:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=callback_failed`);
  }
}
