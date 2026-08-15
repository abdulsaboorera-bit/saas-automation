import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { User } from '@/models/User';
import { OrganizationMember } from '@/models/OrganizationMember';
import { generateToken, setAuthCookie } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (user.status === 'BLOCKED') {
      return NextResponse.json({ error: 'Your account has been blocked. Please contact support.' }, { status: 403 });
    }

    if (user.status === 'SUSPENDED') {
      return NextResponse.json({ error: 'Your account has been suspended. Please contact support.' }, { status: 403 });
    }

    if (user.status === 'DELETED') {
      return NextResponse.json({ error: 'Account not found' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await User.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Get user's organization
    const membership = await OrganizationMember.findOne({ userId: user._id });

    await User.findByIdAndUpdate(user._id, {
      lastLoginAt: new Date(),
      loginAttempts: 0,
      lockedUntil: null,
    });

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        organization: membership ? { id: membership.organizationId.toString(), role: membership.role } : null,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
