'use client';

import { useState, useEffect } from 'react';
import { Database, HardDrive, FileText } from 'lucide-react';

export default function AdminStoragePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/storage');
      const d = await res.json();
      setData(d);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Storage</h1>
        <p className="text-slate-400 mt-1">Media storage overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Posts</p>
              <p className="text-3xl font-bold text-white mt-2">{data?.totalPosts || 0}</p>
            </div>
            <Database className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">With Media</p>
              <p className="text-3xl font-bold text-white mt-2">{data?.totalWithMedia || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Avg per Org</p>
              <p className="text-3xl font-bold text-white mt-2">{data?.averagePerOrg || 0}</p>
            </div>
            <HardDrive className="w-8 h-8 text-amber-400" />
          </div>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Storage by Organization</h2>
        <div className="space-y-3">
          {data?.topOrganizations?.map((org: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-sm text-white">{org.organization?.name || 'Unknown'}</span>
              <span className="text-sm text-slate-400">{org.fileCount} files</span>
            </div>
          )) || <p className="text-sm text-slate-400">No data</p>}
        </div>
      </div>
    </div>
  );
}
