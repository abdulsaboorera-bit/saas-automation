'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, UserX, Ban, CheckCircle } from 'lucide-react';

interface UserData {
  id: string; email: string; full_name: string; role: string; status: string;
  organization: { id: string; name: string } | null;
  created_at: string; lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ user: UserData; action: string } | null>(null);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('indefinite');

  const fetchUsers = async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, [page, search, statusFilter]);

  const handleAction = async () => {
    if (!actionModal) return;
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: actionModal.user.id, action: actionModal.action, reason, duration }),
    });
    setActionModal(null);
    setReason('');
    fetchUsers();
  };

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400',
    PENDING_VERIFICATION: 'bg-amber-500/10 text-amber-400',
    SUSPENDED: 'bg-orange-500/10 text-orange-400',
    BLOCKED: 'bg-red-500/10 text-red-400',
    DELETED: 'bg-gray-500/10 text-gray-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Users</h1>
          <p className="text-slate-400 mt-1">{total} total users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-[#1e293b] border border-slate-700 rounded-xl text-sm text-white focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING_VERIFICATION">Pending Verification</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Organization</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No users found</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{user.full_name || 'No Name'}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user.organization?.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-300 bg-slate-700/50 px-2 py-1 rounded-md">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${statusColors[user.status] || ''}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/users/${user.id}`} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-all" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      {user.status === 'ACTIVE' && (
                        <button onClick={() => setActionModal({ user, action: 'suspend' })} className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition-all" title="Suspend">
                          <UserX className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'SUSPENDED' && (
                        <button onClick={() => setActionModal({ user, action: 'activate' })} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-all" title="Activate">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {(user.status === 'ACTIVE' || user.status === 'SUSPENDED') && (
                        <button onClick={() => setActionModal({ user, action: 'block' })} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all" title="Block">
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      {user.status === 'BLOCKED' && (
                        <button onClick={() => setActionModal({ user, action: 'unblock' })} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded-lg transition-all" title="Unblock">
                          <CheckCircle className="w-4 h-4" />
                        </button>
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
            <p className="text-sm text-slate-400">Showing {((page - 1) * 20) + 1}-{Math.min(page * 20, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Previous</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded-lg disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {actionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-2">
              {actionModal.action === 'suspend' && 'Suspend User'}
              {actionModal.action === 'activate' && 'Activate User'}
              {actionModal.action === 'block' && 'Block User'}
              {actionModal.action === 'unblock' && 'Unblock User'}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {actionModal.action === 'block' && 'Are you sure you want to block this account?'}
              {actionModal.action === 'suspend' && `Suspend ${actionModal.user.email}?`}
              {actionModal.action === 'activate' && `Activate ${actionModal.user.email}?`}
              {actionModal.action === 'unblock' && `Unblock ${actionModal.user.email}?`}
            </p>
            {(actionModal.action === 'suspend' || actionModal.action === 'block') && (
              <>
                <label className="block text-sm font-medium text-slate-300 mb-1">Reason</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white mb-3"
                  rows={3}
                />
              </>
            )}
            {actionModal.action === 'suspend' && (
              <>
                <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white mb-3">
                  <option value="7days">7 Days</option>
                  <option value="30days">30 Days</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </>
            )}
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setActionModal(null); setReason(''); }} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={handleAction} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
