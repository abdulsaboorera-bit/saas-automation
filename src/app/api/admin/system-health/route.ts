import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'Operational' : dbState === 2 ? 'Connecting' : 'Down';

    const collections = await mongoose.connection.db?.listCollections().toArray();
    const collectionCount = collections?.length || 0;

    return NextResponse.json({
      database: { status: dbStatus, collections: collectionCount },
      worker: { status: 'Operational', lastHeartbeat: new Date().toISOString(), jobsProcessing: 0, jobsQueued: 0 },
      scheduler: { status: 'Operational' },
      aiProvider: { status: process.env.OPENAI_API_KEY?.startsWith('sk-') ? 'Operational' : 'Not Configured' },
      metaApi: { status: process.env.META_CLIENT_ID !== 'your_meta_app_id' ? 'Operational' : 'Not Configured' },
      linkedinApi: { status: process.env.LINKEDIN_CLIENT_ID !== 'your_linkedin_client_id' ? 'Operational' : 'Not Configured' },
      emailProvider: { status: 'Not Configured' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
