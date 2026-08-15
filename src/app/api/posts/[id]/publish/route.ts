import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import { AutomationJob } from '@/models/AutomationJob';
import { Organization } from '@/models/Organization';

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

    const org = await Organization.findById(post.organizationId);
    if (!org || org.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Organization not active' }, { status: 403 });
    }

    await Post.findByIdAndUpdate(id, {
      status: 'processing',
      updated_at: new Date(),
    });

    for (const account of accounts) {
      await PostPlatform.findOneAndUpdate(
        { post_id: post._id, social_account_id: account._id },
        { status: 'processing' }
      );
    }

    const job = await AutomationJob.create({
      organizationId: post.organizationId,
      userId: user._id,
      type: 'PUBLISH_POST',
      status: 'QUEUED',
      postId: post._id,
      scheduledAt: new Date(),
    });

    return NextResponse.json({ success: true, jobId: job._id });
  } catch (error) {
    console.error('Publish post error:', error);
    return NextResponse.json({ error: 'Failed to publish post' }, { status: 500 });
  }
}
