import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';
import { OrganizationMember } from '@/models/OrganizationMember';
import { generateToken, setAuthCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password, full_name, organizationName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      full_name: full_name || '',
      role: 'MEMBER',
      status: 'ACTIVE',
      emailVerified: false,
    });

    // Create organization
    const orgName = organizationName || `${full_name || email.split('@')[0]}'s Organization`;
    const organization = await Organization.create({
      name: orgName,
      ownerId: user._id,
      status: 'ACTIVE',
      automationStatus: 'PAUSED',
    });

    // Add user as owner
    await OrganizationMember.create({
      organizationId: organization._id,
      userId: user._id,
      role: 'OWNER',
    });

    // Update user role to OWNER for their org
    await User.findByIdAndUpdate(user._id, { role: 'OWNER' });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: 'OWNER',
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: 'OWNER',
        organization: { id: organization._id.toString(), name: organization.name },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
