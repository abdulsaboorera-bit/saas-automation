'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Link2,
  FileText,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  PenSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface DashboardStats {
  totalAccounts: number;
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAccounts: 0,
    totalPosts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Array<{
    id: string;
    content: string;
    status: string;
    platform?: string;
    createdAt: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [postsRes, accountsRes] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/accounts'),
        ]);

        const postsData = await postsRes.json();
        const accountsData = await accountsRes.json();

        if (postsRes.ok) {
          const posts = postsData.posts || [];
          setRecentPosts(posts.slice(0, 5));
          setStats((prev) => ({
            ...prev,
            totalPosts: posts.length,
            scheduledPosts: posts.filter((p: { status: string }) => p.status === 'scheduled').length,
            publishedPosts: posts.filter((p: { status: string }) => p.status === 'published').length,
          }));
        }

        if (accountsRes.ok) {
          setStats((prev) => ({
            ...prev,
            totalAccounts: (accountsData.accounts || []).length,
          }));
        }
      } catch {
        console.error('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Connected Accounts',
      value: stats.totalAccounts,
      icon: Link2,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+2 this month',
    },
    {
      label: 'Total Posts',
      value: stats.totalPosts,
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+12 this week',
    },
    {
      label: 'Scheduled',
      value: stats.scheduledPosts,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      change: 'Next: 2 hours',
    },
    {
      label: 'Published',
      value: stats.publishedPosts,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      change: '100% success',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'warning';
      case 'draft': return 'default';
      case 'failed': return 'danger';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'scheduled': return <Clock className="w-3.5 h-3.5" />;
      case 'draft': return <FileText className="w-3.5 h-3.5" />;
      case 'failed': return <AlertCircle className="w-3.5 h-3.5" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
              <div className="h-3 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-9 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '30px 30px' }} />
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back! 🎯</h1>
          <p className="text-white/80 text-lg mb-6">
            Manage your social media presence across all platforms from one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="glow" size="lg">
              <Link href="/dashboard/create">
                <PenSquare className="w-4 h-4 mr-1" />
                Create Post
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="bg-white/10 text-white hover:bg-white/20 border-white/20">
              <Link href="/dashboard/accounts">
                <Link2 className="w-4 h-4 mr-1" />
                Connect Account
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <Card key={stat.label} hover>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Posts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
                <p className="text-sm text-gray-500">Your latest content</p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/posts">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <CardContent className="p-0">
              {recentPosts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No posts yet</p>
                  <p className="text-sm text-gray-400 mt-1">Create your first post to get started</p>
                  <Button asChild variant="primary" size="sm" className="mt-4">
                    <Link href="/dashboard/create">
                      <PenSquare className="w-4 h-4 mr-1" />
                      Create Post
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant={getStatusColor(post.status)} dot size="sm">
                              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                            </Badge>
                            {post.platform && (
                              <span className="text-xs text-gray-400">{post.platform}</span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/posts/${post.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                {[
                  { label: 'Create a post', desc: 'Write and schedule content', href: '/dashboard/create', icon: PenSquare, color: 'bg-purple-50 text-purple-600' },
                  { label: 'Connect Instagram', desc: 'Link your IG account', href: '/dashboard/accounts', icon: InstagramIcon, color: 'bg-pink-50 text-pink-600' },
                  { label: 'Connect LinkedIn', desc: 'Link your LinkedIn profile', href: '/dashboard/accounts', icon: LinkedinIcon, color: 'bg-blue-50 text-blue-600' },
                  { label: 'View calendar', desc: 'See scheduled posts', href: '/dashboard/calendar', icon: Calendar, color: 'bg-cyan-50 text-cyan-600' },
                ].map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card glow>
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200/50">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">AI Content Engine</h4>
              <p className="text-sm text-gray-500 mb-4">
                Use the built-in automation engine to generate content automatically
              </p>
              <Button asChild variant="primary" size="sm" className="w-full">
                <Link href="/dashboard/settings">
                  Setup Workflow
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
