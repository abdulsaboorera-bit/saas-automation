'use client';

import { useState, useEffect } from 'react';
import { Flag, ToggleLeft, ToggleRight } from 'lucide-react';

const FEATURE_NAMES = [
  'INSTAGRAM_PUBLISHING', 'FACEBOOK_PUBLISHING', 'LINKEDIN_PUBLISHING',
  'AI_IMAGES', 'AUTOMATIC_MODE', 'ANALYTICS', 'CSV_IMPORT',
  'AI_CONTENT', 'SCHEDULING', 'BULK_POSTING',
];

export default function AdminFeaturesPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlags = async () => {
      const res = await fetch('/api/admin/features');
      const data = await res.json();
      setFlags(data.flags || []);
      setLoading(false);
    };
    fetchFlags();
  }, []);

  const handleToggle = async (name: string, enabled: boolean) => {
    await fetch('/api/admin/features', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, enabled }),
    });
    setFlags(prev => {
      const existing = prev.find(f => f.name === name);
      if (existing) {
        return prev.map(f => f.name === name ? { ...f, enabled } : f);
      }
      return [...prev, { name, enabled }];
    });
  };

  const isEnabled = (name: string) => {
    const flag = flags.find(f => f.name === name);
    return flag ? flag.enabled : false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Feature Flags</h1>
        <p className="text-slate-400 mt-1">Enable or disable platform features</p>
      </div>

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
        <div className="space-y-4">
          {FEATURE_NAMES.map((name) => {
            const enabled = isEnabled(name);
            return (
              <div key={name} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{name.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</p>
                  </div>
                </div>
                <button onClick={() => handleToggle(name, !enabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-slate-600'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
