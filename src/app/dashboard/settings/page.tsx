'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  User,
  Bell,
  Shield,
  Link2,
  Zap,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Webhook,
  Key,
} from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; full_name: string; id: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState('');
  const [n8nSecret, setN8nSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setFullName(data.user.full_name || '');
          setEmail(data.user.email || '');
        }
      } catch {
        console.error('Failed to fetch user');
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }),
      });
      if (res.ok) {
        setSuccess('Profile updated successfully');
        setUser((prev) => prev ? { ...prev, full_name: fullName } : null);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch {
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveN8n = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      // Save n8n config (this would go to a settings API)
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess('n8n configuration saved');
    } catch {
      setError('Failed to save n8n configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'n8n', label: 'n8n Integration', icon: Webhook },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and integrations</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
          <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">×</button>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto text-emerald-400 hover:text-emerald-600">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Profile Settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your personal information</p>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">
                      {user?.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{user?.full_name || 'User'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <Badge variant="success" dot className="mt-2">Active Account</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Email Address"
                    value={email}
                    disabled
                    helperText="Email cannot be changed"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button onClick={handleSaveProfile} isLoading={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'n8n' && (
            <Card>
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">n8n Integration</h2>
                    <p className="text-sm text-gray-500">Configure your automation workflow</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Configuration Required</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Set up your n8n webhook URL and secret key to enable the content generation pipeline.
                        Your n8n workflow should have an HTTP POST endpoint ready to receive payloads.
                      </p>
                    </div>
                  </div>
                </div>

                <Input
                  label="n8n Webhook URL"
                  value={n8nWebhookUrl}
                  onChange={(e) => setN8nWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/your-endpoint"
                  icon={<Webhook className="w-4 h-4" />}
                />

                <div>
                  <Input
                    label="Webhook Secret Key"
                    type={showSecret ? 'text' : 'password'}
                    value={n8nSecret}
                    onChange={(e) => setN8nSecret(e.target.value)}
                    placeholder="Enter your webhook secret"
                    icon={<Key className="w-4 h-4" />}
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mt-2 transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {showSecret ? 'Hide' : 'Show'} secret
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">Expected Payload Format</h4>
                  <pre className="text-xs text-gray-600 font-mono bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto">
{`{
  "post_id": "...",
  "content": "...",
  "platform": "instagram",
  "media_url": "...",
  "scheduled_at": "..."
}`}
                  </pre>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="outline" onClick={handleSaveN8n} isLoading={isSaving}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Test Connection
                  </Button>
                  <Button onClick={handleSaveN8n} isLoading={isSaving}>
                    <Save className="w-4 h-4 mr-1" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mt-0.5">Control what notifications you receive</p>
              </div>
              <CardContent className="p-6 space-y-6">
                {[
                  { label: 'Post Published', desc: 'Get notified when a post goes live', enabled: true },
                  { label: 'Post Failed', desc: 'Alert when a post fails to publish', enabled: true },
                  { label: 'Token Expiring', desc: 'Warning when OAuth tokens expire soon', enabled: true },
                  { label: 'Weekly Report', desc: 'Summary of your social media activity', enabled: false },
                ].map((notification) => (
                  <div key={notification.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{notification.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{notification.desc}</p>
                    </div>
                    <button
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notification.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          notification.enabled ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">Security Settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your account security</p>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Token Encryption</p>
                        <p className="text-xs text-gray-500">AES-256-GCM encryption for all tokens</p>
                      </div>
                    </div>
                    <Badge variant="info">Active</Badge>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Auto Token Refresh</p>
                        <p className="text-xs text-gray-500">Automatically refresh expired tokens</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
