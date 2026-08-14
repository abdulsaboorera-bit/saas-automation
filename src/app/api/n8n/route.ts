import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { validateN8nCallback } from '@/lib/n8n';
import { Platform } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-n8n-signature');

    if (!validateN8nCallback(body, signature)) {
      console.error('Invalid n8n callback signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const { post_id, platform, status, platform_post_id, error: errorMessage } = payload;

    if (!post_id || !platform || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validPlatforms: Platform[] = ['instagram', 'facebook', 'linkedin'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    await connectDB();

    const platformStatus = status === 'published' ? 'published' : 'failed';

    await PostPlatform.findOneAndUpdate(
      { post_id, platform },
      {
        status: platformStatus,
        platform_post_id: platform_post_id || null,
        error_message: errorMessage || null,
        published_at: platformStatus === 'published' ? new Date() : null,
        updated_at: new Date(),
      }
    );

    const platforms = await PostPlatform.find({ post_id });

    if (platforms.length > 0) {
      const allPublished = platforms.every((p) => p.status === 'published');
      const allFailed = platforms.every((p) => p.status === 'failed');
      const somePublished = platforms.some((p) => p.status === 'published');

      let newPostStatus: string;
      if (allPublished) newPostStatus = 'published';
      else if (allFailed) newPostStatus = 'failed';
      else if (somePublished) newPostStatus = 'partial';
      else newPostStatus = 'processing';

      await Post.findByIdAndUpdate(post_id, {
        status: newPostStatus,
        published_at: allPublished ? new Date() : null,
        updated_at: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('n8n callback error:', error);
    return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
  }
}
