import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    await connectDB();

    const query: Record<string, unknown> = { user_id: user._id };
    if (status) query.status = status;

    const posts = await Post.find(query)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const postIds = posts.map((p) => p._id);
    const postPlatforms = await PostPlatform.find({ post_id: { $in: postIds } })
      .populate('social_account_id', 'platform account_name username')
      .lean();

    const postsWithPlatforms = posts.map((post) => ({
      ...post,
      id: post._id,
      post_platforms: postPlatforms
        .filter((pp) => pp.post_id.toString() === post._id.toString())
        .map((pp) => ({
          ...pp,
          id: pp._id,
          social_accounts: pp.social_account_id,
        })),
    }));

    return NextResponse.json({ posts: postsWithPlatforms });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { caption, media_url, platform_account_ids, scheduled_at } = await request.json();

    if (!caption || !platform_account_ids || platform_account_ids.length === 0) {
      return NextResponse.json(
        { error: 'Caption and at least one platform required' },
        { status: 400 }
      );
    }

    await connectDB();

    const postStatus = scheduled_at ? 'scheduled' : 'draft';

    const post = await Post.create({
      user_id: user._id,
      caption,
      media_url: media_url || null,
      status: postStatus,
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
    });

    const accounts = await SocialAccount.find({
      _id: { $in: platform_account_ids },
      user_id: user._id,
    });

    if (accounts.length > 0) {
      await PostPlatform.insertMany(
        accounts.map((acc) => ({
          post_id: post._id,
          social_account_id: acc._id,
          platform: acc.platform,
          status: 'pending',
        }))
      );
    }

    return NextResponse.json({ post: { ...post.toObject(), id: post._id } }, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
