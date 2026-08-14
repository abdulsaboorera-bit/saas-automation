'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/ui/social-icons';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isToday } from 'date-fns';

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
  created_at: string;
  post_platforms: PostPlatform[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [currentDate]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?limit=100');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduled_at || post.created_at);
      return isSameDay(postDate, date);
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedPosts(getPostsForDate(date));
    if (getPostsForDate(date).length > 0) setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-yellow-500';
      default: return 'bg-gray-400';
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600 mt-1">View your scheduled and published posts</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button variant="ghost" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft className="w-5 h-5" /></Button>
          <CardTitle>{format(currentDate, 'MMMM yyyy')}</CardTitle>
          <Button variant="ghost" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight className="w-5 h-5" /></Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="bg-gray-50 py-2 text-center text-xs font-medium text-gray-500">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {calendarDays.map((day, idx) => {
              const dayPosts = getPostsForDate(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div key={idx} onClick={() => handleDayClick(day)} className={`bg-white p-2 min-h-[100px] cursor-pointer transition-colors hover:bg-gray-50 ${!isCurrentMonth ? 'bg-gray-50 opacity-50' : ''} ${isSelected ? 'ring-2 ring-indigo-500' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday(day) ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-gray-900'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex items-center gap-1 text-xs" onClick={(e) => { e.stopPropagation(); setSelectedPost(post); }}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(post.status)}`} />
                        <span className="truncate text-gray-700">{post.caption.slice(0, 20)}</span>
                      </div>
                    ))}
                    {dayPosts.length > 3 && (<span className="text-xs text-gray-500">+{dayPosts.length - 3} more</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showDetailModal} onClose={() => { setShowDetailModal(false); setSelectedPost(null); }} title={selectedPost ? 'Post Details' : `${selectedPosts.length} posts on ${selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}`}>
        {selectedPost ? (
          <div className="space-y-4">
            {selectedPost.media_url && (<img src={selectedPost.media_url} alt="" className="w-full h-48 object-cover rounded-lg" />)}
            <p className="text-gray-900">{selectedPost.caption}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant={selectedPost.status === 'published' ? 'success' : selectedPost.status === 'scheduled' ? 'info' : 'default'}>{selectedPost.status}</Badge>
              {selectedPost.scheduled_at && (<span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4" />{format(new Date(selectedPost.scheduled_at), 'MMM d, yyyy h:mm a')}</span>)}
            </div>
            {selectedPost.post_platforms && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Platforms:</p>
                {selectedPost.post_platforms.map((pp) => {
                  const Icon = getPlatformIcon(pp.platform);
                  return (
                    <div key={pp.id} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{pp.platform}</span>
                      <Badge variant={pp.status === 'published' ? 'success' : pp.status === 'failed' ? 'danger' : 'default'}>{pp.status}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {selectedPosts.map((post) => (
              <div key={post.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPost(post)}>
                {post.media_url && (<img src={post.media_url} alt="" className="w-12 h-12 rounded object-cover" />)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{post.caption}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getStatusColor(post.status) as 'success' | 'info' | 'danger' | 'default'}>{post.status}</Badge>
                    {post.scheduled_at && (<span className="text-xs text-gray-500">{format(new Date(post.scheduled_at), 'h:mm a')}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
