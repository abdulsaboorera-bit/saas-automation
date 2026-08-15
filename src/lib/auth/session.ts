import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/mongodb';
import { User, IUser } from '@/models/User';
import { Organization, IOrganization } from '@/models/Organization';
import { OrganizationMember, IOrganizationMember } from '@/models/OrganizationMember';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'auth_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export async function getCurrentUser(): Promise<IUser | null> {
  try {
    const token = await getAuthCookie();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<IUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(): Promise<IUser> {
  const user = await requireAuth();
  if (!['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'].includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function requireSuperAdmin(): Promise<IUser> {
  const user = await requireAuth();
  if (user.role !== 'SUPER_ADMIN') {
    throw new Error('Forbidden: Super Admin access required');
  }
  return user;
}

export async function getUserOrganization(userId: string): Promise<{ organization: IOrganization; membership: IOrganizationMember } | null> {
  await connectDB();
  const membership = await OrganizationMember.findOne({ userId });
  if (!membership) return null;

  const organization = await Organization.findById(membership.organizationId);
  if (!organization) return null;

  return { organization, membership };
}

export function hasPermission(userRole: string, action: string): boolean {
  const permissions: Record<string, string[]> = {
    SUPER_ADMIN: ['*'],
    ADMIN: [
      'users:read', 'users:write', 'users:suspend', 'users:activate',
      'organizations:read', 'organizations:write',
      'automation:read', 'automation:pause', 'automation:resume',
      'jobs:read', 'jobs:retry', 'jobs:cancel',
      'posts:read', 'topics:read',
      'social_accounts:read', 'social_accounts:disconnect',
      'notifications:send',
    ],
    SUPPORT_ADMIN: [
      'users:read', 'organizations:read',
      'impersonate:start', 'impersonate:stop',
      'notifications:send',
    ],
    OWNER: ['organization:manage', 'automation:manage', 'posts:manage'],
    MANAGER: ['posts:manage', 'topics:manage'],
    MEMBER: ['posts:read', 'topics:read'],
  };

  const rolePermissions = permissions[userRole] || [];
  return rolePermissions.includes('*') || rolePermissions.includes(action);
}

export function generateImpersonationToken(adminId: string, targetUserId: string): string {
  return jwt.sign(
    { adminId, targetUserId, impersonation: true },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export function verifyImpersonationToken(token: string): { adminId: string; targetUserId: string } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { adminId: string; targetUserId: string; impersonation: boolean };
    if (!payload.impersonation) return null;
    return { adminId: payload.adminId, targetUserId: payload.targetUserId };
  } catch {
    return null;
  }
}
