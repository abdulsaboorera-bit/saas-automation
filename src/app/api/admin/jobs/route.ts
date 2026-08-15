import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { AutomationJob } from '@/models/AutomationJob';
import { Organization } from '@/models/Organization';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const orgId = searchParams.get('orgId') || '';
    const failedOnly = searchParams.get('failedOnly') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (orgId) query.organizationId = orgId;
    if (failedOnly) query.status = 'FAILED';

    const [jobs, total] = await Promise.all([
      AutomationJob.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      AutomationJob.countDocuments(query),
    ]);

    const jobsWithOrg = await Promise.all(
      jobs.map(async (job) => {
        const org = await Organization.findById(job.organizationId).select('name');
        return {
          ...job.toObject(),
          id: job._id.toString(),
          organization: org ? { id: org._id.toString(), name: org.name } : null,
        };
      })
    );

    return NextResponse.json({
      jobs: jobsWithOrg,
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
    const { jobId, action } = body;

    if (!jobId || !action) {
      return NextResponse.json({ error: 'jobId and action required' }, { status: 400 });
    }

    const job = await AutomationJob.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Idempotency check
    if (action === 'retry' && job.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Job already completed' }, { status: 400 });
    }

    if (action === 'retry') {
      await AutomationJob.findByIdAndUpdate(jobId, { status: 'QUEUED', attempts: 0, error: null });
    } else if (action === 'cancel') {
      await AutomationJob.findByIdAndUpdate(jobId, { status: 'CANCELLED' });
    }

    const { AuditLog } = await import('@/models/AuditLog');
    await AuditLog.create({
      adminId: admin._id,
      action: action === 'retry' ? 'JOB_RETRIED' : 'JOB_CANCELLED',
      targetType: 'AutomationJob',
      targetId: jobId,
      metadata: { jobType: job.type, previousStatus: job.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
