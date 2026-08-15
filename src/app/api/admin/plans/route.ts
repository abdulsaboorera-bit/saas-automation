import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Plan } from '@/models/Plan';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();
    const plans = await Plan.find({}).sort({ price: 1 });
    return NextResponse.json({ plans: plans.map(p => ({ ...p.toObject(), id: p._id.toString() })) });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();
    const { planId, ...updateData } = body;

    if (planId) {
      const plan = await Plan.findByIdAndUpdate(planId, updateData, { new: true });
      return NextResponse.json({ plan: plan ? { ...plan.toObject(), id: plan._id.toString() } : null });
    } else {
      const plan = await Plan.create(updateData);
      return NextResponse.json({ plan: { ...plan.toObject(), id: plan._id.toString() } });
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
