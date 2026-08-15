import { connectDB } from '@/lib/db/mongodb';
import { AuditLog, IAuditLog } from '@/models/AuditLog';
import mongoose from 'mongoose';

export interface CreateAuditLogParams {
  adminId: string;
  action: string;
  targetType: string;
  targetId: string;
  organizationId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams): Promise<IAuditLog> {
  await connectDB();
  return AuditLog.create({
    adminId: new mongoose.Types.ObjectId(params.adminId),
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    organizationId: params.organizationId ? new mongoose.Types.ObjectId(params.organizationId) : null,
    metadata: params.metadata || null,
    ipAddress: params.ipAddress || null,
    userAgent: params.userAgent || null,
  });
}

export async function getAuditLogs(filters: {
  adminId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  organizationId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  await connectDB();
  const query: Record<string, unknown> = {};

  if (filters.adminId) query.adminId = new mongoose.Types.ObjectId(filters.adminId);
  if (filters.action) query.action = filters.action;
  if (filters.targetType) query.targetType = filters.targetType;
  if (filters.targetId) query.targetId = filters.targetId;
  if (filters.organizationId) query.organizationId = new mongoose.Types.ObjectId(filters.organizationId);
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) (query.createdAt as Record<string, Date>).$gte = filters.startDate;
    if (filters.endDate) (query.createdAt as Record<string, Date>).$lte = filters.endDate;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('adminId', 'email full_name'),
    AuditLog.countDocuments(query),
  ]);

  return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
}
