'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Minus } from 'lucide-react';

export default function AdminCreditsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showGrant, setShowGrant] = useState(false);
  const [formData, setFormData] = useState({ orgId: '', creditType: 'AI', amount: 10, reason: '', action: 'grant' });

  const fetchTransactions = async () => {
    const res = await fetch('/api/admin/credits');
    const data = await res.json();
    setTransactions(data.transactions || []);
    setTotal(data.total || 0);
    setLoading(false);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleGrant = async () => {
    await fetch('/api/admin/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowGrant(false);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Credits</h1>
          <p className="text-slate-400 mt-1">{total} credit transactions</p>
        </div>
        <button onClick={() => setShowGrant(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> Grant Credits
        </button>
      </div>

      {showGrant && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Grant/Revoke Credits</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Organization ID</label>
              <input value={formData.orgId} onChange={(e) => setFormData({ ...formData, orgId: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Type</label>
              <select value={formData.creditType} onChange={(e) => setFormData({ ...formData, creditType: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white">
                <option value="AI">AI</option>
                <option value="IMAGE">Image</option>
                <option value="POST">Post</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Amount</label>
              <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Action</label>
              <select value={formData.action} onChange={(e) => setFormData({ ...formData, action: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white">
                <option value="grant">Grant</option>
                <option value="revoke">Revoke</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm text-slate-400 mb-1">Reason</label>
            <input value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleGrant} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm">Submit</button>
            <button onClick={() => setShowGrant(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Organization</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Credit</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Reason</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-white">{t.organization?.name || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${t.type === 'GRANT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{t.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{t.creditType}</td>
                <td className="px-6 py-4 text-sm text-white">{t.amount}</td>
                <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{t.reason}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
