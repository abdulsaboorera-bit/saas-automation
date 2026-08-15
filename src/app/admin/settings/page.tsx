'use client';

import { useState, useEffect } from 'react';
import { Settings, AlertTriangle, Pause, Play } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleToggle = async (setting: string, value: boolean) => {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setting, value, reason: `Toggled by admin` }),
    });
    setSettings({ ...settings, [setting]: value });
  };

  if (loading) return <div className="text-slate-400 text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Platform-wide settings</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Maintenance Mode</h3>
                <p className="text-sm text-slate-400">Show maintenance page to all non-admin users</p>
              </div>
            </div>
            <button onClick={() => handleToggle('maintenance_mode', !settings?.maintenanceMode)}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings?.maintenanceMode ? 'bg-amber-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings?.maintenanceMode ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Pause className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Global Automation Pause</h3>
                <p className="text-sm text-slate-400">Pause automation for ALL organizations</p>
              </div>
            </div>
            <button onClick={() => handleToggle('global_automation_paused', !settings?.globalAutomationPaused)}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings?.globalAutomationPaused ? 'bg-red-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings?.globalAutomationPaused ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Publishing Kill Switch</h3>
                <p className="text-sm text-slate-400">Stop ALL social media publishing (AI can still generate)</p>
              </div>
            </div>
            <button onClick={() => handleToggle('global_publishing_stopped', !settings?.globalPublishingStopped)}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings?.globalPublishingStopped ? 'bg-red-600' : 'bg-slate-600'}`}>
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${settings?.globalPublishingStopped ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
