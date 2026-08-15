'use client';

import { useState, useEffect } from 'react';
import { FileText, Search } from 'lucide-react';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [page, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Posts</h1>
        <p className="text-slate-400 mt-1">{total} total posts</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {['', 'draft', 'scheduled', 'processing', 'published', 'failed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${statusFilter === s ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Content</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Scheduled</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Published</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-slate-300">{post.organization?.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-white max-w-xs truncate">{post.caption}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                    post.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                    post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{post.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : '—'}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{post.publishedAt ? new Date(post.publishedAt).toLocaleString() : '—'}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
