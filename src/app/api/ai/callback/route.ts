import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import { validateN8nCallback } from '@/lib/n8n';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-n8n-signature');

    if (!validateN8nCallback(body, signature)) {
      console.error('Invalid n8n AI callback signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { user_id, caption, media_url, platforms, auto_publish } = payload;

    if (!user_id || !caption) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, caption' },
        { status: 400 }
      );
    }

    await connectDB();

    const postStatus = auto_publish ? 'draft' : 'draft';

    const post = await Post.create({
      user_id: new mongoose.Types.ObjectId(user_id),
      caption,
      media_url: media_url || null,
      status: postStatus,
    });

    if (platforms && Array.isArray(platforms) && platforms.length > 0) {
      const accounts = await SocialAccount.find({
        user_id: new mongoose.Types.ObjectId(user_id),
        platform: { $in: platforms },
        status: 'active',
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
    }

    return NextResponse.json({
      success: true,
      post_id: post._id.toString(),
      message: 'Generated content saved as draft',
    });
  } catch (error) {
    console.error('AI callback error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}
