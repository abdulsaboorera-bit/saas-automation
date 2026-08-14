'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Post {
  _id: string;
  content: string;
  status: string;
  scheduledAt?: string;
  createdAt: string;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduledAt || post.createdAt);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  const selectedPosts = selectedDate ? getPostsForDate(selectedDate) : [];
  const days = getDaysInMonth(currentDate);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'published': return { variant: 'success' as const, icon: CheckCircle2 };
      case 'scheduled': return { variant: 'warning' as const, icon: Clock };
      case 'draft': return { variant: 'default' as const, icon: FileText };
      default: return { variant: 'default' as const, icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-500 mt-1">View and manage your scheduled posts</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="w-4 h-4 mr-1" />
            New Post
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-24 bg-gray-50/50 rounded-xl" />;
                  }

                  const dayPosts = getPostsForDate(date);
                  const isSelected = selectedDate?.getTime() === date.getTime();
                  const today = isToday(date);

                  return (
                    <button
                      key={date.getTime()}
                      onClick={() => setSelectedDate(date)}
                      className={`h-24 p-2 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50'
                          : today
                          ? 'border-indigo-200 bg-indigo-50/30'
                          : 'border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            today
                              ? 'w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center'
                              : 'text-gray-700'
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {dayPosts.length > 0 && (
                          <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                            {dayPosts.length}
                          </span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 2).map((post) => {
                          const config = getStatusConfig(post.status);
                          return (
                            <div
                              key={post._id}
                              className={`text-[10px] px-1.5 py-0.5 rounded truncate ${
                                post.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : post.status === 'scheduled'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {post.content.slice(0, 20)}...
                            </div>
                          );
                        })}
                        {dayPosts.length > 2 && (
                          <span className="text-[10px] text-gray-400">+{dayPosts.length - 2} more</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select a date'}
              </h3>
            </div>
            <CardContent className="p-4">
              {selectedDate ? (
                selectedPosts.length > 0 ? (
                  <div className="space-y-3">
                    {selectedPosts.map((post) => {
                      const config = getStatusConfig(post.status);
                      return (
                        <div
                          key={post._id}
                          className="p-3 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge variant={config.variant} size="sm" dot>
                              {post.status}
                            </Badge>
                            {post.scheduledAt && (
                              <span className="text-xs text-gray-400">
                                {new Date(post.scheduledAt).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">{post.content}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No posts for this date</p>
                    <Button asChild variant="outline" size="sm" className="mt-3">
                      <Link href="/dashboard/create">Create Post</Link>
                    </Button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Click a date to see posts</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Upcoming</h3>
            </div>
            <CardContent className="p-4">
              {posts
                .filter((p) => p.status === 'scheduled')
                .slice(0, 5)
                .map((post) => (
                  <div key={post._id} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.content}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {post.scheduledAt
                          ? new Date(post.scheduledAt).toLocaleString()
                          : 'No date set'}
                      </p>
                    </div>
                  </div>
                ))}
              {posts.filter((p) => p.status === 'scheduled').length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No upcoming posts</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
