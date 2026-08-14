'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
  Send,
  MoreHorizontal,
  PenSquare,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface Post {
  _id: string;
  content: string;
  status: string;
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  platforms?: string[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;
    if (searchQuery) {
      result = result.filter((p) => p.content.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter((p) => p.status === statusFilter);
    }
    setFilteredPosts(result);
  }, [posts, searchQuery, statusFilter]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch {
      console.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePostId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${deletePostId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== deletePostId));
        setDeletePostId(null);
      }
    } catch {
      console.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/publish`, { method: 'POST' });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? { ...p, status: 'published', publishedAt: new Date().toISOString() } : p))
        );
      }
    } catch {
      console.error('Failed to publish post');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published': return { variant: 'success' as const, icon: CheckCircle2, label: 'Published' };
      case 'scheduled': return { variant: 'warning' as const, icon: Clock, label: 'Scheduled' };
      case 'draft': return { variant: 'default' as const, icon: FileText, label: 'Draft' };
      case 'failed': return { variant: 'danger' as const, icon: AlertCircle, label: 'Failed' };
      default: return { variant: 'default' as const, icon: FileText, label: status };
    }
  };

  const statusCounts = {
    all: posts.length,
    published: posts.filter((p) => p.status === 'published').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
    draft: posts.filter((p) => p.status === 'draft').length,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} total posts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="w-4 h-4 mr-1" />
            Create Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'scheduled', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              {searchQuery || statusFilter !== 'all' ? 'No posts match your filters' : 'No posts yet'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {searchQuery || statusFilter !== 'all' ? 'Try adjusting your search' : 'Create your first post to get started'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <Button asChild className="mt-4">
                <Link href="/dashboard/create">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Post
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post, index) => {
            const statusConfig = getStatusConfig(post.status);
            return (
              <Card key={post._id} hover>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusConfig.variant} dot>
                          <statusConfig.icon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                        {post.platforms?.map((p) => (
                          <Badge key={p} variant="info" size="sm">
                            {p === 'instagram' && <InstagramIcon className="w-3 h-3 mr-1" />}
                            {p === 'linkedin' && <LinkedinIcon className="w-3 h-3 mr-1" />}
                            {p}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2 mb-3">{post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric',
                          })}
                        </span>
                        {post.scheduledAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Scheduled: {new Date(post.scheduledAt).toLocaleString()}
                          </span>
                        )}
                        {post.publishedAt && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Published: {new Date(post.publishedAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {post.status === 'draft' && (
                        <Button variant="ghost" size="sm" onClick={() => handlePublish(post._id)} title="Publish">
                          <Send className="w-4 h-4 text-indigo-500" />
                        </Button>
                      )}
                      <Link
                        href={`/dashboard/posts/${post._id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeletePostId(post._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Modal */}
      <Modal isOpen={!!deletePostId} onClose={() => setDeletePostId(null)} title="Delete Post" size="sm">
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeletePostId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
