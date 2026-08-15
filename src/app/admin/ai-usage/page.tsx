'use client';

import { useState, useEffect } from 'react';
import { Activity, Bot, Image, DollarSign } from 'lucide-react';

export default function AdminAIUsagePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/ai-usage');
      const d = await res.json();
      setData(d);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;

  const stats = data?.stats || [];

  const getStat = (type: string) => stats.find((s: any) => s._id === type) || { count: 0, totalCost: 0, totalTokens: 0 };

  const aiStat = getStat('AI_REQUEST');
  const imgStat = getStat('IMAGE_GENERATION');
  const publishStat = getStat('POST_PUBLISH');
  const totalCost = aiStat.totalCost + imgStat.totalCost;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">AI Usage</h1>
        <p className="text-slate-400 mt-1">Monitor AI and image generation costs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">AI Requests</p>
              <p className="text-3xl font-bold text-white mt-2">{aiStat.count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">{aiStat.totalTokens.toLocaleString()} tokens</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Images Generated</p>
              <p className="text-3xl font-bold text-white mt-2">{imgStat.count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">${imgStat.totalCost.toFixed(2)} est. cost</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Posts Published</p>
              <p className="text-3xl font-bold text-white mt-2">{publishStat.count.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-white mt-2">${totalCost.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
