'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Search, SkipForward, XCircle } from 'lucide-react';

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTopics = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/topics?${params}`);
    const data = await res.json();
    setTopics(data.topics || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchTopics(); }, [page, statusFilter]);

  const handleAction = async (topicId: string, action: string) => {
    await fetch('/api/admin/topics', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topicId, action }),
    });
    fetchTopics();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Content Topics</h1>
        <p className="text-slate-400 mt-1">{total} total topics</p>
      </div>

      <div className="flex gap-3">
        {['', 'PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'SKIPPED', 'CANCELLED'].map((s) => (
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
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Topic</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Created</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : topics.map((topic) => (
              <tr key={topic._id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-slate-300">{topic.organization?.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-white max-w-xs truncate">{topic.topic}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    topic.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400' :
                    topic.status === 'PENDING' ? 'bg-blue-500/10 text-blue-400' :
                    topic.status === 'FAILED' ? 'bg-red-500/10 text-red-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{topic.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(topic.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    {topic.status === 'PENDING' && (
                      <>
                        <button onClick={() => handleAction(topic._id, 'skip')} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg" title="Skip">
                          <SkipForward className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleAction(topic._id, 'cancel')} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg" title="Cancel">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
