import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { scheduled_at } = await request.json();

    if (!scheduled_at) {
      return NextResponse.json({ error: 'scheduled_at is required' }, { status: 400 });
    }

    const scheduleDate = new Date(scheduled_at);
    if (scheduleDate <= new Date()) {
      return NextResponse.json({ error: 'Schedule time must be in the future' }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findOne({
      _id: id,
      user_id: user._id,
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.status === 'published') {
      return NextResponse.json({ error: 'Cannot schedule a published post' }, { status: 400 });
    }

    await Post.findByIdAndUpdate(id, {
      status: 'scheduled',
      scheduled_at: scheduleDate,
      updated_at: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Schedule post error:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
}
