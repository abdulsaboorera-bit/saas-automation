import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { CreditTransaction } from '@/models/CreditTransaction';
import { Organization } from '@/models/Organization';
import { AuditLog } from '@/models/AuditLog';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (orgId) query.organizationId = orgId;

    const [transactions, total] = await Promise.all([
      CreditTransaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      CreditTransaction.countDocuments(query),
    ]);

    const transWithOrg = await Promise.all(
      transactions.map(async (t) => {
        const org = await Organization.findById(t.organizationId).select('name');
        return {
          ...t.toObject(),
          id: t._id.toString(),
          organization: org ? { id: org._id.toString(), name: org.name } : null,
        };
      })
    );

    return NextResponse.json({
      transactions: transWithOrg,
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

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { orgId, creditType, amount, reason, action } = body;

    if (!orgId || !creditType || !amount || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transaction = await CreditTransaction.create({
      organizationId: orgId,
      adminId: admin._id,
      type: action === 'revoke' ? 'REVOKE' : 'GRANT',
      creditType,
      amount: parseInt(amount),
      reason,
    });

    await AuditLog.create({
      adminId: admin._id,
      action: action === 'revoke' ? 'CREDITS_REVOKED' : 'CREDITS_GRANTED',
      targetType: 'Organization',
      targetId: orgId,
      metadata: { creditType, amount, reason },
    });

    return NextResponse.json({ transaction: { ...transaction.toObject(), id: transaction._id.toString() } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
