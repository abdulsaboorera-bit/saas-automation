'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { Unlink, CheckCircle } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/ui/social-icons';

interface Account {
  id: string;
  platform: string;
  account_name: string;
  username: string | null;
  status: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

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

  const handleConnect = async (platform: 'instagram' | 'facebook' | 'linkedin') => {
    try {
      const response = await fetch(`/api/social/${platform}/connect`);
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(`Error connecting ${platform}:`, error);
    }
  };

  const handleDisconnect = async () => {
    if (!accountToDisconnect) return;
    setDisconnectingId(accountToDisconnect.id);

    try {
      const response = await fetch('/api/social/accounts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: accountToDisconnect.id }),
      });

      if (response.ok) {
        setAccounts((prev) => prev.filter((a) => a.id !== accountToDisconnect.id));
        setShowDisconnectModal(false);
        setAccountToDisconnect(null);
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
    } finally {
      setDisconnectingId(null);
    }
  };

  const getPlatformConfig = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return { icon: InstagramIcon, name: 'Instagram', bgLight: 'bg-pink-50', text: 'text-pink-600' };
      case 'facebook':
        return { icon: FacebookIcon, name: 'Facebook', bgLight: 'bg-blue-50', text: 'text-blue-600' };
      case 'linkedin':
        return { icon: LinkedinIcon, name: 'LinkedIn', bgLight: 'bg-blue-50', text: 'text-blue-700' };
      default:
        return { icon: CheckCircle, name: platform, bgLight: 'bg-gray-50', text: 'text-gray-600' };
    }
  };

  const platforms = ['instagram', 'facebook', 'linkedin'] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Connected Accounts</h1>
        <p className="text-gray-600 mt-1">Manage your connected social media accounts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const config = getPlatformConfig(platform);
          const connectedAccount = accounts.find((a) => a.platform === platform);
          const Icon = config.icon;

          return (
            <Card key={platform} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${config.bgLight}`}>
                    <Icon className={`w-7 h-7 ${config.text}`} />
                  </div>
                  {connectedAccount && (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{config.name}</h3>
                {connectedAccount ? (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-1">{connectedAccount.account_name}</p>
                    {connectedAccount.username && (
                      <p className="text-sm text-gray-500">@{connectedAccount.username}</p>
                    )}
                    <Button variant="danger" size="sm" className="mt-4" onClick={() => { setAccountToDisconnect(connectedAccount); setShowDisconnectModal(true); }}>
                      <Unlink className="w-4 h-4 mr-2" /> Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">Connect your {config.name} account to start publishing</p>
                    <Button onClick={() => handleConnect(platform)} className="w-full">Connect {config.name}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-2">About Account Connections</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />We use official OAuth flows - your password is never shared</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />All access tokens are encrypted and stored securely</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />You can disconnect any account at any time</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />For Instagram, a Business or Creator account connected to a Facebook Page is required</li>
          </ul>
        </CardContent>
      </Card>

      <Modal isOpen={showDisconnectModal} onClose={() => { setShowDisconnectModal(false); setAccountToDisconnect(null); }} title="Disconnect Account">
        <p className="text-gray-600 mb-6">
          Are you sure you want to disconnect your <strong>{accountToDisconnect?.platform}</strong> account <strong>{accountToDisconnect?.account_name}</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { setShowDisconnectModal(false); setAccountToDisconnect(null); }}>Cancel</Button>
          <Button variant="danger" isLoading={disconnectingId === accountToDisconnect?.id} onClick={handleDisconnect}>Disconnect</Button>
        </div>
      </Modal>
    </div>
  );
}
