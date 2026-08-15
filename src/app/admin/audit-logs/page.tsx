'use client';

import { useState, useEffect } from 'react';
import { ClipboardList, Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/audit-logs?page=${page}&limit=50`);
    const data = await res.json();
    setLogs(data.logs || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Audit Logs</h1>
        <p className="text-slate-400 mt-1">{total} audit entries</p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Admin</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Action</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Target</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Details</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : logs.map((log) => (
              <tr key={log._id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-white">{log.adminId?.email || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    log.action.includes('SUSPENDED') || log.action.includes('BLOCKED') ? 'bg-red-500/10 text-red-400' :
                    log.action.includes('ACTIVATED') || log.action.includes('UNBLOCKED') ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>{log.action}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{log.targetType}: {log.targetId?.slice(-8)}</td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{JSON.stringify(log.metadata)}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {total > 50 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">Page {page} of {Math.ceil(total / 50)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 50 >= total} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
