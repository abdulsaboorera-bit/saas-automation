'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, Globe, Building2, User } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [formData, setFormData] = useState({ type: 'GLOBAL_ANNOUNCEMENT', channel: 'IN_APP', title: '', message: '', userId: '', orgId: '' });

  const fetchNotifications = async () => {
    const res = await fetch('/api/admin/notifications');
    const data = await res.json();
    setNotifications(data.notifications || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async () => {
    await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    setShowSend(false);
    setFormData({ type: 'GLOBAL_ANNOUNCEMENT', channel: 'IN_APP', title: '', message: '', userId: '', orgId: '' });
    fetchNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-slate-400 mt-1">Send notifications to customers</p>
        </div>
        <button onClick={() => setShowSend(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">
          <Send className="w-4 h-4" /> Send Notification
        </button>
      </div>

      {showSend && (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Send Notification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white">
                <option value="GLOBAL_ANNOUNCEMENT">Global Announcement</option>
                <option value="ORG_ANNOUNCEMENT">Organization Announcement</option>
                <option value="INDIVIDUAL_MESSAGE">Individual Message</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Channel</label>
              <select value={formData.channel} onChange={(e) => setFormData({ ...formData, channel: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white">
                <option value="IN_APP">In-App</option>
                <option value="EMAIL">Email</option>
                <option value="BOTH">Both</option>
              </select>
            </div>
            {formData.type === 'ORG_ANNOUNCEMENT' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Organization ID</label>
                <input value={formData.orgId} onChange={(e) => setFormData({ ...formData, orgId: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
              </div>
            )}
            {formData.type === 'INDIVIDUAL_MESSAGE' && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">User ID</label>
                <input value={formData.userId} onChange={(e) => setFormData({ ...formData, userId: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
              </div>
            )}
          </div>
          <div className="mt-3">
            <label className="block text-sm text-slate-400 mb-1">Title</label>
            <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
          </div>
          <div className="mt-3">
            <label className="block text-sm text-slate-400 mb-1">Message</label>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" rows={3} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSend} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm">Send</button>
            <button onClick={() => setShowSend(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Type</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Title</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Channel</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading...</td></tr>
            ) : notifications.map((n) => (
              <tr key={n.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <span className="text-xs font-medium bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md">{n.type}</span>
                </td>
                <td className="px-6 py-4 text-sm text-white">{n.title}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{n.channel}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{new Date(n.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
