import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { SocialAccount } from '@/models/SocialAccount';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (platform) query.platform = platform;
    if (status) query.status = status;

    const [accounts, total] = await Promise.all([
      SocialAccount.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
      SocialAccount.countDocuments(query),
    ]);

    const accountsWithDetails = await Promise.all(
      accounts.map(async (account) => {
        const user = await User.findById(account.user_id).select('email full_name');
        const org = account.organizationId ? await Organization.findById(account.organizationId).select('name') : null;
        return {
          id: account._id.toString(),
          platform: account.platform,
          accountName: account.account_name,
          username: account.username,
          status: account.status,
          tokenExpiresAt: account.token_expires_at,
          lastValidatedAt: account.lastValidatedAt,
          connectedAt: account.created_at,
          user: user ? { id: user._id.toString(), email: user.email, name: user.full_name } : null,
          organization: org ? { id: org._id.toString(), name: org.name } : null,
        };
      })
    );

    return NextResponse.json({
      accounts: accountsWithDetails,
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

export async function PATCH(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { accountId, action } = body;

    if (!accountId || !action) {
      return NextResponse.json({ error: 'accountId and action required' }, { status: 400 });
    }

    if (action === 'disconnect') {
      await SocialAccount.findByIdAndUpdate(accountId, { status: 'disconnected' });
    } else if (action === 'markError') {
      await SocialAccount.findByIdAndUpdate(accountId, { status: 'error' });
    }

    const { AuditLog } = await import('@/models/AuditLog');
    await AuditLog.create({
      adminId: admin._id,
      action: 'SOCIAL_ACCOUNT_DISCONNECTED',
      targetType: 'SocialAccount',
      targetId: accountId,
      metadata: { action },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
