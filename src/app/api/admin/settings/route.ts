import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { setSystemSetting, getSystemSetting, isMaintenanceMode } from '@/lib/admin/features';
import { AuditLog } from '@/models/AuditLog';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const collections = await mongoose.connection.db?.listCollections().toArray();
    const collectionCount = collections?.length || 0;

    const maintenanceMode = await isMaintenanceMode();
    const globalAutomationPaused = await getSystemSetting('global_automation_paused');
    const globalPublishingStopped = await getSystemSetting('global_publishing_stopped');

    return NextResponse.json({
      maintenanceMode,
      globalAutomationPaused: globalAutomationPaused === 'true',
      globalPublishingStopped: globalPublishingStopped === 'true',
      collections: collectionCount,
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
    const { setting, value, reason } = body;

    if (setting === 'maintenance_mode') {
      await setSystemSetting('maintenance_mode', value ? 'true' : 'false', 'Platform maintenance mode');
      await AuditLog.create({
        adminId: admin._id,
        action: 'MAINTENANCE_MODE_TOGGLED',
        targetType: 'System',
        targetId: 'maintenance',
        metadata: { enabled: value, reason },
      });
      return NextResponse.json({ success: true });
    }

    if (setting === 'global_automation_paused') {
      await setSystemSetting('global_automation_paused', value ? 'true' : 'false', 'Global automation pause');
      await AuditLog.create({
        adminId: admin._id,
        action: 'GLOBAL_AUTOMATION_PAUSED',
        targetType: 'System',
        targetId: 'automation',
        metadata: { paused: value, reason },
      });
      return NextResponse.json({ success: true });
    }

    if (setting === 'global_publishing_stopped') {
      await setSystemSetting('global_publishing_stopped', value ? 'true' : 'false', 'Global publishing kill switch');
      await AuditLog.create({
        adminId: admin._id,
        action: 'PUBLISHING_KILL_SWITCH_TOGGLED',
        targetType: 'System',
        targetId: 'publishing',
        metadata: { stopped: value, reason },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown setting' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
