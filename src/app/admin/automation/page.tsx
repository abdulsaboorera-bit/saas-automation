'use client';

import { useState, useEffect } from 'react';
import { Bot, Pause, Play, AlertTriangle } from 'lucide-react';

export default function AdminAutomationPage() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalAction, setGlobalAction] = useState('');

  const fetchAutomations = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/automation');
    const data = await res.json();
    setAutomations(data.automations || []);
    setLoading(false);
  };

  useEffect(() => { fetchAutomations(); }, []);

  const handleToggle = async (automationId: string, orgId: string, currentStatus: string) => {
    const action = currentStatus === 'ACTIVE' ? 'pause' : 'resume';
    await fetch('/api/admin/automation', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ automationId, action, orgId }),
    });
    fetchAutomations();
  };

  const handleGlobalAction = async (action: string) => {
    if (action === 'pauseAll' && !confirm('WARNING: This will pause automation for ALL organizations. Continue?')) return;
    await fetch('/api/admin/automation', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ globalAction: action }),
    });
    fetchAutomations();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Automation Control</h1>
          <p className="text-slate-400 mt-1">Manage automation across all organizations</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleGlobalAction('pauseAll')} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-medium">
            <Pause className="w-4 h-4" /> Pause All
          </button>
          <button onClick={() => handleGlobalAction('resumeAll')} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium">
            <Play className="w-4 h-4" /> Resume All
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Posts/Week</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Topics Left</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Next Run</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Last Run</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : automations.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No automations found</td></tr>
            ) : automations.map((auto) => (
              <tr key={auto.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-white">{auto.organization?.name || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    auto.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                    auto.status === 'ADMIN_PAUSED' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{auto.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{auto.postsPerWeek}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{auto.topicsRemaining}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{auto.nextRunAt ? new Date(auto.nextRunAt).toLocaleString() : '—'}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{auto.lastRunAt ? new Date(auto.lastRunAt).toLocaleString() : 'Never'}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <button onClick={() => handleToggle(auto.id, auto.organization?.id, auto.status)}
                      className={`p-2 rounded-lg transition-colors ${auto.status === 'ACTIVE' ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}>
                      {auto.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
