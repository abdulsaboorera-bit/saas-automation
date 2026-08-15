import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { AutomationSettings } from '@/models/AutomationSettings';
import { Organization } from '@/models/Organization';
import { AuditLog } from '@/models/AuditLog';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const automations = await AutomationSettings.find({}).sort({ updatedAt: -1 });

    const automationsWithOrg = await Promise.all(
      automations.map(async (auto) => {
        const org = await Organization.findById(auto.organizationId).select('name status');
        return {
          ...auto.toObject(),
          id: auto._id.toString(),
          organization: org ? { id: org._id.toString(), name: org.name, status: org.status } : null,
        };
      })
    );

    return NextResponse.json({ automations: automationsWithOrg });
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
    const { automationId, action, orgId, globalAction } = body;

    if (globalAction === 'pauseAll') {
      await Organization.updateMany({}, { automationStatus: 'ADMIN_PAUSED' });
      await AutomationSettings.updateMany({}, { status: 'ADMIN_PAUSED' });

      await AuditLog.create({
        adminId: admin._id,
        action: 'GLOBAL_AUTOMATION_PAUSED',
        targetType: 'System',
        targetId: 'all',
        metadata: { reason: body.reason },
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json({ success: true, message: 'All automation paused' });
    }

    if (globalAction === 'resumeAll') {
      await Organization.updateMany({ status: 'ACTIVE' }, { automationStatus: 'ACTIVE' });
      await AutomationSettings.updateMany({ status: { $ne: 'SUSPENDED' } }, { status: 'ACTIVE' });

      await AuditLog.create({
        adminId: admin._id,
        action: 'AUTOMATION_RESUMED',
        targetType: 'System',
        targetId: 'all',
        ipAddress: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent'),
      });

      return NextResponse.json({ success: true, message: 'All automation resumed' });
    }

    if (automationId && action) {
      const updateData: Record<string, unknown> = {};
      let auditAction = '';

      if (action === 'pause') {
        updateData.status = 'ADMIN_PAUSED';
        auditAction = 'AUTOMATION_PAUSED';
      } else if (action === 'resume') {
        updateData.status = 'ACTIVE';
        auditAction = 'AUTOMATION_RESUMED';
      }

      await AutomationSettings.findByIdAndUpdate(automationId, updateData);
      if (orgId) {
        await Organization.findByIdAndUpdate(orgId, {
          automationStatus: action === 'pause' ? 'ADMIN_PAUSED' : 'ACTIVE',
        });
      }

      await AuditLog.create({
        adminId: admin._id,
        action: auditAction,
        targetType: 'Automation',
        targetId: automationId,
        organizationId: orgId,
        metadata: { action },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
