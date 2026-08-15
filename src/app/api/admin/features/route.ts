import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { FeatureFlag } from '@/models/FeatureFlag';
import { AuditLog } from '@/models/AuditLog';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const flags = await FeatureFlag.find({ organizationId: null }).sort({ name: 1 });
    return NextResponse.json({ flags: flags.map(f => ({ ...f.toObject(), id: f._id.toString() })) });
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
    const { flagId, name, enabled } = body;

    if (flagId) {
      await FeatureFlag.findByIdAndUpdate(flagId, { enabled });
    } else if (name) {
      await FeatureFlag.findOneAndUpdate(
        { name, organizationId: null },
        { enabled },
        { upsert: true }
      );
    }

    await AuditLog.create({
      adminId: admin._id,
      action: 'FEATURE_CHANGED',
      targetType: 'FeatureFlag',
      targetId: flagId || name,
      metadata: { featureName: name, enabled },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
