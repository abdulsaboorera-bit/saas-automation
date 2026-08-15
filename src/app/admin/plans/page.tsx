'use client';

import { useState, useEffect } from 'react';
import { Flag, Plus, Edit, Check, X } from 'lucide-react';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', price: 0, postsPerMonth: 0, aiGenerations: 0, imageGenerations: 0, connectedAccounts: 0, topics: 0, storage: 0, users: 1 });

  const fetchPlans = async () => {
    const res = await fetch('/api/admin/plans');
    const data = await res.json();
    setPlans(data.plans || []);
    setLoading(false);
  };

  useEffect(() => { fetchPlans(); }, []);

  const handleSave = async () => {
    const body = editingPlan ? { planId: editingPlan.id, ...formData } : formData;
    await fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setEditingPlan(null);
    setFormData({ name: '', price: 0, postsPerMonth: 0, aiGenerations: 0, imageGenerations: 0, connectedAccounts: 0, topics: 0, storage: 0, users: 1 });
    fetchPlans();
  };

  const startEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({ name: plan.name, price: plan.price, postsPerMonth: plan.postsPerMonth, aiGenerations: plan.aiGenerations, imageGenerations: plan.imageGenerations, connectedAccounts: plan.connectedAccounts, topics: plan.topics, storage: plan.storage, users: plan.users });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Plans</h1>
          <p className="text-slate-400 mt-1">Configure subscription plans</p>
        </div>
        <button onClick={() => { setEditingPlan(null); setFormData({ name: '', price: 0, postsPerMonth: 0, aiGenerations: 0, imageGenerations: 0, connectedAccounts: 0, topics: 0, storage: 0, users: 1 }); }}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium">
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <button onClick={() => startEdit(plan)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-3xl font-bold text-white mb-4">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Posts/Month</span><span className="text-white">{plan.postsPerMonth}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">AI Generations</span><span className="text-white">{plan.aiGenerations}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Image Generations</span><span className="text-white">{plan.imageGenerations}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Connected Accounts</span><span className="text-white">{plan.connectedAccounts}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Topics</span><span className="text-white">{plan.topics}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Storage (GB)</span><span className="text-white">{plan.storage}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Users</span><span className="text-white">{plan.users}</span></div>
            </div>
          </div>
        ))}
      </div>

      {editingPlan !== null || plans.length === 0 ? (
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['name', 'price', 'postsPerMonth', 'aiGenerations', 'imageGenerations', 'connectedAccounts', 'topics', 'storage', 'users'].map((field) => (
              <div key={field}>
                <label className="block text-sm text-slate-400 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input type={field === 'name' ? 'text' : 'number'} value={(formData as any)[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: field === 'name' ? e.target.value : Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white" />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm"><Check className="w-4 h-4" /> Save</button>
            <button onClick={() => setEditingPlan(null)} className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm"><X className="w-4 h-4" /> Cancel</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
