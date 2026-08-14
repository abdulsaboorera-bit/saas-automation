'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { TableSkeleton } from '@/components/ui/skeleton';
import { PenSquare, Plus, Trash2, Send, Clock } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface PostPlatform {
  id: string;
  platform: string;
  status: string;
}

interface Post {
  id: string;
  caption: string;
  status: string;
  media_url: string | null;
  scheduled_at: string | null;
  published_at: string | null;
  created_at: string;
  post_platforms: PostPlatform[];
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      const url = filter === 'all' ? '/api/posts' : `/api/posts?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, { method: 'DELETE' });
      if (response.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
        setShowDeleteModal(false);
        setPostToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handlePublish = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/publish`, { method: 'POST' });
      if (response.ok) fetchPosts();
    } catch (error) {
      console.error('Error publishing post:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'scheduled': return 'info';
      case 'failed': return 'danger';
      case 'processing': return 'warning';
      case 'partial': return 'warning';
      default: return 'default';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return InstagramIcon;
      case 'facebook': return FacebookIcon;
      case 'linkedin': return LinkedinIcon;
      default: return Send;
    }
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-yellow-600';
      default: return 'text-gray-400';
    }
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'draft', label: 'Drafts' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'published', label: 'Published' },
    { value: 'processing', label: 'Processing' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-1">Manage your social media posts</p>
        </div>
        <Button asChild><Link href="/dashboard/create"><Plus className="w-4 h-4 mr-2" />New Post</Link></Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <PenSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500 mb-4">Create your first post to get started</p>
              <Button asChild><Link href="/dashboard/create"><Plus className="w-4 h-4 mr-2" />Create Post</Link></Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {post.media_url && (<img src={post.media_url} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2 mb-2">{post.caption}</p>
                    <div className="flex items-center flex-wrap gap-2">
                      <Badge variant={getStatusColor(post.status)}>{post.status}</Badge>
                      {post.scheduled_at && (<span className="text-xs text-gray-500"><Clock className="w-3 h-3 inline mr-1" />{new Date(post.scheduled_at).toLocaleString()}</span>)}
                      {post.published_at && (<span className="text-xs text-gray-500">Published {new Date(post.published_at).toLocaleDateString()}</span>)}
                    </div>
                    {post.post_platforms && post.post_platforms.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.post_platforms.map((pp) => {
                          const Icon = getPlatformIcon(pp.platform);
                          return (
                            <div key={pp.id} className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md text-xs">
                              <Icon className="w-3.5 h-3.5" />
                              <span className="capitalize">{pp.platform}</span>
                              <span className={getPlatformStatusColor(pp.status)}>
                                {pp.status === 'published' ? '✓' : pp.status === 'failed' ? '✗' : '○'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {(post.status === 'draft' || post.status === 'failed') && (
                      <Button size="sm" onClick={() => handlePublish(post.id)}><Send className="w-4 h-4 mr-1" />Publish</Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => { setPostToDelete(post); setShowDeleteModal(true); }}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setPostToDelete(null); }} title="Delete Post">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setShowDeleteModal(false); setPostToDelete(null); }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
