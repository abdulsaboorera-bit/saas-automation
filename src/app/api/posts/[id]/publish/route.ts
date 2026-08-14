import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import { sendJobToN8n } from '@/lib/n8n';

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
    await connectDB();

    const post = await Post.findOne({
      _id: id,
      user_id: user._id,
    }).lean();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.status === 'published') {
      return NextResponse.json({ error: 'Post already published' }, { status: 400 });
    }

    const postPlatforms = await PostPlatform.find({ post_id: post._id })
      .populate('social_account_id')
      .lean();

    const accounts = postPlatforms
      .map((pp) => pp.social_account_id)
      .filter(Boolean);

    if (accounts.length === 0) {
      return NextResponse.json({ error: 'No platforms selected' }, { status: 400 });
    }

    await Post.findByIdAndUpdate(id, {
      status: 'processing',
      updated_at: new Date(),
    });

    const { jobId, success, error: n8nError } = await sendJobToN8n(
      { ...post, _id: post._id, id: post._id } as never,
      accounts as never[]
    );

    if (!success) {
      await Post.findByIdAndUpdate(id, {
        status: 'failed',
        updated_at: new Date(),
      });

      return NextResponse.json(
        { error: `Failed to send to automation: ${n8nError}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, jobId });
  } catch (error) {
    console.error('Publish post error:', error);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
