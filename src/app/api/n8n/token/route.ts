import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { SocialAccount } from '@/models/SocialAccount';
import { decrypt } from '@/lib/security/encryption';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const socialAccountId = searchParams.get('social_account_id');
    const postId = searchParams.get('post_id');
    const secret = searchParams.get('secret');

    if (!socialAccountId) {
      return NextResponse.json(
        { error: 'social_account_id is required' },
        { status: 400 }
      );
    }

    if (secret !== process.env.N8N_CALLBACK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const account = await SocialAccount.findOne({
      _id: socialAccountId,
      status: 'active',
    }).lean();

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const accessToken = decrypt(account.access_token_encrypted);

    return NextResponse.json({
      access_token: accessToken,
      expires_at: account.token_expires_at,
    });
  } catch (error) {
    console.error('n8n token endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
