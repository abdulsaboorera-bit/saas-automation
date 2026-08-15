import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, generateImpersonationToken } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { OrganizationMember } from '@/models/OrganizationMember';
import { SocialAccount } from '@/models/SocialAccount';
import { Post } from '@/models/Post';
import { ContentTopic } from '@/models/ContentTopic';
import { AutomationSettings } from '@/models/AutomationSettings';
import { UsageRecord } from '@/models/UsageRecord';
import { AuditLog } from '@/models/AuditLog';
import { AdminNote } from '@/models/AdminNote';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    await connectDB();
    const { id } = await params;

    const user = await User.findById(id).select('-password -emailVerificationToken -passwordResetToken');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const membership = await OrganizationMember.findOne({ userId: id });
    const organization = membership ? await Organization.findById(membership.organizationId) : null;

    const socialAccounts = await SocialAccount.find({ user_id: id }).select('platform account_name username status token_expires_at lastValidatedAt created_at');

    const posts = await Post.find({ user_id: id }).sort({ created_at: -1 }).limit(10);
    const topics = await ContentTopic.find({ userId: id }).sort({ created_at: -1 }).limit(10);

    const automation = await AutomationSettings.findOne({ userId: id });

    const usageStats = await UsageRecord.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: '$type', count: { $sum: 1 }, totalCost: { $sum: '$estimatedCost' } } },
    ]);

    const auditLogs = await AuditLog.find({ targetType: 'User', targetId: id }).sort({ createdAt: -1 }).limit(20).populate('adminId', 'email full_name');
    const notes = await AdminNote.find({ targetType: 'User', targetId: id }).sort({ createdAt: -1 }).populate('adminId', 'email full_name');

    return NextResponse.json({
      user: { ...user.toObject(), id: user._id.toString() },
      organization: organization ? { id: organization._id.toString(), name: organization.name, status: organization.status, planId: organization.planId } : null,
      membership: membership ? { role: membership.role } : null,
      socialAccounts: socialAccounts.map(s => ({ ...s.toObject(), id: s._id.toString() })),
      recentPosts: posts.map(p => ({ ...p.toObject(), id: p._id.toString() })),
      recentTopics: topics.map(t => ({ ...t.toObject(), id: t._id.toString() })),
      automation: automation ? { ...automation.toObject(), id: automation._id.toString() } : null,
      usageStats,
      auditLogs: auditLogs.map(l => ({ ...l.toObject(), id: l._id.toString() })),
      notes: notes.map(n => ({ ...n.toObject(), id: n._id.toString() })),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    await connectDB();
    const { id } = await params;

    const body = await request.json();
    const { action, content } = body;

    if (action === 'impersonate') {
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const token = generateImpersonationToken(admin._id.toString(), id);

      await AuditLog.create({
        adminId: admin._id,
        action: 'ADMIN_IMPERSONATION_STARTED',
        targetType: 'User',
        targetId: id,
        metadata: { targetEmail: targetUser.email },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json({ impersonationToken: token });
    }

    if (action === 'addNote') {
      const note = await AdminNote.create({
        adminId: admin._id,
        targetType: 'User',
        targetId: id,
        content,
      });
      return NextResponse.json({ note: { ...note.toObject(), id: note._id.toString() } });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
