'use client';

import { useState, useEffect } from 'react';
import { Link2, Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export default function AdminSocialAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [platform, setPlatform] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (platform) params.set('platform', platform);
    if (status) params.set('status', status);
    const res = await fetch(`/api/admin/social-accounts?${params}`);
    const data = await res.json();
    setAccounts(data.accounts || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchAccounts(); }, [page, platform, status]);

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Disconnect this social account?')) return;
    await fetch('/api/admin/social-accounts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, action: 'disconnect' }),
    });
    fetchAccounts();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Social Accounts</h1>
        <p className="text-slate-400 mt-1">{total} connected accounts</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <select value={platform} onChange={(e) => { setPlatform(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-sm text-white">
          <option value="">All Platforms</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="linkedin">LinkedIn</option>
        </select>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-sm text-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="error">Error</option>
          <option value="disconnected">Disconnected</option>
        </select>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Platform</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Account</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Connected</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : accounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <p className="text-sm text-white">{acc.user?.name || '—'}</p>
                  <p className="text-xs text-slate-500">{acc.user?.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    acc.platform === 'instagram' ? 'bg-pink-500/10 text-pink-400' :
                    acc.platform === 'facebook' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-blue-600/10 text-blue-400'
                  }`}>{acc.platform}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-white">{acc.accountName}</p>
                  <p className="text-xs text-slate-500">@{acc.username || '—'}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    acc.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    acc.status === 'error' ? 'bg-red-500/10 text-red-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{acc.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(acc.connectedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => handleDisconnect(acc.id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg" title="Disconnect">
                      <XCircle className="w-4 h-4" />
                    </button>
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
