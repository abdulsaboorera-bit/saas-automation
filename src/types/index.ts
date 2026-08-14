export type Platform = 'instagram' | 'facebook' | 'linkedin';

export type SocialAccountStatus = 'active' | 'expired' | 'disconnected';

export type PostStatus = 'draft' | 'scheduled' | 'processing' | 'published' | 'partial' | 'failed' | 'cancelled';

export type PlatformPostStatus = 'pending' | 'processing' | 'published' | 'failed' | 'cancelled';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  platform_account_id: string;
  account_name: string;
  username: string | null;
  profile_image_url: string | null;
  access_token_encrypted: string;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  metadata: Record<string, unknown> | null;
  status: SocialAccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  caption: string;
  media_url: string | null;
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  post_platforms?: PostPlatform[];
}

export interface PostPlatform {
  id: string;
  post_id: string;
  social_account_id: string;
  platform: Platform;
  status: PlatformPostStatus;
  platform_post_id: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  social_account?: SocialAccount;
}

export interface OAuthState {
  id: string;
  user_id: string;
  platform: Platform;
  state_token: string;
  code_verifier: string | null;
  redirect_url: string | null;
  expires_at: string;
  created_at: string;
}

export interface N8nJobPayload {
  job_id: string;
  user_id: string;
  post_id: string;
  caption: string;
  media_url: string | null;
  scheduled_at: string | null;
  platforms: {
    platform: Platform;
    social_account_id: string;
    account_name: string;
    username: string | null;
  }[];
}

export interface N8nCallbackPayload {
  job_id: string;
  post_id: string;
  platform: Platform;
  status: 'published' | 'failed';
  platform_post_id?: string;
  error?: string;
}

export interface DashboardStats {
  connectedAccounts: number;
  scheduledPosts: number;
  publishedPosts: number;
  failedPosts: number;
}
