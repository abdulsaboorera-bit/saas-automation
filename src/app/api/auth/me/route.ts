import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { OrganizationMember } from '@/models/OrganizationMember';
import { Organization } from '@/models/Organization';
import { User } from '@/models/User';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const membership = await OrganizationMember.findOne({ userId: user._id });
    const organization = membership ? await Organization.findById(membership.organizationId) : null;

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status,
        organization: organization ? {
          id: organization._id.toString(),
          name: organization.name,
          status: organization.status,
          automationStatus: organization.automationStatus,
        } : null,
        membershipRole: membership?.role || null,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.full_name !== undefined) updates.full_name = body.full_name;
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(user._id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
