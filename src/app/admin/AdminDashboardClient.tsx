'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Building2, Link2, FileText, AlertTriangle, Bot,
  Image, CreditCard, Zap, TrendingUp, TrendingDown,
  ArrowUpRight, Activity, Clock, CheckCircle, XCircle,
} from 'lucide-react';
import { AdminDashboardStats } from '@/types';

function StatCard({ label, value, icon: Icon, color, trend, href }: {
  label: string; value: number | string; icon: React.ElementType; color: string; trend?: string; href?: string;
}) {
  const Wrapper = href ? Link : 'div';
  return (
    <Wrapper href={href || '#'} className={`block bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all ${href ? 'hover:shadow-lg hover:shadow-slate-900/50' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.startsWith('+') ? (
                <TrendingUp className="w-3 h-3 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Wrapper>
  );
}

export default function AdminDashboardClient({ stats }: { stats: AdminDashboardStats }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="from-blue-500 to-indigo-500" href="/admin/users" />
        <StatCard label="Active Users" value={stats.activeUsers} icon={CheckCircle} color="from-emerald-500 to-teal-500" />
        <StatCard label="Suspended" value={stats.suspendedUsers} icon={AlertTriangle} color="from-amber-500 to-yellow-500" />
        <StatCard label="Blocked" value={stats.blockedUsers} icon={XCircle} color="from-red-500 to-rose-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Organizations" value={stats.totalOrganizations} icon={Building2} color="from-purple-500 to-pink-500" href="/admin/organizations" />
        <StatCard label="Active Orgs" value={stats.activeOrganizations} icon={Building2} color="from-violet-500 to-purple-500" />
        <StatCard label="Social Accounts" value={stats.connectedSocialAccounts} icon={Link2} color="from-cyan-500 to-blue-500" href="/admin/social-accounts" />
        <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} icon={CreditCard} color="from-green-500 to-emerald-500" href="/admin/subscriptions" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Posts Published" value={stats.postsPublished} icon={FileText} color="from-emerald-500 to-green-500" href="/admin/posts" />
        <StatCard label="Posts Failed" value={stats.postsFailed} icon={AlertTriangle} color="from-red-500 to-orange-500" href="/admin/posts" />
        <StatCard label="Topics Remaining" value={stats.topicsRemaining} icon={Clock} color="from-amber-500 to-yellow-500" href="/admin/topics" />
        <StatCard label="Failed Jobs" value={stats.failedJobs} icon={XCircle} color="from-rose-500 to-red-500" href="/admin/jobs" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="AI Generations" value={stats.aiGenerations} icon={Bot} color="from-pink-500 to-rose-500" href="/admin/ai-usage" />
        <StatCard label="Image Generations" value={stats.imageGenerations} icon={Image} color="from-indigo-500 to-blue-500" href="/admin/ai-usage" />
        <StatCard label="Monthly Revenue" value={`$${stats.monthlyRevenue.toLocaleString()}`} icon={TrendingUp} color="from-emerald-500 to-teal-500" href="/admin/subscriptions" />
      </div>

      {/* Quick Actions */}
      <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">Manage Users</span>
          </Link>
          <Link href="/admin/automation" className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <Bot className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-300">Automation Control</span>
          </Link>
          <Link href="/admin/jobs" className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">View Jobs</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-slate-300">Platform Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
