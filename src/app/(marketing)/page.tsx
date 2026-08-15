import type { Metadata } from 'next';
import MarketingPage from './MarketingPageClient';

export const metadata: Metadata = {
  title: 'SocialPilot — Automate Your Social Media',
  description:
    'Connect Instagram, Facebook, and LinkedIn. Create content once, publish everywhere with AI-powered automation. Schedule posts, track analytics, and grow your audience.',
  alternates: {
    canonical: '/',
  },
};

export default function MarketingPageServer() {
  return <MarketingPage />;
}
