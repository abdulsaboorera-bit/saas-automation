import type { Metadata } from "next";
import Link from "next/link";
import {
  Link2,
  FileEdit,
  Rocket,
  Shield,
  Key,
  CheckCircle2,
  MessageSquare,
  Image as ImageIcon,
  Lightbulb,
  Globe,
  Clock,
  Workflow,
  RefreshCw,
  Calendar,
  Settings,
  ArrowRight,
  ChevronDown,
  Plug,
  PenTool,
  Send,
  BarChart3,
  Eye,
  Zap,
  Users,
  Lock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Get your social media automation running in 3 simple steps. Connect your accounts, create compelling content, and publish on autopilot — all from one powerful dashboard.",
};

const steps = [
  {
    number: "01",
    icon: Plug,
    title: "Connect Your Accounts",
    description:
      "Securely link your Instagram, Facebook, LinkedIn, and other social media accounts in under a minute. We use industry-standard OAuth 2.0 authentication so your credentials are never stored on our servers. Your tokens are encrypted at rest with AES-256 and refreshed automatically — you never have to worry about expiring sessions again.",
    bullets: [
      "OAuth 2.0 secure login — no passwords stored",
      "AES-256 encrypted credential vault",
      "Instagram, Facebook, LinkedIn & more",
      "Auto-refreshing tokens for uninterrupted access",
      "Revoke access anytime from your dashboard",
    ],
    mockupLabel: "Connected Accounts",
    mockupAccounts: [
      { name: "Instagram", status: "Connected", color: "bg-pink-500" },
      { name: "Facebook", status: "Connected", color: "bg-blue-600" },
      { name: "LinkedIn", status: "Connected", color: "bg-blue-500" },
    ],
  },
  {
    number: "02",
    icon: PenTool,
    title: "Create Your Content",
    description:
      "Craft scroll-stopping posts with our intuitive content editor. Write captions, upload images or videos, and let our built-in AI suggest engaging copy tailored to each platform. Select which accounts to publish to and preview exactly how your post will look before it goes live.",
    bullets: [
      "Rich text editor with media uploads",
      "AI-powered caption suggestions",
      "Platform-specific post previews",
      "Hashtag recommendations & research",
      "Draft saving for collaborative workflows",
    ],
    mockupLabel: "Content Editor",
    mockupFeatures: [
      { icon: ImageIcon, label: "Media" },
      { icon: Sparkles, label: "AI Assist" },
      { icon: Globe, label: "Multi-Platform" },
    ],
  },
  {
    number: "03",
    icon: Send,
    title: "Publish & Automate",
    description:
      "Hit publish immediately or schedule posts for the perfect moment. Our AI-powered automation engine handles the heavy lifting — queuing posts, retrying on failure, and respecting each platform's rate limits. Set it once and let your social presence run on autopilot while you focus on strategy.",
    bullets: [
      "Immediate publishing or smart scheduling",
      "Built-in automation engine",
      "Automatic retries on transient failures",
      "Rate-limit aware across all platforms",
      "Timezone-aware scheduling for global reach",
    ],
    mockupLabel: "Automation Pipeline",
    mockupPipeline: [
      { label: "Queued", icon: Clock },
      { label: "Publishing", icon: Send },
      { label: "Published", icon: CheckCircle2 },
    ],
  },
];

const pipelineStages = [
  { label: "Connect", icon: Plug },
  { label: "Plan", icon: Calendar },
  { label: "Create", icon: PenTool },
  { label: "Review", icon: Eye },
  { label: "Publish", icon: Rocket },
  { label: "Analyze", icon: BarChart3 },
];

const faqs = [
  {
    question: "How long does it take to set up?",
    answer:
      "Most users are up and running in under 5 minutes. Simply connect your social accounts via our secure OAuth flow, and you can start creating and scheduling content immediately. No technical skills or developer setup required.",
  },
  {
    question: "Is my account data safe?",
    answer:
      "Absolutely. We never store your social media passwords. All authentication is handled through official OAuth 2.0 protocols, and your access tokens are encrypted with AES-256 at rest. You can revoke access from your dashboard at any time.",
  },
  {
    question: "What platforms do you support?",
    answer:
      "We currently support Instagram (Business/Creator), Facebook Pages & Groups, LinkedIn Profiles & Company Pages, and more platforms are on our roadmap. Each platform integration is maintained to stay up-to-date with the latest API changes.",
  },
  {
    question: "What happens if a post fails to publish?",
    answer:
      "Our automation engine automatically detects transient failures and retries the publish with exponential backoff. You'll receive a notification if manual intervention is needed, and failed posts are preserved in your dashboard so you can fix and reschedule them instantly.",
  },
  {
    question: "Can I schedule posts in advance?",
    answer:
      "Yes — you can schedule posts weeks or even months in advance. Our calendar view gives you a clear overview of your content pipeline, and you can drag-and-drop to rearrange your schedule at any time. Timezone-aware scheduling ensures posts go out at the right moment for your audience.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-100/60 blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            <Zap className="h-4 w-4" />
            Simple, powerful, automated
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Up and Running{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            No complicated onboarding. No steep learning curve. Just three
            straightforward steps to fully automated social media publishing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get Started Free
            </Link>
            <Link
              href="#steps"
              className="text-sm font-semibold leading-6 text-gray-900 transition hover:text-indigo-600"
            >
              See how it works <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <section id="steps" className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three Steps to{" "}
              <span className="text-indigo-600">Full Automation</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Each step is designed to get you closer to hands-off social media
              management with zero friction.
            </p>
          </div>

          <div className="mt-20 space-y-32">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isReversed = idx % 2 !== 0;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center gap-16 lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""}`}
                >
                  {/* Text Content */}
                  <div className="flex-1 space-y-6">
                    <div className="relative">
                      <span className="absolute -top-14 -left-4 text-8xl font-black text-indigo-100/80 select-none">
                        {step.number}
                      </span>
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                          Step {step.number}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed text-gray-600">
                      {step.description}
                    </p>

                    <ul className="space-y-3 pt-2">
                      {step.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm text-gray-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-500" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual Mockup */}
                  <div className="flex-1">
                    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-8 shadow-xl">
                      {/* Fake browser bar */}
                      <div className="mb-6 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-400" />
                        <div className="h-3 w-3 rounded-full bg-amber-400" />
                        <div className="h-3 w-3 rounded-full bg-green-400" />
                        <span className="ml-4 text-xs text-gray-400">
                          SocialPilot — {step.mockupLabel}
                        </span>
                      </div>

                      {/* Accounts mockup */}
                      {step.mockupAccounts && (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            {step.mockupLabel}
                          </p>
                          {step.mockupAccounts.map((account) => (
                            <div
                              key={account.name}
                              className="flex items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-8 w-8 rounded-full ${account.color}`}
                                />
                                <span className="text-sm font-medium text-gray-900">
                                  {account.name}
                                </span>
                              </div>
                              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                                <span className="h-2 w-2 rounded-full bg-green-500" />
                                {account.status}
                              </span>
                            </div>
                          ))}
                          <div className="mt-4 rounded-lg border-2 border-dashed border-gray-200 px-4 py-3 text-center">
                            <span className="text-sm text-gray-400">
                              + Add another account
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Features mockup */}
                      {step.mockupFeatures && (
                        <div>
                          <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
                            <div className="mb-2 h-3 w-3/4 rounded bg-gray-200" />
                            <div className="mb-2 h-3 w-1/2 rounded bg-gray-200" />
                            <div className="h-3 w-2/3 rounded bg-gray-200" />
                          </div>
                          <div className="flex gap-3">
                            {step.mockupFeatures.map((feat) => {
                              const FeatIcon = feat.icon;
                              return (
                                <div
                                  key={feat.label}
                                  className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-white p-3 shadow-sm"
                                >
                                  <FeatIcon className="h-5 w-5 text-indigo-500" />
                                  <span className="text-xs text-gray-500">
                                    {feat.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Pipeline mockup */}
                      {step.mockupPipeline && (
                        <div className="flex items-center justify-between gap-2">
                          {step.mockupPipeline.map((item, i) => {
                            const PIcon = item.icon;
                            return (
                              <div key={item.label} className="flex items-center gap-2">
                                <div className="flex flex-col items-center gap-2">
                                  <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                      i === 2
                                        ? "bg-green-100 text-green-600"
                                        : "bg-indigo-100 text-indigo-600"
                                    }`}
                                  >
                                    <PIcon className="h-5 w-5" />
                                  </div>
                                  <span className="text-xs font-medium text-gray-600">
                                    {item.label}
                                  </span>
                                </div>
                                {i < step.mockupPipeline.length - 1 && (
                                  <div className="mb-6 h-0.5 w-10 bg-gray-200" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pipeline Visual */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Full{" "}
              <span className="text-indigo-600">Automation Pipeline</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From first connection to final analytics — here is every stage of
              your automated workflow.
            </p>
          </div>

          <div className="mt-16 overflow-x-auto">
            <div className="flex items-start justify-between gap-4 min-w-[640px] px-4">
              {pipelineStages.map((stage, idx) => {
                const SIcon = stage.icon;
                const isActive = idx < 5;
                return (
                  <div key={stage.label} className="flex flex-1 flex-col items-center">
                    <div className="relative flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-indigo-600 shadow-lg ring-4 ring-indigo-100">
                        <SIcon className="h-7 w-7" />
                      </div>
                      {isActive && (
                        <div className="absolute right-0 top-1/2 hidden h-0.5 w-full bg-indigo-200 lg:block" />
                      )}
                    </div>
                    <span className="mt-4 text-sm font-semibold text-gray-900">
                      {stage.label}
                    </span>
                    {idx < pipelineStages.length - 1 && (
                      <div className="mt-4 h-0.5 w-full bg-indigo-200 lg:hidden" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop connecting line behind circles */}
            <div className="relative -mt-12 mx-auto hidden lg:block" style={{ width: "calc(100% - 12rem)" }}>
              <div className="mx-auto h-0.5 w-full bg-indigo-200" />
              <div className="mx-auto h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
          </div>

          {/* Feature cards below pipeline */}
          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Bank-Level Security",
                desc: "OAuth 2.0 authentication with AES-256 encrypted credentials. Your data never touches our servers unprotected.",
              },
              {
                icon: Workflow,
                title: "AI-Powered Automation",
                desc: "Powered by our internal automation engine for transparent, extensible, and auditable workflow automation.",
              },
              {
                icon: RefreshCw,
                title: "Automatic Retries",
                desc: "Transient API failures are handled gracefully with exponential backoff and smart retry logic.",
              },
            ].map((feature) => {
              const FIcon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <FIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to know before getting started.
            </p>
          </div>

          <div className="mt-16 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left text-base font-semibold text-gray-900 select-none">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400 transition group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 py-24 sm:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <Rocket className="mx-auto h-12 w-12 text-white/80" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start Your Automation Journey
          </h2>
          <p className="mt-4 text-lg leading-8 text-indigo-100">
            Join hundreds of marketers who have replaced manual posting with
            intelligent, hands-off automation. Your first 7 days are free.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/register"
              className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-indigo-600 shadow-sm transition hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
