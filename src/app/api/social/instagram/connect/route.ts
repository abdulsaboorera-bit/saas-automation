import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createOAuthState, getInstagramAuthUrl, getBaseUrl } from '@/lib/oauth';
import { OrganizationMember } from '@/models/OrganizationMember';
import { connectDB } from '@/lib/db/mongodb';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const origin = getBaseUrl(request);
    await connectDB();
    const membership = await OrganizationMember.findOne({ userId: user._id });
    const state = await createOAuthState(user._id.toString(), 'instagram');
    const url = getInstagramAuthUrl(user._id.toString(), state, origin);

    return NextResponse.json({ url, organizationId: membership?.organizationId?.toString() });
  } catch (error) {
    console.error('Instagram connect error:', error);
    return NextResponse.json({ error: 'Failed to initiate connection' }, { status: 500 });
  }
}
