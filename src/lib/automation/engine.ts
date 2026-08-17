import { connectDB } from '@/lib/db/mongodb';
import { AutomationJob, IAutomationJob } from '@/models/AutomationJob';
import { ContentTopic } from '@/models/ContentTopic';
import { Post } from '@/models/Post';
import { Organization } from '@/models/Organization';
import { User } from '@/models/User';
import { SocialAccount } from '@/models/SocialAccount';
import { generateContent, generateImage } from '@/lib/ai';
import { decrypt } from '@/lib/security/encryption';
import { recordUsage } from '@/lib/admin/usage';
import { isGlobalAutomationPaused, isGlobalPublishingStopped } from '@/lib/admin/features';

export class AutomationEngine {
  private static instance: AutomationEngine;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine();
    }
    return AutomationEngine.instance;
  }

  start(intervalMs = 60000) {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log('[AutomationEngine] Started');
    this.intervalId = setInterval(() => this.processJobs(), intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('[AutomationEngine] Stopped');
  }

  async processJobs() {
    try {
      // Check global kill switches
      const [automationPaused, publishingStopped] = await Promise.all([
        isGlobalAutomationPaused(),
        isGlobalPublishingStopped(),
      ]);

      if (automationPaused) {
        console.log('[AutomationEngine] Global automation paused, skipping');
        return;
      }

      await connectDB();

      // Find due jobs
      const dueJobs = await AutomationJob.find({
        status: { $in: ['QUEUED', 'RETRYING'] },
        scheduledAt: { $lte: new Date() },
      }).sort({ scheduledAt: 1 }).limit(10);

      for (const job of dueJobs) {
        await this.processJob(job, publishingStopped);
      }

      // Schedule new jobs from pending topics
      await this.scheduleFromTopics();
    } catch (error) {
      console.error('[AutomationEngine] Error processing jobs:', error);
    }
  }

  private async processJob(job: IAutomationJob, publishingStopped: boolean) {
    try {
      // Mark as processing
      await AutomationJob.findByIdAndUpdate(job._id, {
        status: 'PROCESSING',
        startedAt: new Date(),
        $inc: { attempts: 1 },
      });

      // Check organization status
      const org = await Organization.findById(job.organizationId);
      if (!org || org.status !== 'ACTIVE') {
        await this.failJob(job._id.toString(), 'Organization not active', 'PLATFORM_ERROR');
        return;
      }

      // Check user status
      const user = await User.findById(job.userId);
      if (!user || user.status !== 'ACTIVE') {
        await this.failJob(job._id.toString(), 'User not active', 'PLATFORM_ERROR');
        return;
      }

      // Process based on job type
      switch (job.type) {
        case 'TOPIC_PROCESSING':
          await this.processTopic(job, publishingStopped);
          break;
        case 'CONTENT_GENERATION':
          await this.generateContent(job);
          break;
        case 'IMAGE_GENERATION':
          await this.generateImage(job);
          break;
        case 'PUBLISH_POST':
          if (!publishingStopped) {
            await this.publishPost(job);
          } else {
            await this.failJob(job._id.toString(), 'Publishing globally stopped', 'PLATFORM_ERROR');
          }
          break;
      }

      // Mark complete
      await AutomationJob.findByIdAndUpdate(job._id, {
        status: 'COMPLETED',
        completedAt: new Date(),
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.failJob(job._id.toString(), errorMessage, this.classifyError(errorMessage));
    }
  }

  private async processTopic(job: IAutomationJob, publishingStopped: boolean) {
    if (!job.topicId) return;

    const topic = await ContentTopic.findById(job.topicId);
    if (!topic || topic.status !== 'PENDING') return;

    // Mark as processing
    await ContentTopic.findByIdAndUpdate(topic._id, { status: 'PROCESSING' });

    // Generate content
    const brand = await import('@/models/BrandProfile').then(m => m.BrandProfile.findOne({ organizationId: job.organizationId }));

    const contentResult = await generateContent({
      topic: topic.topic,
      brandName: brand?.brandName,
      industry: brand?.industry,
      tone: brand?.tone,
      targetAudience: brand?.targetAudience,
      keywords: brand?.keywords,
      platform: 'instagram',
    });

    // Record AI usage
    await recordUsage({
      organizationId: job.organizationId.toString(),
      userId: job.userId.toString(),
      type: 'AI_REQUEST',
      provider: 'openai',
      modelName: 'gpt-4o-mini',
      tokens: contentResult.tokens,
      estimatedCost: contentResult.estimatedCost,
    });

    // Create post
    const post = await Post.create({
      user_id: job.userId,
      organizationId: job.organizationId,
      caption: contentResult.caption + '\n\n' + contentResult.hashtags.map(h => `#${h}`).join(' '),
      status: 'draft',
    });

    // Update topic
    await ContentTopic.findByIdAndUpdate(topic._id, {
      postId: post._id,
      status: 'PUBLISHED',
    });
  }

  private async generateContent(job: IAutomationJob) {
    // Generate AI content for a specific post
    const post = await Post.findById(job.postId);
    if (!post) return;

    const brand = await import('@/models/BrandProfile').then(m => m.BrandProfile.findOne({ organizationId: job.organizationId }));

    const result = await generateContent({
      topic: post.caption,
      brandName: brand?.brandName,
      industry: brand?.industry,
      tone: brand?.tone,
      platform: 'instagram',
    });

    await Post.findByIdAndUpdate(post._id, { caption: result.caption });

    await recordUsage({
      organizationId: job.organizationId.toString(),
      userId: job.userId.toString(),
      type: 'AI_REQUEST',
      provider: 'openai',
      modelName: 'gpt-4o-mini',
      tokens: result.tokens,
      estimatedCost: result.estimatedCost,
    });
  }

  private async generateImage(job: IAutomationJob) {
    const post = await Post.findById(job.postId);
    if (!post) return;

    const result = await generateImage({
      prompt: `Professional social media image for: ${post.caption.substring(0, 200)}`,
    });

    await Post.findByIdAndUpdate(post._id, { media_url: result.url });

    await recordUsage({
      organizationId: job.organizationId.toString(),
      userId: job.userId.toString(),
      type: 'IMAGE_GENERATION',
      provider: 'openai',
      modelName: 'dall-e-3',
      estimatedCost: result.estimatedCost,
    });
  }

  private async publishPost(job: IAutomationJob) {
    const post = await Post.findById(job.postId);
    if (!post) return;

    const { PostPlatform } = await import('@/models/PostPlatform');

    // Get post-platform records (which platforms were selected)
    const postPlatforms = await PostPlatform.find({
      post_id: post._id,
      status: { $in: ['pending', 'processing'] },
    }).populate('social_account_id');

    if (postPlatforms.length === 0) {
      await this.failJob(job._id.toString(), 'No platforms linked to post', 'INVALID_REQUEST');
      return;
    }

    let allSucceeded = true;

    for (const pp of postPlatforms) {
      const account = pp.social_account_id as unknown as { platform: string; access_token_encrypted: string; _id: unknown; platform_account_id: string };
      if (!account || account.platform !== pp.platform) continue;

      try {
        const token = decrypt(account.access_token_encrypted);

        if (account.platform === 'instagram') {
          await this.publishToInstagram(token, account, post);
        } else if (account.platform === 'facebook') {
          await this.publishToFacebook(token, account, post);
        } else if (account.platform === 'linkedin') {
          await this.publishToLinkedIn(token, account, post);
        }

        await PostPlatform.findByIdAndUpdate(pp._id, {
          status: 'published',
          published_at: new Date(),
        });

        await recordUsage({
          organizationId: job.organizationId.toString(),
          userId: job.userId.toString(),
          type: 'POST_PUBLISH',
          provider: account.platform,
          estimatedCost: 0,
        });
      } catch (error) {
        allSucceeded = false;
        const errorMessage = error instanceof Error ? error.message : 'Publish failed';
        await PostPlatform.findByIdAndUpdate(pp._id, {
          status: 'failed',
          error_message: errorMessage,
        });
        console.error(`Failed to publish to ${account.platform}:`, error);
      }
    }

    await Post.findByIdAndUpdate(post._id, {
      status: allSucceeded ? 'published' : 'partial',
      published_at: allSucceeded ? new Date() : undefined,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async publishToInstagram(token: string, account: any, post: any) {
    // Get Instagram business account ID from Facebook pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?fields=id,instagram_business_account{id}&access_token=${token}`
    );
    const pagesData = await pagesRes.json();
    const igAccount = pagesData.data?.[0]?.instagram_business_account;

    if (!igAccount) throw new Error('No Instagram business account found');

    if (post.media_url) {
      // Create media container
      const containerRes = await fetch(
        `https://graph.facebook.com/v19.0/${igAccount.id}/media`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: post.media_url,
            caption: post.caption,
            access_token: token,
          }),
        }
      );
      const container = await containerRes.json();

      if (container.id) {
        // Publish
        await fetch(
          `https://graph.facebook.com/v19.0/${igAccount.id}/media_publish`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              creation_id: container.id,
              access_token: token,
            }),
          }
        );
      }
    } else {
      // Text-only post (use story or skip)
      throw new Error('Instagram requires media for posts');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async publishToFacebook(token: string, account: any, post: any) {
    const pageId = account.metadata?.pageId || account.platform_account_id;
    const pageToken = account.metadata?.pageAccessToken || token;

    if (post.media_url) {
      // Post with image - use /photos endpoint for proper image display
      const photoRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/photos`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: post.media_url,
            caption: post.caption,
            access_token: pageToken,
          }),
        }
      );
      const photoData = await photoRes.json();
      if (photoData.error) {
        console.error('[Facebook] Photo post failed:', JSON.stringify(photoData.error));
        throw new Error(`Facebook photo post failed: ${photoData.error.message}`);
      }
    } else {
      // Text-only post - use /feed endpoint
      const feedRes = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/feed`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: post.caption,
            access_token: pageToken,
          }),
        }
      );
      const feedData = await feedRes.json();
      if (feedData.error) {
        console.error('[Facebook] Feed post failed:', JSON.stringify(feedData.error));
        throw new Error(`Facebook feed post failed: ${feedData.error.message}`);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async publishToLinkedIn(token: string, account: any, post: any) {
    await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:person:${account.platform_account_id}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: post.caption },
            shareMediaCategory: post.media_url ? 'IMAGE' : 'NONE',
            media: post.media_url ? [{
              status: 'READY',
              originalUrl: post.media_url,
            }] : [],
          },
        },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' },
      }),
    });
  }

  private async failJob(jobId: string, error: string, classification: string) {
    const job = await AutomationJob.findById(jobId);
    if (!job) return;

    const shouldRetry = job.attempts < job.maxAttempts && classification !== 'AUTH_ERROR';

    await AutomationJob.findByIdAndUpdate(jobId, {
      status: shouldRetry ? 'RETRYING' : 'FAILED',
      error,
      errorClassification: classification,
      scheduledAt: shouldRetry ? new Date(Date.now() + job.attempts * 60000) : undefined,
    });

    if (job.topicId) {
      await ContentTopic.findByIdAndUpdate(job.topicId, { status: 'FAILED' });
    }
  }

  private classifyError(error: string): string {
    if (error.includes('Unauthorized') || error.includes('401')) return 'AUTH_ERROR';
    if (error.includes('rate limit') || error.includes('429')) return 'RATE_LIMIT';
    if (error.includes('AI') || error.includes('openai')) return 'AI_ERROR';
    if (error.includes('image') || error.includes('dall')) return 'IMAGE_ERROR';
    if (error.includes('platform') || error.includes('API')) return 'PLATFORM_ERROR';
    if (error.includes('network') || error.includes('fetch')) return 'NETWORK_ERROR';
    return 'UNKNOWN';
  }

  private async scheduleFromTopics() {
    const pendingTopics = await ContentTopic.find({ status: 'PENDING' })
      .limit(5)
      .sort({ created_at: 1 });

    for (const topic of pendingTopics) {
      const existingJob = await AutomationJob.findOne({
        topicId: topic._id,
        status: { $nin: ['COMPLETED', 'CANCELLED'] },
      });

      if (!existingJob) {
        await AutomationJob.create({
          organizationId: topic.organizationId,
          userId: topic.userId,
          type: 'TOPIC_PROCESSING',
          status: 'QUEUED',
          topicId: topic._id,
          scheduledAt: new Date(),
        });
      }
    }
  }
}
