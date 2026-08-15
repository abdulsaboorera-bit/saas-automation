import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { ContentTopic } from '@/models/ContentTopic';
import { OrganizationMember } from '@/models/OrganizationMember';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const membership = await OrganizationMember.findOne({ userId: user._id });
    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = { organizationId: membership.organizationId };
    if (status) query.status = status;

    const [topics, total] = await Promise.all([
      ContentTopic.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
      ContentTopic.countDocuments(query),
    ]);

    return NextResponse.json({
      topics: topics.map(t => ({ ...t.toObject(), id: t._id.toString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
