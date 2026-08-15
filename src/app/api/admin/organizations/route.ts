import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Organization } from '@/models/Organization';
import { OrganizationMember } from '@/models/OrganizationMember';
import { User } from '@/models/User';
import { SocialAccount } from '@/models/SocialAccount';
import { Post } from '@/models/Post';
import { ContentTopic } from '@/models/ContentTopic';
import { AutomationSettings } from '@/models/AutomationSettings';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (status) query.status = status;

    const [orgs, total] = await Promise.all([
      Organization.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Organization.countDocuments(query),
    ]);

    const orgsWithDetails = await Promise.all(
      orgs.map(async (org) => {
        const owner = await User.findById(org.ownerId).select('email full_name');
        const memberCount = await OrganizationMember.countDocuments({ organizationId: org._id });
        const socialCount = await SocialAccount.countDocuments({ organizationId: org._id, status: 'active' });
        const postCount = await Post.countDocuments({ organizationId: org._id });
        const topicCount = await ContentTopic.countDocuments({ organizationId: org._id, status: 'PENDING' });
        const automation = await AutomationSettings.findOne({ organizationId: org._id });

        return {
          ...org.toObject(),
          id: org._id.toString(),
          owner: owner ? { email: owner.email, name: owner.full_name } : null,
          memberCount,
          socialAccountCount: socialCount,
          postCount,
          topicCount,
          automationStatus: automation?.status || 'PAUSED',
        };
      })
    );

    return NextResponse.json({
      organizations: orgsWithDetails,
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
    const { orgId, action, reason } = body;

    if (!orgId || !action) {
      return NextResponse.json({ error: 'orgId and action required' }, { status: 400 });
    }

    const org = await Organization.findById(orgId);
    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    let auditAction = '';

    switch (action) {
      case 'suspend':
        updateData.status = 'SUSPENDED';
        updateData.automationStatus = 'ADMIN_PAUSED';
        auditAction = 'ORGANIZATION_SUSPENDED';
        break;
      case 'activate':
        updateData.status = 'ACTIVE';
        auditAction = 'ORGANIZATION_ACTIVATED';
        break;
      case 'block':
        updateData.status = 'BLOCKED';
        updateData.automationStatus = 'ADMIN_PAUSED';
        auditAction = 'ORGANIZATION_BLOCKED';
        break;
      case 'delete':
        updateData.status = 'DELETED';
        auditAction = 'ORGANIZATION_BLOCKED';
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await Organization.findByIdAndUpdate(orgId, updateData);

    const { AuditLog } = await import('@/models/AuditLog');
    await AuditLog.create({
      adminId: admin._id,
      action: auditAction,
      targetType: 'Organization',
      targetId: orgId,
      metadata: { reason, orgName: org.name },
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
