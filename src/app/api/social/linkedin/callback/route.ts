import { NextResponse } from 'next/server';
import { validateOAuthStateByToken, exchangeLinkedInCode, getLinkedInProfile, createSocialAccount, getBaseUrl } from '@/lib/oauth';
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
    const stateData = await validateOAuthStateByToken('linkedin', state);
    if (!stateData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=invalid_state`);
    }

    await connectDB();
    const user = await User.findById(stateData.userId).select('-password');
    if (!user) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=user_not_found`);
    }

    const tokenData = await exchangeLinkedInCode(code, baseUrl);
    if (!tokenData) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=token_exchange_failed`);
    }

    const profile = await getLinkedInProfile(tokenData.access_token);
    if (!profile) {
      return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=profile_fetch_failed`);
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

    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?success=linkedin`);
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/accounts?error=callback_failed`);
  }
}
