'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, Search, Eye, Users, Link2, FileText } from 'lucide-react';

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchOrgs = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/organizations?${params}`);
    const data = await res.json();
    setOrgs(data.organizations || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchOrgs(); }, [page, search]);

  const handleAction = async (orgId: string, action: string) => {
    if (action === 'block' && !confirm('Block this organization?')) return;
    await fetch('/api/admin/organizations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, action }),
    });
    fetchOrgs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Organizations</h1>
        <p className="text-slate-400 mt-1">{total} total organizations</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search organizations..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
        />
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Owner</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Users</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Social</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Posts</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Automation</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : orgs.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">No organizations found</td></tr>
              ) : orgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-white">{org.name}</p>
                    <p className="text-xs text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{org.owner?.email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{org.memberCount}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{org.socialAccountCount}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{org.postCount}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                      org.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                      org.status === 'SUSPENDED' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>{org.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                      org.automationStatus === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>{org.automationStatus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/organizations/${org.id}`} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg"><Eye className="w-4 h-4" /></Link>
                      {org.status === 'ACTIVE' && (
                        <button onClick={() => handleAction(org.id, 'block')} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"><Building2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 20 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-700/50">
            <p className="text-sm text-slate-400">Page {page} of {Math.ceil(total / 20)}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
