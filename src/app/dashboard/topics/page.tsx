'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText } from 'lucide-react';

interface Topic {
  id: string; topic: string; status: string; created_at: string; csvFileName: string | null;
}

export default function ContentTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/topics?${params}`);
    const data = await res.json();
    setTopics(data.topics || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchTopics(); }, [page, statusFilter]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/topics/import', { method: 'POST', body: formData });
    setUploading(false);
    fetchTopics();
    e.target.value = '';
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-blue-500/10 text-blue-400',
    PROCESSING: 'bg-amber-500/10 text-amber-400',
    PUBLISHED: 'bg-emerald-500/10 text-emerald-400',
    FAILED: 'bg-red-500/10 text-red-400',
    SKIPPED: 'bg-slate-500/10 text-slate-400',
    CANCELLED: 'bg-gray-500/10 text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Topics</h1>
          <p className="text-gray-500 mt-1">{total} topics</p>
        </div>
        <div className="flex gap-3">
          <label className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-indigo-700 transition-colors ${uploading ? 'opacity-50' : ''}`}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Import CSV'}
            <input type="file" accept=".csv" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {['', 'PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED', 'SKIPPED'].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-sm rounded-xl transition-colors ${statusFilter === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Topic</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Source</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : topics.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No topics yet. Import a CSV to get started.</p>
              </td></tr>
            ) : topics.map((topic) => (
              <tr key={topic.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{topic.topic}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${statusColors[topic.status] || ''}`}>{topic.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{topic.csvFileName || 'Manual'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{new Date(topic.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
