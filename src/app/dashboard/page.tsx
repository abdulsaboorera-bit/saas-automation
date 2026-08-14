'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatCardSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import {
  Link2,
  Calendar,
  FileText,
  AlertCircle,
  PenSquare,
  ArrowRight,
} from 'lucide-react';

interface Post {
  id: string;
  caption: string;
  status: string;
  media_url: string | null;
  created_at: string;
  post_platforms: { id: string; platform: string; status: string }[];
}

interface Account {
  id: string;
  platform: string;
  account_name: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    connectedAccounts: 0,
    scheduledPosts: 0,
    publishedPosts: 0,
    failedPosts: 0,
  });
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, postsRes] = await Promise.all([
          fetch('/api/social/accounts'),
          fetch('/api/posts?limit=10'),
        ]);

        const accountsData = await accountsRes.json();
        const postsData = await postsRes.json();

        if (accountsData.accounts) {
          setRecentAccounts(accountsData.accounts.slice(0, 3));
          setStats((prev) => ({ ...prev, connectedAccounts: accountsData.accounts.length }));
        }

        if (postsData.posts) {
          setRecentPosts(postsData.posts);
          setStats((prev) => ({
            ...prev,
            scheduledPosts: postsData.posts.filter((p: Post) => p.status === 'scheduled').length,
            publishedPosts: postsData.posts.filter((p: Post) => p.status === 'published').length,
            failedPosts: postsData.posts.filter((p: Post) => p.status === 'failed').length,
          }));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'info';
      case 'failed': return 'danger';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-gradient-to-r from-pink-500 to-purple-500';
      case 'facebook': return 'bg-blue-600';
      case 'linkedin': return 'bg-blue-700';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s an overview of your social media.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.connectedAccounts}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Scheduled Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.scheduledPosts}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.publishedPosts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed Posts</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.failedPosts}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Posts</CardTitle>
              <Link href="/dashboard/posts" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <TableSkeleton rows={5} />
              ) : recentPosts.length === 0 ? (
                <div className="text-center py-12">
                  <PenSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No posts yet</p>
                  <Link href="/dashboard/create" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                    Create your first post
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPosts.slice(0, 5).map((post) => (
                    <div key={post.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      {post.media_url && (
                        <img src={post.media_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{post.caption}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {post.post_platforms && (
                        <div className="flex items-center gap-1">
                          {post.post_platforms.map((pp) => (
                            <div key={pp.id} className={`w-6 h-6 rounded-full ${getPlatformColor(pp.platform)} flex items-center justify-center`} title={`${pp.platform}: ${pp.status}`}>
                              <span className="text-[8px] text-white font-bold uppercase">{pp.platform.charAt(0)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Connected Accounts</CardTitle>
              <Link href="/dashboard/accounts" className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                Manage <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3"><StatCardSkeleton /><StatCardSkeleton /></div>
              ) : recentAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <Link2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-3">No accounts connected</p>
                  <Link href="/dashboard/accounts" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                    Connect account
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAccounts.map((account) => (
                    <div key={account.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
                      <div className={`w-10 h-10 rounded-full ${getPlatformColor(account.platform)} flex items-center justify-center`}>
                        <span className="text-sm text-white font-bold uppercase">{account.platform.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{account.account_name}</p>
                        <p className="text-xs text-gray-500 capitalize">{account.platform}</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
