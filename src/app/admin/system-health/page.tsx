'use client';

import { useState, useEffect } from 'react';
import { Heart, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function AdminSystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      const res = await fetch('/api/admin/system-health');
      const data = await res.json();
      setHealth(data);
      setLoading(false);
    };
    fetchHealth();
  }, []);

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;

  const services = health ? Object.entries(health).filter(([k]) => k !== 'database' && k !== 'worker' && k !== 'scheduler').map(([name, data]: [string, any]) => ({
    name: name.replace(/([A-Z])/g, ' $1').trim(),
    status: data.status || 'Unknown',
  })) : [];

  const getStatusIcon = (status: string) => {
    if (status === 'Operational') return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (status === 'Down' || status === 'Not Configured') return <XCircle className="w-5 h-5 text-red-400" />;
    return <AlertTriangle className="w-5 h-5 text-amber-400" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'Operational') return 'bg-emerald-500/10 text-emerald-400';
    if (status === 'Down' || status === 'Not Configured') return 'bg-red-500/10 text-red-400';
    return 'bg-amber-500/10 text-amber-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">System Health</h1>
        <p className="text-slate-400 mt-1">Platform service status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Database</h2>
          <div className="flex items-center gap-3">
            {getStatusIcon(health?.database?.status || 'Unknown')}
            <span className={`text-sm font-medium px-3 py-1 rounded-lg ${getStatusColor(health?.database?.status || 'Unknown')}`}>
              {health?.database?.status || 'Unknown'}
            </span>
            <span className="text-sm text-slate-400">{health?.database?.collections || 0} collections</span>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Worker</h2>
          <div className="flex items-center gap-3">
            {getStatusIcon(health?.worker?.status || 'Unknown')}
            <span className={`text-sm font-medium px-3 py-1 rounded-lg ${getStatusColor(health?.worker?.status || 'Unknown')}`}>
              {health?.worker?.status || 'Unknown'}
            </span>
          </div>
          {health?.worker?.lastHeartbeat && (
            <p className="text-xs text-slate-500 mt-2">Last heartbeat: {new Date(health.worker.lastHeartbeat).toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <span className="text-sm text-white capitalize">{service.name}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
