import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { UsageRecord } from '@/models/UsageRecord';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {};
    if (orgId) match.organizationId = new mongoose.Types.ObjectId(orgId);
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) (match.createdAt as Record<string, Date>).$gte = new Date(startDate);
      if (endDate) (match.createdAt as Record<string, Date>)._lte = new Date(endDate);
    }

    const [stats, records, total] = await Promise.all([
      UsageRecord.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            totalCost: { $sum: '$estimatedCost' },
            totalTokens: { $sum: { $ifNull: ['$tokens', 0] } },
          },
        },
      ]),
      UsageRecord.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UsageRecord.countDocuments(match),
    ]);

    return NextResponse.json({
      stats,
      records: records.map(r => ({ ...r.toObject(), id: r._id.toString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
