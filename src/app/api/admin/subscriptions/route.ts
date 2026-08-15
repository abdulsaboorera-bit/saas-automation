import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Subscription } from '@/models/Subscription';
import { Organization } from '@/models/Organization';
import { Plan } from '@/models/Plan';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const [subscriptions, total] = await Promise.all([
      Subscription.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Subscription.countDocuments(query),
    ]);

    const subsWithDetails = await Promise.all(
      subscriptions.map(async (sub) => {
        const org = await Organization.findById(sub.organizationId).select('name');
        const plan = await Plan.findById(sub.planId).select('name price');
        return {
          ...sub.toObject(),
          id: sub._id.toString(),
          organization: org ? { id: org._id.toString(), name: org.name } : null,
          plan: plan ? { id: plan._id.toString(), name: plan.name, price: plan.price } : null,
        };
      })
    );

    return NextResponse.json({
      subscriptions: subsWithDetails,
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
