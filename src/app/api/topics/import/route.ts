import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { ContentTopic } from '@/models/ContentTopic';
import { OrganizationMember } from '@/models/OrganizationMember';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    await connectDB();

    const membership = await OrganizationMember.findOne({ userId: user._id });
    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.csv')) {
      return NextResponse.json({ error: 'Only CSV files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());

    if (lines.length > 500) {
      return NextResponse.json({ error: 'Too many rows (max 500)' }, { status: 400 });
    }

    // Parse CSV - expect: id,topic,status
    const topics: Array<{ topic: string; csvRowNumber: number }> = [];
    const startLine = lines[0]?.includes('topic') || lines[0]?.includes('Topic') ? 1 : 0;

    for (let i = startLine; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      const topicText = parts[1] || parts[0]; // Support both "id,topic" and "topic" formats

      if (topicText && topicText.length > 0 && topicText !== 'topic' && topicText !== 'Topic') {
        topics.push({ topic: topicText, csvRowNumber: i + 1 });
      }
    }

    if (topics.length === 0) {
      return NextResponse.json({ error: 'No valid topics found in CSV' }, { status: 400 });
    }

    // Check for duplicates within the CSV
    const uniqueTopics = [...new Set(topics.map(t => t.topic))];

    // Create topics
    const created = await ContentTopic.insertMany(
      uniqueTopics.map((topic) => ({
        organizationId: membership.organizationId,
        userId: user._id,
        topic,
        status: 'PENDING' as const,
        csvRowNumber: topics.find(t => t.topic === topic)?.csvRowNumber,
        csvFileName: file.name,
      }))
    );

    return NextResponse.json({
      imported: created.length,
      skipped: topics.length - uniqueTopics.length,
      message: `${created.length} topics imported successfully`,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
