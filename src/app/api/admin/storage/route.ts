import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { connectDB } from '@/lib/db/mongodb';
import { Post } from '@/models/Post';
import { Organization } from '@/models/Organization';

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const totalPosts = await Post.countDocuments({});
    const totalWithMedia = await Post.countDocuments({ media_url: { $ne: null } });

    const orgStorage = await Post.aggregate([
      { $match: { media_url: { $ne: null } } },
      { $group: { _id: '$organizationId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const orgsWithStorage = await Promise.all(
      orgStorage.map(async (item) => {
        const org = await Organization.findById(item._id).select('name');
        return {
          organization: org ? { id: org._id.toString(), name: org.name } : null,
          fileCount: item.count,
        };
      })
    );

    return NextResponse.json({
      totalPosts,
      totalWithMedia,
      averagePerOrg: totalPosts > 0 ? Math.round(totalWithMedia / (orgStorage.length || 1)) : 0,
      topOrganizations: orgsWithStorage,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Forbidden') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
