import Link from 'next/link';
import {
  Globe,
  Calendar,
  Cpu,
  Shield,
  BarChart3,
  Layers,
  ArrowRight,
  Check,
  Zap,
  Sparkles,
  Lock,
  Clock,
  Target,
  TrendingUp,
  Hash,
  Image,
  FileText,
  Send,
} from 'lucide-react';

export const metadata = {
  title: 'Features',
  description:
    'Explore SocialPilot\'s powerful features — multi-platform publishing, smart scheduling, AI content engine, bank-level security, real-time analytics, and a visual content calendar for modern social media creators.',
};

const features = [
  {
    icon: Globe,
    title: 'Multi-Platform Publishing',
    color: 'blue',
    iconBg: 'bg-blue-500',
    iconShadow: 'shadow-blue-200',
    paragraphs: [
      'Publish to Instagram, Facebook, and LinkedIn from a single unified dashboard. No more juggling multiple tabs, logins, or scheduling tools — SocialPilot brings every platform together so you can manage your entire social presence in one place.',
      'Each platform integration is built on official APIs, ensuring reliable delivery and compliance with platform guidelines. Whether you\'re posting a carousel to Instagram, a long-form article to LinkedIn, or a community update to Facebook, the workflow is identical and seamless.',
      'Your content is automatically reformatted to meet each platform\'s requirements — image dimensions, caption length limits, hashtag rules, and character counts are handled behind the scenes so you can focus on creating.',
    ],
    bullets: [
      'Publish to IG, FB, and LI from one dashboard',
      'Automatic platform-specific formatting',
      'Bulk publish up to 50 posts at once',
      'Cross-platform content mirroring',
    ],
    preview: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-50 to-transparent rounded-xl border border-pink-100">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">IG</span>
          </div>
          <div className="flex-1">
            <div className="h-2.5 bg-gray-200 rounded-full w-3/4 mb-1.5" />
            <div className="h-2 bg-gray-100 rounded-full w-1/2" />
          </div>
          <Check className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">FB</span>
          </div>
          <div className="flex-1">
            <div className="h-2.5 bg-gray-200 rounded-full w-2/3 mb-1.5" />
            <div className="h-2 bg-gray-100 rounded-full w-2/5" />
          </div>
          <Check className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xs font-bold">LI</span>
          </div>
          <div className="flex-1">
            <div className="h-2.5 bg-gray-200 rounded-full w-2/3 mb-1.5" />
            <div className="h-2 bg-gray-100 rounded-full w-1/3" />
          </div>
          <Check className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    ),
  },
  {
    icon: Clock,
    title: 'Smart Scheduling',
    color: 'purple',
    iconBg: 'bg-purple-500',
    iconShadow: 'shadow-purple-200',
    paragraphs: [
      'SocialPilot analyzes your audience activity patterns across every connected platform and recommends the optimal times to publish. Our scheduling engine ensures your content goes live when your followers are most likely to engage, maximizing reach and interaction.',
      'The drag-and-drop calendar interface lets you rearrange your entire content queue visually. Move posts between days, batch-schedule entire weeks, or set up recurring content patterns — all with intuitive mouse gestures that feel natural.',
      'Full timezone support means you can target audiences in any region. Schedule a post for 9 AM in New York, 2 PM in London, and 7 PM in Tokyo — all from the same calendar view. Every timestamp is converted and stored accurately so your content lands at the right moment.',
    ],
    bullets: [
      'AI-recommended optimal posting times',
      'Drag-and-drop calendar interface',
      'Multi-timezone scheduling support',
      'Recurring post patterns and templates',
    ],
    preview: (
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 bg-gray-200 rounded-full w-1/3" />
          <div className="flex gap-1.5">
            <div className="w-6 h-6 bg-indigo-100 rounded-md" />
            <div className="w-6 h-6 bg-gray-100 rounded-md" />
            <div className="w-6 h-6 bg-gray-100 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="text-[9px] font-medium text-gray-400 mb-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
              </div>
              <div
                className={`h-8 rounded-md ${
                  i === 2
                    ? 'bg-indigo-500 shadow-sm'
                    : i === 4
                      ? 'bg-purple-400 shadow-sm'
                      : i === 5
                        ? 'bg-blue-400 shadow-sm'
                        : 'bg-white border border-gray-100'
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Clock className="w-3 h-3 text-purple-500" />
          <span className="text-[10px] font-medium text-gray-500">Best time: 9:00 AM EST</span>
        </div>
      </div>
    ),
  },
  {
    icon: Cpu,
    title: 'AI Content Engine',
    color: 'amber',
    iconBg: 'bg-amber-500',
    iconShadow: 'shadow-amber-200',
    paragraphs: [
      'Powered by our built-in automation engine, SocialPilot\'s AI Content Engine generates platform-optimized captions, hashtag sets, and content suggestions tailored to your brand voice. Feed it a topic or a rough idea, and receive polished, ready-to-publish content in seconds.',
      'The engine goes beyond simple text generation. It analyzes trending topics in your niche, studies your top-performing posts, and learns from engagement patterns to produce content that resonates with your specific audience. Every caption is crafted to match the tone, length, and style expected on each platform.',
      'Hashtag suggestions are powered by real-time trend analysis. SocialPilot identifies high-performing, relevant hashtags for each post and platform — mixing popular tags with niche-specific ones to maximize discoverability without getting lost in the noise.',
    ],
    bullets: [
      'AI-powered content generation',
      'Platform-specific caption optimization',
      'Real-time trending hashtag suggestions',
      'Brand voice learning and consistency',
    ],
    preview: (
      <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-amber-700">AI Generated</span>
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-2 bg-amber-200/60 rounded-full w-full" />
          <div className="h-2 bg-amber-200/40 rounded-full w-5/6" />
          <div className="h-2 bg-amber-200/30 rounded-full w-3/4" />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {['#socialmedia', '#growth', '#creator', '#marketing'].map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg">
          <div className="w-6 h-6 bg-amber-400 rounded-md flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="h-2 bg-gray-200 rounded-full flex-1" />
          <span className="text-[9px] font-medium text-amber-600">Regenerate</span>
        </div>
      </div>
    ),
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    color: 'emerald',
    iconBg: 'bg-emerald-500',
    iconShadow: 'shadow-emerald-200',
    paragraphs: [
      'Every OAuth token stored by SocialPilot is encrypted at rest using AES-256-GCM — the same standard used by major financial institutions. Your credentials are never exposed in plaintext, not in our database, not in transit, and certainly not in your browser.',
      'Authentication flows are handled through official OAuth 2.0 protocols. You never share your password with SocialPilot. Instead, you authorize a scoped access token that can be revoked at any time. We request only the minimum permissions needed to publish content on your behalf.',
      'All API communication is over TLS 1.3 encrypted connections. Our infrastructure follows security best practices with regular audits, penetration testing, and strict access controls. If you disconnect an account, all associated tokens are immediately and permanently deleted.',
    ],
    bullets: [
      'AES-256-GCM encryption at rest',
      'OAuth 2.0 — never share your password',
      'TLS 1.3 encrypted API communication',
      'Instant token revocation on disconnect',
    ],
    preview: (
      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-emerald-700">Security Status</span>
        </div>
        <div className="space-y-2">
          {[
            { label: 'AES-256-GCM Encryption', status: 'Active' },
            { label: 'OAuth 2.0 Token Flow', status: 'Verified' },
            { label: 'TLS 1.3 Transport', status: 'Secure' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-medium text-gray-600">{item.label}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    color: 'cyan',
    iconBg: 'bg-cyan-500',
    iconShadow: 'shadow-cyan-200',
    paragraphs: [
      'Track engagement metrics, follower growth, and content performance across all connected platforms from a single analytics dashboard. SocialPilot aggregates data from Instagram, Facebook, and LinkedIn into unified reports that give you a clear picture of your social media health.',
      'Platform-specific insights break down what\'s working on each network. See which Instagram Reels drive the most saves, which LinkedIn articles generate the most comments, and which Facebook posts spark the most shares — all in real time without switching between native analytics tools.',
      'Growth trends are visualized with interactive charts that make it easy to spot patterns. Compare week-over-week performance, identify your top-performing content types, and make data-driven decisions about what to post next. Your analytics update within minutes of engagement, not hours.',
    ],
    bullets: [
      'Unified cross-platform dashboard',
      'Platform-specific engagement breakdowns',
      'Interactive growth trend charts',
      'Real-time data — updated within minutes',
    ],
    preview: (
      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { label: 'Engagement', value: '+24%', color: 'text-cyan-600' },
            { label: 'Reach', value: '12.4K', color: 'text-blue-600' },
            { label: 'Followers', value: '+186', color: 'text-emerald-600' },
            { label: 'Clicks', value: '892', color: 'text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="p-2 bg-white rounded-lg border border-gray-100">
              <div className="text-[9px] text-gray-400 font-medium mb-1">{stat.label}</div>
              <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-1 h-10">
          {[40, 55, 35, 70, 60, 80, 65, 90, 75, 85, 95, 88].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-cyan-400 to-cyan-300"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Layers,
    title: 'Content Calendar',
    color: 'rose',
    iconBg: 'bg-rose-500',
    iconShadow: 'shadow-rose-200',
    paragraphs: [
      'The visual content calendar gives you a bird\'s-eye view of your entire publishing schedule. See every planned post across all platforms at a glance, identify gaps in your content pipeline, and maintain a consistent publishing cadence without the stress.',
      'Drag-and-drop functionality lets you rearrange your schedule in seconds. Move posts between dates, duplicate successful content patterns, and batch-organize entire campaigns. The calendar adapts to your workflow, not the other way around.',
      'Content buckets help you categorize and balance your content strategy. Tag posts by type — educational, promotional, behind-the-scenes, user-generated — and visualize the mix across your calendar. Ensure you\'re hitting the right content ratios for maximum audience engagement.',
    ],
    bullets: [
      'Bird\'s-eye view of all scheduled content',
      'Drag-and-drop post rearrangement',
      'Content buckets for strategy balancing',
      'Campaign-level content grouping',
    ],
    preview: (
      <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {[
            { bg: 'bg-rose-400', col: 'col-span-2' },
            { bg: 'bg-indigo-400', col: '' },
            { bg: 'bg-amber-400', col: '' },
            { bg: 'bg-blue-400', col: 'col-span-1' },
            { bg: 'bg-emerald-400', col: 'col-span-2' },
            { bg: 'bg-purple-400', col: '' },
          ].map((block, i) => (
            <div
              key={i}
              className={`${block.bg} ${block.col} h-6 rounded-md opacity-80`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {[
            { label: 'Educational', color: 'bg-indigo-400' },
            { label: 'Promo', color: 'bg-rose-400' },
            { label: 'UGC', color: 'bg-amber-400' },
          ].map((bucket) => (
            <div key={bucket.label} className="flex items-center gap-1">
              <div className={`w-2 h-2 ${bucket.color} rounded-sm`} />
              <span className="text-[9px] font-medium text-gray-500">{bucket.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const integrations = [
  {
    name: 'Instagram',
    short: 'IG',
    color: 'from-pink-500 to-rose-500',
    border: 'border-pink-200',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    features: [
      'Feed posts, carousels, and Reels',
      'Stories scheduling and auto-publish',
      'Hashtag research and suggestions',
      'Engagement tracking and analytics',
      'Best time-to-post recommendations',
    ],
  },
  {
    name: 'Facebook',
    short: 'FB',
    color: 'from-blue-600 to-blue-500',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    features: [
      'Page and Group publishing',
      'Link preview customization',
      'Audience targeting options',
      'Post performance insights',
      'Cross-page content sharing',
    ],
  },
  {
    name: 'LinkedIn',
    short: 'LI',
    color: 'from-blue-500 to-blue-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    features: [
      'Personal and Company page posting',
      'Long-form article publishing',
      'Professional audience targeting',
      'Industry-specific hashtag sets',
      'Thought leadership content tools',
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/15 to-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-8">
              <Sparkles className="w-4 h-4" />
              Features
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Powerful Features for{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Modern Creators
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Everything you need to automate your social media, grow your audience, and create
              compelling content — all from a single platform built for modern creators.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:-translate-y-0.5 text-lg"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-lg"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Detail Sections */}
      {features.map((feature, index) => (
        <section
          key={feature.title}
          className={`py-20 ${index % 2 === 1 ? 'bg-gray-50/50' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:[direction:rtl]' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg ${feature.iconShadow} mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
                  {feature.title}
                </h2>

                {feature.paragraphs.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-gray-500 leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}

                <ul className="space-y-3 mt-6">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-indigo-600" />
                      </div>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mock UI Preview */}
              <div className={index % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                <div className="relative">
                  <div className={`absolute -inset-4 bg-gradient-to-r ${
                    feature.color === 'blue'
                      ? 'from-blue-500/10 to-blue-500/5'
                      : feature.color === 'purple'
                        ? 'from-purple-500/10 to-purple-500/5'
                        : feature.color === 'amber'
                          ? 'from-amber-500/10 to-amber-500/5'
                          : feature.color === 'emerald'
                            ? 'from-emerald-500/10 to-emerald-500/5'
                            : feature.color === 'cyan'
                              ? 'from-cyan-500/10 to-cyan-500/5'
                              : 'from-rose-500/10 to-rose-500/5'
                  } rounded-3xl blur-2xl`} />
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-6">
                    {feature.preview}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Integrations Section */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4">
              <Globe className="w-4 h-4" />
              Integrations
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Native integrations with{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                every platform
              </span>
            </h2>
            <p className="text-lg text-gray-500">
              Built on official APIs with secure OAuth flows. Each integration is tailored to
              maximize what the platform offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrations.map((platform) => (
              <div
                key={platform.name}
                className={`bg-white rounded-2xl border ${platform.border} p-8 hover:shadow-xl transition-all duration-300`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${platform.color} rounded-2xl flex items-center justify-center shadow-lg mb-6`}>
                  <span className="text-white text-lg font-bold">{platform.short}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{platform.name}</h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 ${platform.bg} rounded-full mb-6`}>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className={`text-xs font-semibold ${platform.text}`}>Connected &amp; Active</span>
                </div>

                <ul className="space-y-3">
                  {platform.features.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to automate?
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of creators who are transforming their social media workflow. Start free
            today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 duration-300"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
