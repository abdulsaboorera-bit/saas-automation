import { connectDB } from '@/lib/db/mongodb';
import { UsageRecord } from '@/models/UsageRecord';
import { CreditTransaction } from '@/models/CreditTransaction';
import { Plan } from '@/models/Plan';
import { Subscription } from '@/models/Subscription';
import mongoose from 'mongoose';

export async function recordUsage(params: {
  organizationId: string;
  userId: string;
  type: 'AI_REQUEST' | 'IMAGE_GENERATION' | 'POST_PUBLISH' | 'STORAGE' | 'API_CALL';
  provider?: string;
  modelName?: string;
  tokens?: number;
  estimatedCost: number;
  metadata?: Record<string, unknown>;
}) {
  await connectDB();
  return UsageRecord.create({
    organizationId: new mongoose.Types.ObjectId(params.organizationId),
    userId: new mongoose.Types.ObjectId(params.userId),
    type: params.type,
    provider: params.provider || null,
    modelName: params.modelName || null,
    tokens: params.tokens || null,
    estimatedCost: params.estimatedCost,
    metadata: params.metadata || null,
  });
}

export async function getUsageStats(organizationId: string, startDate?: Date, endDate?: Date) {
  await connectDB();
  const match: Record<string, unknown> = {
    organizationId: new mongoose.Types.ObjectId(organizationId),
  };

  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) (match.createdAt as Record<string, Date>).$gte = startDate;
    if (endDate) (match.createdAt as Record<string, Date>).$lte = endDate;
  }

  const stats = await UsageRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalCost: { $sum: '$estimatedCost' },
        totalTokens: { $sum: { $ifNull: ['$tokens', 0] } },
      },
    },
  ]);

  return stats;
}

export async function checkUsageLimit(
  organizationId: string,
  type: 'AI' | 'IMAGE' | 'POST',
  limit: number
): Promise<{ allowed: boolean; current: number; limit: number }> {
  await connectDB();

  const typeMap: Record<string, string[]> = {
    AI: ['AI_REQUEST'],
    IMAGE: ['IMAGE_GENERATION'],
    POST: ['POST_PUBLISH'],
  };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const count = await UsageRecord.countDocuments({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    type: { $in: typeMap[type] },
    createdAt: { $gte: startOfMonth },
  });

  return { allowed: count < limit, current: count, limit };
}

export async function grantCredits(
  organizationId: string,
  adminId: string,
  creditType: 'AI' | 'IMAGE' | 'POST',
  amount: number,
  reason: string
) {
  await connectDB();
  return CreditTransaction.create({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    adminId: new mongoose.Types.ObjectId(adminId),
    type: 'GRANT',
    creditType,
    amount,
    reason,
  });
}

export async function revokeCredits(
  organizationId: string,
  adminId: string,
  creditType: 'AI' | 'IMAGE' | 'POST',
  amount: number,
  reason: string
) {
  await connectDB();
  return CreditTransaction.create({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    adminId: new mongoose.Types.ObjectId(adminId),
    type: 'REVOKE',
    creditType,
    amount,
    reason,
  });
}

export async function getOrganizationPlan(organizationId: string) {
  await connectDB();
  const subscription = await Subscription.findOne({
    organizationId: new mongoose.Types.ObjectId(organizationId),
    status: { $in: ['ACTIVE', 'TRIAL'] },
  });

  if (!subscription) return null;

  const plan = await Plan.findById(subscription.planId);
  return plan;
}

export async function getTotalStorage(organizationId: string): Promise<number> {
  await connectDB();
  const { Post: PostModel } = await import('@/models/Post');
  const result = await PostModel.aggregate([
    { $match: { organizationId: new mongoose.Types.ObjectId(organizationId), media_url: { $ne: null } } },
    { $count: 'count' },
  ]);
  return result[0]?.count || 0;
}
