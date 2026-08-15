'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, RefreshCw, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/jobs?${params}`);
    const data = await res.json();
    setJobs(data.jobs || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [page, statusFilter]);

  const handleAction = async (jobId: string, action: string) => {
    await fetch('/api/admin/jobs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, action }),
    });
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs</h1>
          <p className="text-slate-400 mt-1">{total} total jobs</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {['', 'QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'RETRYING'].map((s) => (
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
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Job ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Attempts</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Error</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : jobs.map((job) => (
              <tr key={job._id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-xs text-slate-500 font-mono">{job._id?.slice(-8)}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{job.organization?.name || '—'}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-300 bg-slate-700/50 px-2 py-1 rounded-md">{job.type}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    job.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                    job.status === 'FAILED' ? 'bg-red-500/10 text-red-400' :
                    job.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{job.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{job.attempts}/{job.maxAttempts}</td>
                <td className="px-6 py-4 text-sm text-red-400 max-w-xs truncate">{job.error || '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    {job.status === 'FAILED' && (
                      <button onClick={() => handleAction(job._id, 'retry')} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg" title="Retry">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                    {['QUEUED', 'RETRYING'].includes(job.status) && (
                      <button onClick={() => handleAction(job._id, 'cancel')} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg" title="Cancel">
                        <XCircle className="w-4 h-4" />
                      </button>
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
