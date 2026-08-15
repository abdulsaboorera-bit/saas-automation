import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { OrganizationMember } from '@/models/OrganizationMember';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { full_name: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query).select('-password -emailVerificationToken -passwordResetToken').sort({ created_at: -1 }).skip(skip).limit(limit),
      User.countDocuments(query),
    ]);

    const usersWithOrg = await Promise.all(
      users.map(async (user) => {
        const membership = await OrganizationMember.findOne({ userId: user._id });
        const organization = membership ? await Organization.findById(membership.organizationId) : null;
        return {
          ...user.toObject(),
          id: user._id.toString(),
          organization: organization ? { id: organization._id.toString(), name: organization.name } : null,
        };
      })
    );

    return NextResponse.json({
      users: usersWithOrg,
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
    const { userId, action, reason, duration } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'userId and action required' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    let auditAction = '';

    switch (action) {
      case 'suspend':
        updateData.status = 'SUSPENDED';
        auditAction = 'USER_SUSPENDED';
        if (duration === '7days') {
          updateData.suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else if (duration === '30days') {
          updateData.suspendedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
        // Pause user's automation
        await OrganizationMember.updateMany(
          { userId: user._id },
          { $set: { automationStatus: 'SUSPENDED' } }
        );
        break;
      case 'activate':
        updateData.status = 'ACTIVE';
        auditAction = 'USER_ACTIVATED';
        break;
      case 'block':
        updateData.status = 'BLOCKED';
        updateData.blockedAt = new Date();
        updateData.blockedBy = admin._id;
        updateData.blockReason = reason || 'Blocked by admin';
        auditAction = 'USER_BLOCKED';
        break;
      case 'unblock':
        updateData.status = 'ACTIVE';
        updateData.blockedAt = null;
        updateData.blockedBy = null;
        updateData.blockReason = null;
        auditAction = 'USER_UNBLOCKED';
        break;
      case 'delete':
        updateData.status = 'DELETED';
        updateData.deletedAt = new Date();
        updateData.deletedBy = admin._id;
        auditAction = 'USER_DELETED';
        break;
      case 'forcePasswordReset':
        updateData.passwordResetToken = crypto.randomBytes(32).toString('hex');
        updateData.passwordResetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        auditAction = 'FORCE_PASSWORD_RESET';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await User.findByIdAndUpdate(userId, updateData);

    // Create audit log
    const { AuditLog } = await import('@/models/AuditLog');
    await AuditLog.create({
      adminId: admin._id,
      action: auditAction,
      targetType: 'User',
      targetId: userId,
      metadata: { reason, duration, email: user.email },
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      userAgent: request.headers.get('user-agent'),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
