import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { createOAuthState, getLinkedInAuthUrl } from '@/lib/oauth';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { origin } = new URL(request.url);
    const state = await createOAuthState(user._id.toString(), 'linkedin');
    const url = getLinkedInAuthUrl(user._id.toString(), state, origin);

    return NextResponse.json({ url });
  } catch (error) {
    console.error('LinkedIn connect error:', error);
    return NextResponse.json({ error: 'Failed to initiate connection' }, { status: 500 });
  }
}
