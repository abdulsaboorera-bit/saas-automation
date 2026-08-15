import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Notification } from '@/models/Notification';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      Notification.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments({}),
    ]);

    return NextResponse.json({
      notifications: notifications.map(n => ({ ...n.toObject(), id: n._id.toString() })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { type, channel, title, message, userId, orgId } = body;

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message required' }, { status: 400 });
    }

    if (type === 'GLOBAL_ANNOUNCEMENT') {
      const notification = await Notification.create({
        type: 'GLOBAL_ANNOUNCEMENT',
        channel: channel || 'IN_APP',
        title,
        message,
        sentBy: admin._id,
      });
      return NextResponse.json({ notification: { ...notification.toObject(), id: notification._id.toString() } });
    }

    if (type === 'ORG_ANNOUNCEMENT' && orgId) {
      const notification = await Notification.create({
        organizationId: orgId,
        type: 'ORG_ANNOUNCEMENT',
        channel: channel || 'IN_APP',
        title,
        message,
        sentBy: admin._id,
      });
      return NextResponse.json({ notification: { ...notification.toObject(), id: notification._id.toString() } });
    }

    if (type === 'INDIVIDUAL_MESSAGE' && userId) {
      const notification = await Notification.create({
        userId,
        type: 'INDIVIDUAL_MESSAGE',
        channel: channel || 'IN_APP',
        title,
        message,
        sentBy: admin._id,
      });
      return NextResponse.json({ notification: { ...notification.toObject(), id: notification._id.toString() } });
    }

    return NextResponse.json({ error: 'Invalid notification configuration' }, { status: 400 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
