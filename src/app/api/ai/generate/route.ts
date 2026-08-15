import { NextResponse } from 'next/server';
import { getCurrentUser, getUserOrganization } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { PostPlatform } from '@/models/PostPlatform';
import { SocialAccount } from '@/models/SocialAccount';
import { generateContent } from '@/lib/ai';
import { recordUsage } from '@/lib/admin/usage';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const orgData = await getUserOrganization(user._id.toString());
    const organizationId = orgData?.organization?._id || new mongoose.Types.ObjectId();

    const brand = await import('@/models/BrandProfile').then((m) =>
      m.BrandProfile.findOne({ userId: user._id })
    );

    const result = await generateContent({
      topic: brief,
      brandName: brand?.brandName,
      industry: brand?.industry,
      tone: brand?.tone,
      targetAudience: brand?.targetAudience,
      keywords: brand?.keywords,
      platform: platforms[0]?.platform || 'instagram',
    });

    const fullCaption = result.caption + '\n\n' + result.hashtags.map((h) => `#${h}`).join(' ');

    const post = await Post.create({
      _id: new mongoose.Types.ObjectId(),
      user_id: user._id,
      organizationId,
      caption: fullCaption,
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

    await recordUsage({
      organizationId: organizationId.toString(),
      userId: user._id.toString(),
      type: 'AI_REQUEST',
      provider: 'openai',
      modelName: 'gpt-4o-mini',
      tokens: result.tokens,
      estimatedCost: result.estimatedCost,
    });

    return NextResponse.json({
      ok: true,
      post_id: post._id.toString(),
      caption: fullCaption,
      status: 'draft',
    });
  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
