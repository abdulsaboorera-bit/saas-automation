import { connectDB } from '@/lib/db/mongodb';
import { OAuthState } from '@/models/OAuthState';
import { SocialAccount, ISocialAccount } from '@/models/SocialAccount';
import { generateStateToken, encrypt, decrypt } from '@/lib/security/encryption';
import { Platform } from '@/types';
import mongoose from 'mongoose';

export function getBaseUrl(request?: Request): string {
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    if (forwardedHost) {
      return `${forwardedProto || 'https'}://${forwardedHost}`;
    }
  }
  return (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
}

export async function createOAuthState(
  userId: string,
  platform: Platform,
  redirectUrl?: string
): Promise<string> {
  const stateToken = generateStateToken();

  await connectDB();
  await OAuthState.deleteMany({ user_id: userId, platform });

  await OAuthState.create({
    user_id: new mongoose.Types.ObjectId(userId),
    platform,
    state_token: stateToken,
    redirect_url: redirectUrl || null,
    expires_at: new Date(Date.now() + 10 * 60 * 1000),
  });

  return stateToken;
}

export async function validateOAuthState(
  userId: string,
  platform: Platform,
  stateToken: string
): Promise<boolean> {
  await connectDB();
  const state = await OAuthState.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    platform,
    state_token: stateToken,
    expires_at: { $gt: new Date() },
  });

  if (!state) return false;

  await OAuthState.deleteOne({ _id: state._id });
  return true;
}

export async function validateOAuthStateByToken(
  platform: Platform,
  stateToken: string
): Promise<{ userId: string } | null> {
  await connectDB();
  const state = await OAuthState.findOne({
    platform,
    state_token: stateToken,
    expires_at: { $gt: new Date() },
  });

  if (!state) return null;

  const userId = state.user_id.toString();
  await OAuthState.deleteOne({ _id: state._id });
  return { userId };
}

export function getInstagramAuthUrl(userId: string, state: string, baseUrlOverride?: string): string {
  const clientId = process.env.META_CLIENT_ID;
  const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
  const redirectUri = `${baseUrl}/api/social/instagram/callback`;
  const scopes = 'pages_show_list,pages_read_engagement';
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}&response_type=code`;
}

export function getFacebookAuthUrl(userId: string, state: string, baseUrlOverride?: string): string {
  const clientId = process.env.META_CLIENT_ID;
  const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
  const redirectUri = `${baseUrl}/api/social/facebook/callback`;
  const scopes = 'pages_show_list,pages_manage_posts,pages_read_engagement';
  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}&response_type=code`;
}

export function getLinkedInAuthUrl(userId: string, state: string, baseUrlOverride?: string): string {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
  const redirectUri = `${baseUrl}/api/social/linkedin/callback`;
  const scopes = 'openid profile email w_member_social';
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&state=${state}`;
}

export async function exchangeInstagramCode(code: string, baseUrlOverride?: string): Promise<{
  access_token: string;
  user_id: string;
} | null> {
  try {
    const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.META_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/instagram/callback`)}&client_secret=${process.env.META_CLIENT_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      console.error('Instagram token exchange error:', tokenData.error);
      return null;
    }
    return { access_token: tokenData.access_token, user_id: tokenData.user_id };
  } catch (error) {
    console.error('Instagram code exchange failed:', error);
    return null;
  }
}

export async function exchangeFacebookCode(code: string, baseUrlOverride?: string): Promise<{
  access_token: string;
} | null> {
  try {
    const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.META_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${baseUrl}/api/social/facebook/callback`)}&client_secret=${process.env.META_CLIENT_SECRET}&code=${code}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      console.error('Facebook token exchange error:', tokenData.error);
      return null;
    }
    return { access_token: tokenData.access_token };
  } catch (error) {
    console.error('Facebook code exchange failed:', error);
    return null;
  }
}

export async function exchangeLinkedInCode(code: string, baseUrlOverride?: string): Promise<{
  access_token: string;
  expires_in: number;
} | null> {
  try {
    const baseUrl = (baseUrlOverride || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/+$/, '');
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${baseUrl}/api/social/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      console.error('LinkedIn token exchange error:', tokenData.error);
      return null;
    }
    return { access_token: tokenData.access_token, expires_in: tokenData.expires_in };
  } catch (error) {
    console.error('LinkedIn code exchange failed:', error);
    return null;
  }
}

export async function getInstagramAccounts(accessToken: string): Promise<{
  id: string;
  name: string;
  username: string;
  account_type: string;
  profile_picture_url?: string;
}[]> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,instagram_business_account{id,name,username,account_type,profile_picture_url}&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.error) return [];

    const accounts: {
      id: string; name: string; username: string; account_type: string; profile_picture_url?: string;
    }[] = [];

    if (data.data) {
      for (const page of data.data) {
        if (page.instagram_business_account) {
          accounts.push({
            id: page.instagram_business_account.id,
            name: page.name,
            username: page.instagram_business_account.username,
            account_type: page.instagram_business_account.account_type,
            profile_picture_url: page.instagram_business_account.profile_picture_url,
          });
        }
      }
    }
    return accounts;
  } catch (error) {
    console.error('Get Instagram accounts failed:', error);
    return [];
  }
}

export async function getFacebookPages(accessToken: string): Promise<{
  id: string; name: string; access_token: string;
}[]> {
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token&access_token=${accessToken}`
    );
    const data = await res.json();
    if (data.error) return [];
    return data.data || [];
  } catch (error) {
    console.error('Get Facebook pages failed:', error);
    return [];
  }
}

export async function getLinkedInProfile(accessToken: string): Promise<{
  sub: string; name: string; email?: string; profilePicture?: string;
} | null> {
  try {
    const res = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();
    if (data.error) return null;
    return { sub: data.sub, name: data.name, email: data.email, profilePicture: data.picture };
  } catch (error) {
    console.error('Get LinkedIn profile failed:', error);
    return null;
  }
}

export async function createSocialAccount(
  userId: string,
  platform: Platform,
  platformAccountId: string,
  accountName: string,
  username: string | null,
  accessToken: string,
  refreshToken: string | null,
  expiresAt: string | null,
  metadata: Record<string, unknown> | null,
  profileImageUrl?: string
): Promise<ISocialAccount> {
  await connectDB();

  const { OrganizationMember } = await import('@/models/OrganizationMember');
  const membership = await OrganizationMember.findOne({ userId: new mongoose.Types.ObjectId(userId) });
  const organizationId = membership?.organizationId;

  const existing = await SocialAccount.findOne({
    user_id: new mongoose.Types.ObjectId(userId),
    platform,
    platform_account_id: platformAccountId,
  });

  if (existing) {
    existing.account_name = accountName;
    existing.username = username;
    existing.profile_image_url = profileImageUrl || null;
    existing.access_token_encrypted = encrypt(accessToken);
    existing.refresh_token_encrypted = refreshToken ? encrypt(refreshToken) : null;
    existing.token_expires_at = expiresAt ? new Date(expiresAt) : null;
    existing.metadata = metadata;
    existing.status = 'active';
    if (organizationId) existing.organizationId = organizationId;
    await existing.save();
    return existing;
  }

  return await SocialAccount.create({
    user_id: new mongoose.Types.ObjectId(userId),
    organizationId: organizationId || new mongoose.Types.ObjectId(),
    platform,
    platform_account_id: platformAccountId,
    account_name: accountName,
    username,
    profile_image_url: profileImageUrl || null,
    access_token_encrypted: encrypt(accessToken),
    refresh_token_encrypted: refreshToken ? encrypt(refreshToken) : null,
    token_expires_at: expiresAt ? new Date(expiresAt) : null,
    metadata,
    status: 'active',
  });
}

export async function getSocialAccounts(userId: string): Promise<ISocialAccount[]> {
  await connectDB();
  return SocialAccount.find({
    user_id: new mongoose.Types.ObjectId(userId),
    status: 'active',
  }).sort({ created_at: -1 });
}

export async function disconnectSocialAccount(
  userId: string,
  accountId: string
): Promise<boolean> {
  await connectDB();
  const result = await SocialAccount.findOneAndUpdate(
    { _id: accountId, user_id: new mongoose.Types.ObjectId(userId) },
    { status: 'disconnected', updated_at: new Date() }
  );
  return result !== null;
}

export function getTokenForAccount(account: ISocialAccount): string {
  return decrypt(account.access_token_encrypted);
}
