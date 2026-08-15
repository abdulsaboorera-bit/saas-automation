import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const N8N_GENERATE_WEBHOOK_URL = process.env.N8N_AI_WEBHOOK_URL;

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!N8N_GENERATE_WEBHOOK_URL) {
      return NextResponse.json(
        { error: 'AI generation is not configured' },
        { status: 503 }
      );
    }

    const { brief, media_url, scheduled_at, platforms } = await request.json();

    if (!brief) {
      return NextResponse.json(
        { error: 'brief is required' },
        { status: 400 }
      );
    }

    if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
      return NextResponse.json(
        { error: 'At least one platform is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const postId = `post_${uuidv4().slice(0, 8)}`;
    const jobId = `job_${uuidv4().slice(0, 8)}`;

    const post = await Post.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user._id,
      caption: '',
      media_url: media_url || null,
      status: 'draft',
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
    });

    const accountIds = platforms.map((p: { social_account_id: string }) => p.social_account_id);
    const accounts = await SocialAccount.find({
      _id: { $in: accountIds },
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

    const n8nPayload = {
      post_id: postId,
      client_id: user._id.toString(),
      client_name: user.full_name || user.email,
      user_id: user._id.toString(),
      job_id: jobId,
      brief,
      media_url: media_url || null,
      scheduled_at: scheduled_at || null,
      platforms: platforms.map((p: { platform: string; social_account_id: string; account_name?: string; username?: string }) => ({
        platform: p.platform,
        social_account_id: p.social_account_id,
        account_name: p.account_name || '',
        username: p.username || '',
      })),
    };

    const response = await fetch(N8N_GENERATE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(n8nPayload),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n generate webhook failed: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: 'AI generation failed' },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      ok: true,
      post_id: postId,
      caption: result.caption || '',
      status: 'queued',
      mongo_post_id: post._id.toString(),
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
