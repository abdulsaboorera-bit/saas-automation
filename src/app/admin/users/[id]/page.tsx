'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Link2, Bot, FileText, Clock, Ban, CheckCircle, UserX, Key, LogOut } from 'lucide-react';

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const res = await fetch(`/api/admin/users/${params.id}`);
    if (res.ok) {
      const d = await res.json();
      setData(d);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUser(); }, [params.id]);

  const handleAction = async (action: string, reason?: string) => {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: params.id, action, reason }),
    });
    fetchUser();
  };

  const handleImpersonate = async () => {
    const res = await fetch(`/api/admin/users/${params.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'impersonate' }),
    });
    const d = await res.json();
    if (d.impersonationToken) {
      document.cookie = `impersonation_token=${d.impersonationToken}; path=/; httpOnly`;
      window.location.href = '/dashboard';
    }
  };

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;
  if (!data) return <div className="text-slate-400 text-center py-12">User not found</div>;

  const { user, organization, socialAccounts, automation, usageStats, recentTopics } = data;

  const statusColors: Record<string, string> = {
    ACTIVE: 'text-emerald-400 bg-emerald-500/10',
    PENDING_VERIFICATION: 'text-amber-400 bg-amber-500/10',
    SUSPENDED: 'text-orange-400 bg-orange-500/10',
    BLOCKED: 'text-red-400 bg-red-500/10',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{user.full_name || 'User Detail'}</h1>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <span className={`text-sm font-medium px-2 py-1 rounded-md ${statusColors[user.status] || ''}`}>{user.status}</span>
              </div>
              <div>
                <p className="text-xs text-slate-400">Role</p>
                <p className="text-sm text-white">{user.role}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Created</p>
                <p className="text-sm text-white">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Login</p>
                <p className="text-sm text-white">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}</p>
              </div>
            </div>
          </div>

          {/* Organization */}
          {organization && (
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Name</p>
                  <p className="text-sm text-white">{organization.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Status</p>
                  <p className="text-sm text-white">{organization.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* Social Accounts */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Social Accounts</h2>
            {socialAccounts.length === 0 ? (
              <p className="text-sm text-slate-400">No connected accounts</p>
            ) : (
              <div className="space-y-3">
                {socialAccounts.map((acc: Record<string, unknown>) => (
                  <div key={acc.id as string} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        acc.platform === 'instagram' ? 'bg-pink-500/20 text-pink-400' :
                        acc.platform === 'facebook' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-blue-600/20 text-blue-400'
                      }`}>
                        <Link2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{(acc.account_name || acc.accountName) as string}</p>
                        <p className="text-xs text-slate-400">{acc.platform as string} · {acc.status as string}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Stats */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Usage</h2>
            <div className="grid grid-cols-3 gap-4">
              {usageStats.map((stat: any) => (
                <div key={stat._id} className="p-3 bg-slate-800/50 rounded-xl text-center">
                  <p className="text-2xl font-bold text-white">{stat.count}</p>
                  <p className="text-xs text-slate-400">{stat._id}</p>
                  <p className="text-xs text-slate-500">${stat.totalCost.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Actions</h2>
            <div className="space-y-2">
              {user.status === 'ACTIVE' && (
                <>
                  <button onClick={() => handleAction('suspend')} className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-xl transition-colors text-sm">
                    <UserX className="w-4 h-4" /> Suspend
                  </button>
                  <button onClick={() => handleAction('block')} className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm">
                    <Ban className="w-4 h-4" /> Block
                  </button>
                </>
              )}
              {user.status === 'SUSPENDED' && (
                <button onClick={() => handleAction('activate')} className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors text-sm">
                  <CheckCircle className="w-4 h-4" /> Activate
                </button>
              )}
              {user.status === 'BLOCKED' && (
                <button onClick={() => handleAction('unblock')} className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl transition-colors text-sm">
                  <CheckCircle className="w-4 h-4" /> Unblock
                </button>
              )}
              <button onClick={() => handleAction('forcePasswordReset')} className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm">
                <Key className="w-4 h-4" /> Force Password Reset
              </button>
              <button onClick={handleImpersonate} className="w-full flex items-center gap-3 px-4 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl transition-colors text-sm">
                <LogOut className="w-4 h-4" /> Login as Customer
              </button>
            </div>
          </div>

          {/* Automation */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Automation</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className="text-white">{automation?.status || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Posts/Week</span>
                <span className="text-white">{automation?.postsPerWeek || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Topics Remaining</span>
                <span className="text-white">{automation?.topicsRemaining || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Last Run</span>
                <span className="text-white">{automation?.lastRunAt ? new Date(automation.lastRunAt).toLocaleDateString() : 'Never'}</span>
              </div>
            </div>
          </div>

          {/* Recent Topics */}
          <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Topics</h2>
            {recentTopics?.length === 0 ? (
              <p className="text-sm text-slate-400">No topics</p>
            ) : (
              <div className="space-y-2">
                {recentTopics?.slice(0, 5).map((t: Record<string, unknown>) => (
                  <div key={t._id as string} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300 truncate">{t.topic as string}</span>
                    <span className="text-xs text-slate-500">{t.status as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
