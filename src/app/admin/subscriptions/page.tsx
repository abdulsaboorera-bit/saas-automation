'use client';

import { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/subscriptions');
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setTotal(data.total || 0);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
        <p className="text-slate-400 mt-1">{total} total subscriptions</p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Customer</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Plan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Start</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Renewal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : subscriptions.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No subscriptions found</td></tr>
            ) : subscriptions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 text-sm text-white">{sub.organization?.name || '—'}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{sub.plan?.name || '—'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    sub.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                    sub.status === 'TRIAL' ? 'bg-blue-500/10 text-blue-400' :
                    sub.status === 'CANCELLED' ? 'bg-red-500/10 text-red-400' :
                    'bg-slate-500/10 text-slate-400'
                  }`}>{sub.status}</span>
                </td>
                <td className="px-6 py-4 text-sm text-white">${sub.amount}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(sub.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
