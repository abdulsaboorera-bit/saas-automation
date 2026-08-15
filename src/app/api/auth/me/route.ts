import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { OrganizationMember } from '@/models/OrganizationMember';
import { Organization } from '@/models/Organization';

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
