'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import {
  Link2,
  Unlink,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Plus,
  Shield,
} from 'lucide-react';
import { InstagramIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface SocialAccount {
  id: string;
  platform: string;
  account_name: string;
  username: string | null;
  profile_image_url: string | null;
  status: string;
  token_expires_at: string | null;
  created_at: string;
}

const platforms = [
  {
    name: 'Instagram',
    id: 'instagram',
    icon: InstagramIcon,
    color: 'from-pink-500 to-rose-500',
    description: 'Share photos and stories',
  },
  {
    name: 'Facebook',
    id: 'facebook',
    icon: Link2,
    color: 'from-blue-500 to-indigo-500',
    description: 'Share posts to Facebook Pages',
  },
  {
    name: 'LinkedIn',
    id: 'linkedin',
    icon: LinkedinIcon,
    color: 'from-blue-600 to-blue-500',
    description: 'Professional networking',
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    const ok = params.get('success');
    if (err) {
      setError(decodeURIComponent(err.replace(/_/g, ' ')));
      window.history.replaceState({}, '', '/dashboard/accounts');
    }
    if (ok) {
      setSuccess(`${ok} connected successfully!`);
      window.history.replaceState({}, '', '/dashboard/accounts');
    }
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/social/accounts');
      const data = await res.json();
      if (res.ok) {
        setAccounts(data.accounts || []);
      }
    } catch {
      console.error('Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (platform: string) => {
    setConnectingPlatform(platform);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/social/${platform}/connect`);
      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to initiate connection');
        setConnectingPlatform(null);
      }
    } catch {
      setError('Failed to connect to platform');
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const res = await fetch('/api/social/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId }),
      });
      if (res.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== accountId));
      }
    } catch {
      console.error('Failed to disconnect account');
    }
  };

  const getConnectedPlatform = (platformId: string) => {
    return accounts.find((a) => a.platform === platformId);
  };

  const getPlatformColor = (platform: string) => {
    if (platform === 'instagram') return 'from-pink-500 to-rose-500';
    if (platform === 'linkedin') return 'from-blue-600 to-blue-500';
    return 'from-blue-500 to-indigo-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connected Accounts</h1>
          <p className="text-gray-500 mt-1">Manage your social media connections</p>
        </div>
        <Button onClick={() => setShowConnectModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Connect Account
        </Button>
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

      {/* Connected Accounts */}
      {accounts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Active Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <Card key={account.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getPlatformColor(account.platform)} flex items-center justify-center shadow-lg`}>
                        <Link2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 capitalize">{account.platform}</h3>
                        <p className="text-sm text-gray-500">@{account.username || account.account_name}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={account.status === 'active' ? 'success' : 'danger'} dot>
                            {account.status === 'active' ? 'Active' : account.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConnect(account.platform)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(account.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>Connected {new Date(account.created_at).toLocaleDateString()}</span>
                    {account.token_expires_at && (
                      <span>Token expires {new Date(account.token_expires_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Platforms */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          {accounts.length > 0 ? 'Available Platforms' : 'Connect Your Accounts'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const connected = getConnectedPlatform(platform.id);
            return (
              <Card key={platform.id} hover glow={!!connected}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-lg`}>
                      <platform.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{platform.name}</h3>
                        {connected && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{platform.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {connected ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">@{connected.username || connected.account_name}</p>
                          <p className="text-xs text-gray-400">Connected {new Date(connected.created_at).toLocaleDateString()}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleConnect(platform.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reconnect
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform.id)}
                        isLoading={connectingPlatform === platform.id}
                        variant="primary"
                        className="w-full"
                      >
                        Connect {platform.name}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Secure Token Management</h3>
              <p className="text-sm text-gray-500">
                Your access tokens are encrypted with AES-256-GCM and stored securely.
                Tokens are automatically refreshed before expiry. We never store your passwords.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connect Modal */}
      <Modal isOpen={showConnectModal} onClose={() => setShowConnectModal(false)} title="Connect a Platform">
        <div className="space-y-3">
          {platforms.map((platform) => {
            const connected = getConnectedPlatform(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => {
                  setShowConnectModal(false);
                  handleConnect(platform.id);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center shadow-md`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{platform.name}</p>
                  <p className="text-sm text-gray-500">{platform.description}</p>
                </div>
                {connected ? (
                  <Badge variant="success" dot>Connected</Badge>
                ) : (
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                )}
              </button>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
