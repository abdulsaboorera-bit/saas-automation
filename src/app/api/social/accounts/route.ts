import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { SocialAccount } from '@/models/SocialAccount';
import { OrganizationMember } from '@/models/OrganizationMember';
import { disconnectSocialAccount } from '@/lib/oauth';

export async function GET() {
  try {
    const user = await requireAuth();
    await connectDB();

    const membership = await OrganizationMember.findOne({ userId: user._id });
    if (!membership) {
      return NextResponse.json({ accounts: [] });
    }

    const accounts = await SocialAccount.find({
      user_id: user._id,
      organizationId: membership.organizationId,
      status: 'active',
    }).sort({ created_at: -1 });

    return NextResponse.json({
      accounts: accounts.map(a => ({
        id: a._id.toString(),
        platform: a.platform,
        account_name: a.account_name,
        username: a.username,
        profile_image_url: a.profile_image_url,
        status: a.status,
        token_expires_at: a.token_expires_at,
        created_at: a.created_at,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const { accountId } = await request.json();
    if (!accountId) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 });
    }

    const success = await disconnectSocialAccount(user._id.toString(), accountId);
    if (!success) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
