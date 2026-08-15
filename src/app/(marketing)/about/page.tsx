import Link from 'next/link';
import { Zap, Target, Heart, Users, Globe, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us',
  description:
    'Learn about Orbitrix Solutions and our mission to democratize social media automation for creators, businesses, and teams worldwide.',
};

const values = [
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Always pushing boundaries to deliver cutting-edge social media tools.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'Bank-level protection keeps your accounts and data safe at all times.',
  },
  {
    icon: Heart,
    title: 'Simplicity',
    description: 'Easy to use on the surface, powerful underneath where it matters.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Built for creators, by creators who understand the hustle.',
  },
];

const team = [
  { name: 'Alex Chen', role: 'CEO & Co-Founder', initials: 'AC', color: 'bg-indigo-600' },
  { name: 'Sarah Kim', role: 'CTO & Co-Founder', initials: 'SK', color: 'bg-purple-600' },
  { name: 'Marcus Johnson', role: 'Head of Product', initials: 'MJ', color: 'bg-indigo-500' },
  { name: 'Emily Park', role: 'Head of Design', initials: 'EP', color: 'bg-purple-500' },
];

const stats = [
  { label: 'Founded', value: '2024' },
  { label: 'Team', value: '12' },
  { label: 'Users', value: '10K+' },
  { label: 'Posts Published', value: '500K+' },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-20 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Building the Future
            </span>{' '}
            of Social Media
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Orbitrix Solutions is on a mission to empower creators and businesses with
            intelligent social media automation that saves time and amplifies reach.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="max-w-3xl text-lg leading-relaxed text-gray-600">
            We believe every creator, entrepreneur, and business deserves access to
            powerful social media tools without the complexity or hefty price tag. Our
            mission is to democratize social media automation — making it effortless to
            plan, publish, and grow across every major platform from a single dashboard.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4 text-lg leading-relaxed text-gray-600">
              <p>
                SocialPilot was born out of frustration. Our founding team spent countless
                hours juggling multiple social media accounts — logging in and out of
                platforms, manually scheduling posts, and trying to keep content
                calendars straight across Instagram, TikTok, LinkedIn, and X.
              </p>
              <p>
                We knew there had to be a better way. So we built one. SocialPilot
                combines AI-driven content suggestions, unified scheduling, and deep
                analytics into a single, intuitive platform designed for people who
                would rather create than manage.
              </p>
              <p>
                Today, SocialPilot helps thousands of creators and businesses reclaim
                their time and grow their audiences — and we&apos;re just getting started.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative h-72 w-72 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-1 shadow-2xl">
                <div className="flex h-full w-full items-center justify-center rounded-3xl bg-white">
                  <div className="text-center">
                    <Globe className="mx-auto h-16 w-16 text-indigo-600" />
                    <p className="mt-3 text-sm font-semibold text-gray-500">
                      Connecting Creators<br />Worldwide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${member.color} text-2xl font-bold text-white shadow-lg`}
                >
                  {member.initials}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-indigo-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 px-8 py-16 shadow-xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl font-extrabold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium text-indigo-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900">Join Our Journey</h2>
          <p className="mt-4 text-lg text-gray-600">
            Be part of a growing community of creators and businesses transforming their
            social media presence with SocialPilot.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
