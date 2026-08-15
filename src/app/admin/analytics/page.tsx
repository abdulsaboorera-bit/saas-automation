'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Bot, TrendingUp } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/ai-usage?startDate=${new Date(Date.now() - days * 86400000).toISOString()}`);
      const d = await res.json();
      setData(d);
      setLoading(false);
    };
    fetchData();
  }, [days]);

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;

  const stats = data?.stats || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Platform usage analytics</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-3 py-1.5 text-sm rounded-xl ${days === d ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
              {d} Days
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat: any) => (
          <div key={stat._id} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
            <p className="text-sm text-slate-400">{stat._id}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.count.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">${stat.totalCost?.toFixed(2) || '0.00'} estimated cost</p>
            {stat.totalTokens > 0 && (
              <p className="text-xs text-slate-500">{stat.totalTokens.toLocaleString()} tokens</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
