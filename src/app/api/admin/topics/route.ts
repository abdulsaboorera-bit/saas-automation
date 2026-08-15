import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { ContentTopic } from '@/models/ContentTopic';
import { Organization } from '@/models/Organization';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const orgId = searchParams.get('orgId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (orgId) query.organizationId = orgId;

    const [topics, total] = await Promise.all([
      ContentTopic.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
      ContentTopic.countDocuments(query),
    ]);

    const topicsWithOrg = await Promise.all(
      topics.map(async (topic) => {
        const org = await Organization.findById(topic.organizationId).select('name');
        return {
          ...topic.toObject(),
          id: topic._id.toString(),
          organization: org ? { id: org._id.toString(), name: org.name } : null,
        };
      })
    );

    return NextResponse.json({
      topics: topicsWithOrg,
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
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { topicId, action } = body;

    if (!topicId || !action) {
      return NextResponse.json({ error: 'topicId and action required' }, { status: 400 });
    }

    if (action === 'skip') {
      await ContentTopic.findByIdAndUpdate(topicId, { status: 'SKIPPED' });
    } else if (action === 'cancel') {
      await ContentTopic.findByIdAndUpdate(topicId, { status: 'CANCELLED' });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
