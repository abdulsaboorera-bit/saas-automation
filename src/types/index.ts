export type Platform = 'instagram' | 'facebook' | 'linkedin';

export type SocialAccountStatus = 'active' | 'expired' | 'disconnected' | 'error' | 'reauth_required';

export type PostStatus = 'draft' | 'scheduled' | 'processing' | 'published' | 'partial' | 'failed' | 'cancelled';

export type PlatformPostStatus = 'pending' | 'processing' | 'published' | 'failed' | 'cancelled';

export type PlatformLevelRole = 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT_ADMIN';

export type OrganizationLevelRole = 'OWNER' | 'MANAGER' | 'MEMBER';

export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';

export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';

export type SubscriptionStatus = 'ACTIVE' | 'TRIAL' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';

export type AutomationStatus = 'ACTIVE' | 'PAUSED' | 'ADMIN_PAUSED' | 'SUSPENDED';

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'RETRYING';

export type JobType = 'CONTENT_GENERATION' | 'IMAGE_GENERATION' | 'PUBLISH_POST' | 'CSV_IMPORT' | 'TOPIC_PROCESSING';

export type TopicStatus = 'PENDING' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'SKIPPED' | 'CANCELLED';

export type NotificationType = 'GLOBAL_ANNOUNCEMENT' | 'ORG_ANNOUNCEMENT' | 'INDIVIDUAL_MESSAGE';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'BOTH';

export type AuditAction =
  | 'USER_SUSPENDED' | 'USER_ACTIVATED' | 'USER_BLOCKED' | 'USER_UNBLOCKED'
  | 'USER_DELETED' | 'USER_DEACTIVATED' | 'FORCE_PASSWORD_RESET'
  | 'ORGANIZATION_SUSPENDED' | 'ORGANIZATION_ACTIVATED' | 'ORGANIZATION_BLOCKED'
  | 'SOCIAL_ACCOUNT_DISCONNECTED' | 'AUTOMATION_PAUSED' | 'AUTOMATION_RESUMED'
  | 'JOB_RETRIED' | 'JOB_CANCELLED'
  | 'PLAN_CHANGED' | 'CREDITS_GRANTED' | 'CREDITS_REVOKED'
  | 'FEATURE_CHANGED' | 'ADMIN_IMPERSONATION_STARTED' | 'ADMIN_IMPERSONATION_ENDED'
  | 'SETTINGS_CHANGED' | 'MAINTENANCE_MODE_TOGGLED'
  | 'ADMIN_LOGIN' | 'PUBLISHING_KILL_SWITCH_TOGGLED' | 'GLOBAL_AUTOMATION_PAUSED';

export type FeatureName =
  | 'INSTAGRAM_PUBLISHING' | 'FACEBOOK_PUBLISHING' | 'LINKEDIN_PUBLISHING'
  | 'AI_IMAGES' | 'AUTOMATIC_MODE' | 'ANALYTICS' | 'CSV_IMPORT'
  | 'AI_CONTENT' | 'SCHEDULING' | 'BULK_POSTING';

export type ErrorClassification =
  | 'AUTH_ERROR' | 'RATE_LIMIT' | 'AI_ERROR' | 'IMAGE_ERROR'
  | 'PLATFORM_ERROR' | 'NETWORK_ERROR' | 'INVALID_REQUEST'
  | 'INVALID_MEDIA' | 'UNKNOWN';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: PlatformLevelRole | OrganizationLevelRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  status: OrganizationStatus;
  timezone: string;
  planId: string | null;
  automationStatus: AutomationStatus;
  globalAutomationPaused: boolean;
  globalPublishingStopped: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  organizationId: string;
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
  lastValidatedAt: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  organizationId: string;
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

export interface ContentTopic {
  id: string;
  organizationId: string;
  userId: string;
  topic: string;
  status: TopicStatus;
  post_id: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  csvRowNumber: number | null;
  csvFileName: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationSettings {
  id: string;
  organizationId: string;
  userId: string;
  status: AutomationStatus;
  postsPerWeek: number;
  nextRunAt: string | null;
  lastRunAt: string | null;
  lastError: string | null;
  topicsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationJob {
  id: string;
  organizationId: string;
  userId: string;
  type: JobType;
  status: JobStatus;
  topicId: string | null;
  postId: string | null;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  attempts: number;
  maxAttempts: number;
  error: string | null;
  errorClassification: ErrorClassification | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  postsPerMonth: number;
  aiGenerations: number;
  imageGenerations: number;
  connectedAccounts: number;
  topics: number;
  storage: number;
  users: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  renewalDate: string | null;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditTransaction {
  id: string;
  organizationId: string;
  adminId: string | null;
  type: 'GRANT' | 'REVOKE' | 'USAGE';
  creditType: 'AI' | 'IMAGE' | 'POST';
  amount: number;
  reason: string;
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  organizationId: string;
  userId: string;
  type: 'AI_REQUEST' | 'IMAGE_GENERATION' | 'POST_PUBLISH' | 'STORAGE' | 'API_CALL';
  provider: string | null;
  model: string | null;
  tokens: number | null;
  estimatedCost: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  organizationId: string | null;
  userId: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  sentBy: string | null;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  organizationId: string | null;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AdminNote {
  id: string;
  adminId: string;
  targetType: string;
  targetId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlag {
  id: string;
  name: FeatureName;
  enabled: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

export interface BrandProfile {
  id: string;
  organizationId: string;
  userId: string;
  brandName: string;
  industry: string | null;
  tone: string | null;
  targetAudience: string | null;
  keywords: string[];
  guidelines: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface AdminDashboardStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  blockedUsers: number;
  totalOrganizations: number;
  activeOrganizations: number;
  connectedSocialAccounts: number;
  postsPublished: number;
  postsFailed: number;
  topicsRemaining: number;
  aiGenerations: number;
  imageGenerations: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  failedJobs: number;
}
