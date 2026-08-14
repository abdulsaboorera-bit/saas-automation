'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { Upload, X, Send, Clock } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface Account {
  id: string;
  platform: string;
  account_name: string;
  username: string | null;
}

export default function CreatePostPage() {
  const [caption, setCaption] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('/api/social/accounts');
        const data = await response.json();
        setAccounts(data.accounts || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('File too large. Maximum size: 10MB'); return; }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = async (): Promise<string | null> => {
    if (!imageFile) return null;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setUploadedUrl(data.url);
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handlePublishNow = async () => {
    if (!caption.trim() || selectedAccounts.length === 0) { alert('Please enter a caption and select at least one platform'); return; }
    setIsPublishing(true);
    try {
      let mediaUrl = uploadedUrl;
      if (imageFile && !uploadedUrl) mediaUrl = await handleUpload();

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, media_url: mediaUrl, platform_account_ids: selectedAccounts }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      const publishResponse = await fetch(`/api/posts/${data.post.id || data.post._id}/publish`, { method: 'POST' });
      if (!publishResponse.ok) {
        const publishData = await publishResponse.json();
        throw new Error(publishData.error);
      }
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Publish error:', error);
      alert(error instanceof Error ? error.message : 'Failed to publish post');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSchedule = async () => {
    if (!caption.trim() || selectedAccounts.length === 0) { alert('Please enter a caption and select at least one platform'); return; }
    if (!scheduleDate || !scheduleTime) { alert('Please select a date and time'); return; }

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`);
    if (scheduledAt <= new Date()) { alert('Schedule time must be in the future'); return; }

    setIsPublishing(true);
    try {
      let mediaUrl = uploadedUrl;
      if (imageFile && !uploadedUrl) mediaUrl = await handleUpload();

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caption, media_url: mediaUrl, platform_account_ids: selectedAccounts, scheduled_at: scheduledAt.toISOString() }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Schedule error:', error);
      alert(error instanceof Error ? error.message : 'Failed to schedule post');
    } finally {
      setIsPublishing(false);
      setShowScheduleModal(false);
    }
  };

  const toggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) => prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return InstagramIcon;
      case 'facebook': return FacebookIcon;
      case 'linkedin': return LinkedinIcon;
      default: return Send;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'border-pink-300 bg-pink-50';
      case 'facebook': return 'border-blue-300 bg-blue-50';
      case 'linkedin': return 'border-blue-400 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Post</h1>
        <p className="text-gray-600 mt-1">Create and publish content to your social accounts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Caption</CardTitle></CardHeader>
            <CardContent>
              <Textarea placeholder="What's on your mind?" value={caption} onChange={(e) => setCaption(e.target.value)} rows={6} maxLength={2200} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Media</CardTitle></CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); setUploadedUrl(null); }} className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG, GIF, WebP up to 10MB</p>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Publish to</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => (<div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />))}</div>
              ) : accounts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500 mb-3">No accounts connected</p>
                  <Button asChild variant="outline" size="sm"><a href="/dashboard/accounts">Connect accounts</a></Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {accounts.map((account) => {
                    const Icon = getPlatformIcon(account.platform);
                    const isSelected = selectedAccounts.includes(account.id);
                    return (
                      <button key={account.id} onClick={() => toggleAccount(account.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${isSelected ? getPlatformColor(account.platform) : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-gray-900">{account.account_name}</p>
                          <p className="text-xs text-gray-500 capitalize">{account.platform}{account.username && ` · @${account.username}`}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                          {isSelected && (<svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                <Button onClick={handlePublishNow} isLoading={isPublishing || isUploading} disabled={!caption.trim() || selectedAccounts.length === 0} className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" /> Publish Now
                </Button>
                <Button onClick={() => setShowScheduleModal(true)} variant="outline" disabled={!caption.trim() || selectedAccounts.length === 0} className="w-full" size="lg">
                  <Clock className="w-4 h-4 mr-2" /> Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Schedule Post">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
            <Button onClick={handleSchedule} isLoading={isPublishing} disabled={!scheduleDate || !scheduleTime}>Schedule Post</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
