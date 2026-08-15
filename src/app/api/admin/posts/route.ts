import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
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

    const [posts, total] = await Promise.all([
      Post.find(query).sort({ created_at: -1 }).skip(skip).limit(limit),
      Post.countDocuments(query),
    ]);

    const postsWithOrg = await Promise.all(
      posts.map(async (post) => {
        const org = post.organizationId ? await Organization.findById(post.organizationId).select('name') : null;
        return {
          id: post._id.toString(),
          caption: post.caption.substring(0, 100),
          status: post.status,
          scheduledAt: post.scheduled_at,
          publishedAt: post.published_at,
          createdAt: post.created_at,
          organization: org ? { id: org._id.toString(), name: org.name } : null,
        };
      })
    );

    return NextResponse.json({
      posts: postsWithOrg,
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
