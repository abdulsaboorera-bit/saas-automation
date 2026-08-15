import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  title: {
    default: 'SocialPilot — AI-Powered Social Media Automation Platform',
    template: '%s | SocialPilot',
  },
  description:
    'Connect Instagram, Facebook, and LinkedIn. Create content once, publish everywhere with AI-powered automation. Schedule posts, track analytics, and grow your audience — all from one dashboard.',
  keywords: [
    'social media automation',
    'social media scheduling',
    'instagram automation',
    'facebook automation',
    'linkedin automation',
    'content scheduling',
    'social media management',
    'AI content creation',
    'multi-platform publishing',
    'social media analytics',
    'post scheduler',
    'social media dashboard',
  ],
  authors: [{ name: 'Orbitrix Solutions' }],
  creator: 'Orbitrix Solutions',
  publisher: 'Orbitrix Solutions',
  metadataBase: new URL('https://socialpilot.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'SocialPilot',
    title: 'SocialPilot — AI-Powered Social Media Automation Platform',
    description:
      'Connect Instagram, Facebook, and LinkedIn. Create content once, publish everywhere with AI-powered automation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SocialPilot - Social Media Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialPilot — AI-Powered Social Media Automation',
    description:
      'Connect Instagram, Facebook, and LinkedIn. Create content once, publish everywhere.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full bg-gray-50 font-sans antialiased">{children}</body>
    </html>
  );
}
