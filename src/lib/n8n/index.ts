import { Platform } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_API_KEY = process.env.N8N_API_KEY;

interface N8nJobPayload {
  job_id: string;
  user_id: string;
  post_id: string;
  caption: string;
  media_url: string | null;
  scheduled_at: string | null;
  platforms: {
    platform: Platform;
    social_account_id: string;
    account_name: string;
    username: string | null;
  }[];
}

export async function sendJobToN8n(
  post: { _id: unknown; user_id: unknown; caption: string; media_url: string | null; scheduled_at: Date | null },
  accounts: { platform: Platform; platform_account_id: string; account_name: string; username: string | null }[]
): Promise<{ jobId: string; success: boolean; error?: string }> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  const jobId = uuidv4();

  const payload: N8nJobPayload = {
    job_id: jobId,
    user_id: String(post.user_id),
    post_id: String(post._id),
    caption: post.caption,
    media_url: post.media_url,
    scheduled_at: post.scheduled_at ? post.scheduled_at.toISOString() : null,
    platforms: accounts.map((acc) => ({
      platform: acc.platform,
      social_account_id: acc.platform_account_id,
      account_name: acc.account_name,
      username: acc.username,
    })),
  };

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (N8N_API_KEY) {
      headers['X-N8N-API-KEY'] = N8N_API_KEY;
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n webhook failed: ${response.status} - ${errorText}`);
      return { jobId, success: false, error: `n8n returned ${response.status}` };
    }

    return { jobId, success: true };
  } catch (error) {
    console.error('n8n webhook error:', error);
    return {
      jobId,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function validateN8nCallback(
  body: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  const secret = process.env.N8N_CALLBACK_SECRET;
  if (!secret) return false;

  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}
