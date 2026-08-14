'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  PenSquare,
  Image as ImageIcon,
  Clock,
  Send,
  Sparkles,
  Calendar,
  Globe,
  Smile,
  Hash,
  AtSign,
  Bold,
  Italic,
  List,
  Link2,
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface SocialAccount {
  _id: string;
  platform: string;
  platformUsername: string;
  isActive: boolean;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts');
        const data = await res.json();
        if (res.ok) {
          setAccounts((data.accounts || []).filter((a: SocialAccount) => a.isActive));
        }
      } catch {
        console.error('Failed to fetch accounts');
      }
    };
    fetchAccounts();
  }, []);

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]
    );
  };

  const handleSubmit = async (publish: boolean) => {
    if (!content.trim()) { setError('Please write some content'); return; }
    if (selectedAccounts.length === 0) { setError('Please select at least one account'); return; }
    if (mode === 'schedule' && (!scheduleDate || !scheduleTime)) { setError('Please select a date and time'); return; }

    setError('');
    setSuccess('');
    setIsPublishing(true);

    try {
      const payload = {
        content,
        accountIds: selectedAccounts,
        scheduledAt: mode === 'schedule' ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString() : undefined,
        status: publish ? 'published' : 'draft',
      };

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }

      setSuccess(publish ? 'Post published successfully!' : 'Post saved as draft!');
      setContent('');
      setSelectedAccounts([]);
      setImagePreview(null);

      if (publish) {
        setTimeout(() => router.push('/dashboard/posts'), 1500);
      }
    } catch {
      setError('Failed to create post');
    } finally {
      setIsPublishing(false);
    }
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
          <p className="text-gray-500 mt-1">Write and schedule your content</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => handleSubmit(false)} isLoading={isPublishing}>
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(true)} isLoading={isPublishing}>
            <Send className="w-4 h-4 mr-1" />
            Publish Now
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0">
              {/* Toolbar */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-1 flex-wrap">
                {[
                  { icon: Bold, label: 'Bold' },
                  { icon: Italic, label: 'Italic' },
                  { icon: List, label: 'List' },
                  { icon: Link2, label: 'Link' },
                  { icon: Hash, label: 'Hashtag' },
                  { icon: AtSign, label: 'Mention' },
                  { icon: Smile, label: 'Emoji' },
                ].map((tool) => (
                  <button
                    key={tool.label}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    title={tool.label}
                  >
                    <tool.icon className="w-4 h-4" />
                  </button>
                ))}
                <div className="flex-1" />
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{charCount} chars</span>
                  <span>{wordCount} words</span>
                </div>
              </div>

              {/* Textarea */}
              <div className="p-4">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind? Write your post content here..."
                  className="w-full min-h-[200px] resize-none text-gray-900 placeholder:text-gray-400 focus:outline-none text-[15px] leading-relaxed"
                  maxLength={2200}
                />
              </div>

              {/* Image Upload */}
              <div className="px-4 pb-4">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl" />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Add an image</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                )}
              </div>

              {/* Character Progress */}
              <div className="px-4 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                  <span>Character limit</span>
                  <span>{charCount}/2200</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      charCount > 2000 ? 'bg-red-500' : charCount > 1800 ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${Math.min((charCount / 2200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Card */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">When to publish</h3>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setMode('now')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    mode === 'now' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      mode === 'now' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Publish Now</p>
                      <p className="text-xs text-gray-500">Post immediately</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => setMode('schedule')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                    mode === 'schedule' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      mode === 'schedule' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">Schedule</p>
                      <p className="text-xs text-gray-500">Pick a date & time</p>
                    </div>
                  </div>
                </button>
              </div>

              {mode === 'schedule' && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100" style={{ animation: 'slide-down 0.2s ease-out' }}>
                  <Input
                    label="Date"
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    icon={<Calendar className="w-4 h-4" />}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    icon={<Clock className="w-4 h-4" />}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Selection */}
          <Card>
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Select Accounts</h3>
              <p className="text-sm text-gray-500 mt-0.5">Where to publish</p>
            </div>
            <CardContent className="p-4">
              {accounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Globe className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">No accounts connected</p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <a href="/dashboard/accounts">Connect Account</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((account) => {
                    const isSelected = selectedAccounts.includes(account._id);
                    return (
                      <button
                        key={account._id}
                        onClick={() => toggleAccount(account._id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          account.platform === 'instagram' ? 'bg-gradient-to-br from-pink-500 to-rose-500' :
                          'bg-gradient-to-br from-blue-600 to-blue-500'
                        }`}>
                          {account.platform === 'instagram' && <InstagramIcon className="w-5 h-5 text-white" />}
                          {account.platform === 'linkedin' && <LinkedinIcon className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-gray-900 capitalize">{account.platform}</p>
                          <p className="text-xs text-gray-500">@{account.platformUsername || 'Connected'}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Assistant */}
          <Card glow>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">AI Assistant</h4>
                  <p className="text-xs text-gray-500">Powered by your n8n workflow</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Generate engaging content with AI. Connect your n8n workflow in settings to enable.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="/dashboard/settings">Setup AI Content</a>
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-900 mb-3">Writing Tips</h4>
              <ul className="space-y-2.5">
                {[
                  'Keep your post concise and engaging',
                  'Use relevant hashtags for discoverability',
                  'Include a clear call-to-action',
                  'Add high-quality images for more reach',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
