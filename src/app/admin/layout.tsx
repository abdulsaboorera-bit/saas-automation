'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, Building2, Link2, FileText, PenSquare,
  Calendar, Settings, LogOut, Menu, X, Zap, Bell, Search,
  Shield, Bot, Image, CreditCard, Flag, Activity, Database,
  MessageSquare, ClipboardList, AlertTriangle, Heart,
  ChevronDown, BarChart3, Cog, BookOpen,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
  { name: 'Users', href: '/admin/users', icon: Users, color: 'from-emerald-500 to-teal-500' },
  { name: 'Organizations', href: '/admin/organizations', icon: Building2, color: 'from-purple-500 to-pink-500' },
  { name: 'Social Accounts', href: '/admin/social-accounts', icon: Link2, color: 'from-cyan-500 to-blue-500' },
  { name: 'Topics', href: '/admin/topics', icon: BookOpen, color: 'from-orange-500 to-amber-500' },
  { name: 'Posts', href: '/admin/posts', icon: FileText, color: 'from-rose-500 to-red-500' },
  { name: 'Automation', href: '/admin/automation', icon: Bot, color: 'from-violet-500 to-purple-500' },
  { name: 'Jobs', href: '/admin/jobs', icon: ClipboardList, color: 'from-indigo-500 to-blue-500' },
  { name: 'AI Usage', href: '/admin/ai-usage', icon: Activity, color: 'from-pink-500 to-rose-500' },
  { name: 'Storage', href: '/admin/storage', icon: Database, color: 'from-amber-500 to-yellow-500' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, color: 'from-teal-500 to-cyan-500' },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard, color: 'from-green-500 to-emerald-500' },
  { name: 'Plans', href: '/admin/plans', icon: Flag, color: 'from-blue-500 to-cyan-500' },
  { name: 'Credits', href: '/admin/credits', icon: CreditCard, color: 'from-yellow-500 to-orange-500' },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell, color: 'from-indigo-500 to-violet-500' },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: ClipboardList, color: 'from-gray-500 to-slate-500' },
  { name: 'System Health', href: '/admin/system-health', icon: Heart, color: 'from-red-500 to-rose-500' },
  { name: 'Settings', href: '/admin/settings', icon: Cog, color: 'from-slate-500 to-gray-500' },
  { name: 'Feature Flags', href: '/admin/features', icon: Flag, color: 'from-fuchsia-500 to-purple-500' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; full_name: string; id: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          if (!['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'].includes(data.user.role)) {
            router.push('/dashboard');
            return;
          }
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 bg-[#1e293b] border-r border-slate-700/50 transform transition-all duration-300 ease-out lg:translate-x-0 flex flex-col',
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-700/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
              <p className="text-[10px] text-slate-400">SocialPilot SaaS</p>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-700 lg:hidden">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center',
                  isActive ? 'bg-white/20' : 'bg-slate-700/50'
                )}>
                  <item.icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700 transition-all">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 bg-[#1e293b]/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl hover:bg-slate-700 lg:hidden"
            >
              <Menu className="w-5 h-5 text-slate-400" />
            </button>
            <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users, orgs, posts..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/system-health" className="p-2.5 rounded-xl hover:bg-slate-700 transition-colors relative">
                <Heart className="w-5 h-5 text-slate-400" />
              </Link>
              <Link href="/admin/notifications" className="p-2.5 rounded-xl hover:bg-slate-700 transition-colors relative">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#1e293b]" />
              </Link>
              <div className="hidden sm:block w-px h-8 bg-slate-700" />
              <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-all">
                <Zap className="w-4 h-4" />
                Customer View
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
