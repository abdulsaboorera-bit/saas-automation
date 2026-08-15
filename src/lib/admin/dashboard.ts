import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { SocialAccount } from '@/models/SocialAccount';
import { Post } from '@/models/Post';
import { ContentTopic } from '@/models/ContentTopic';
import { AutomationJob } from '@/models/AutomationJob';
import { UsageRecord } from '@/models/UsageRecord';
import { Subscription } from '@/models/Subscription';

export async function getAdminDashboardStats() {
  await connectDB();

  const [
    totalUsers,
    activeUsers,
    suspendedUsers,
    blockedUsers,
    totalOrganizations,
    activeOrganizations,
    connectedSocialAccounts,
    postsPublished,
    postsFailed,
    topicsRemaining,
    aiGenerations,
    imageGenerations,
    activeSubscriptions,
    failedJobs,
  ] = await Promise.all([
    User.countDocuments({ status: { $ne: 'DELETED' } }),
    User.countDocuments({ status: 'ACTIVE' }),
    User.countDocuments({ status: 'SUSPENDED' }),
    User.countDocuments({ status: 'BLOCKED' }),
    Organization.countDocuments({ status: { $ne: 'DELETED' } }),
    Organization.countDocuments({ status: 'ACTIVE' }),
    SocialAccount.countDocuments({ status: 'active' }),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'failed' }),
    ContentTopic.countDocuments({ status: 'PENDING' }),
    UsageRecord.countDocuments({ type: 'AI_REQUEST' }),
    UsageRecord.countDocuments({ type: 'IMAGE_GENERATION' }),
    Subscription.countDocuments({ status: { $in: ['ACTIVE', 'TRIAL'] } }),
    AutomationJob.countDocuments({ status: 'FAILED' }),
  ]);

  const revenueResult = await Subscription.aggregate([
    { $match: { status: { $in: ['ACTIVE', 'TRIAL'] } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  return {
    totalUsers,
    activeUsers,
    suspendedUsers,
    blockedUsers,
    totalOrganizations,
    activeOrganizations,
    connectedSocialAccounts,
    postsPublished,
    postsFailed,
    topicsRemaining,
    aiGenerations,
    imageGenerations,
    monthlyRevenue: revenueResult[0]?.total || 0,
    activeSubscriptions,
    failedJobs,
  };
}

export async function getRecentActivity(limit = 10) {
  await connectDB();

  const [recentUsers, recentPosts, recentOrgs] = await Promise.all([
    User.find({ status: { $ne: 'DELETED' } }).sort({ created_at: -1 }).limit(limit).select('full_name email status role created_at'),
    Post.find({}).sort({ created_at: -1 }).limit(limit).select('caption status created_at user_id organizationId'),
    Organization.find({ status: { $ne: 'DELETED' } }).sort({ createdAt: -1 }).limit(limit).select('name status ownerId createdAt'),
  ]);

  return { recentUsers, recentPosts, recentOrgs };
}

export async function getUsageOverTime(days = 30) {
  await connectDB();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const aiUsage = await UsageRecord.aggregate([
    { $match: { createdAt: { $gte: startDate }, type: 'AI_REQUEST' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        cost: { $sum: '$estimatedCost' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const imageUsage = await UsageRecord.aggregate([
    { $match: { createdAt: { $gte: startDate }, type: 'IMAGE_GENERATION' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        cost: { $sum: '$estimatedCost' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return { aiUsage, imageUsage };
}
