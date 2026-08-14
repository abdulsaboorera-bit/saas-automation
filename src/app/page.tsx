import Link from 'next/link';
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  Smartphone,
  Star,
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from '@/components/ui/social-icons';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SocialPilot</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-indigo-700">Now in Public Beta</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            One Dashboard.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Every Social Account.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Connect Instagram, Facebook and LinkedIn, create your content once, and let your
            automation publish it for you. Schedule posts, track performance, and manage all your
            social accounts from a single dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
            >
              Login to Dashboard
            </Link>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-2xl p-4 sm:p-8 shadow-2xl border border-gray-200">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-4 text-sm text-gray-500">socialpilot.app/dashboard</div>
                </div>
                <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <p className="text-sm text-indigo-600 font-medium">Connected</p>
                    <p className="text-2xl font-bold text-indigo-700">3</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 font-medium">Published</p>
                    <p className="text-2xl font-bold text-green-700">87</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-600 font-medium">Scheduled</p>
                    <p className="text-2xl font-bold text-yellow-700">12</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-sm text-red-600 font-medium">Failed</p>
                    <p className="text-2xl font-bold text-red-700">2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to manage social media
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete suite of tools to connect, create, schedule, and publish across all your
              social media platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Connect your favorite platforms
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Seamlessly integrate with the platforms your audience uses most
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white">
              <InstagramIcon className="w-8 h-8" />
              <span className="text-lg font-semibold">Instagram</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-blue-600 rounded-xl text-white">
              <FacebookIcon className="w-8 h-8" />
              <span className="text-lg font-semibold">Facebook</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 bg-blue-700 rounded-xl text-white">
              <LinkedinIcon className="w-8 h-8" />
              <span className="text-lg font-semibold">LinkedIn</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Automation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                AI-Powered Automation
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our intelligent automation system handles the heavy lifting. Set up your workflows once
                and let the system manage your publishing schedule automatically.
              </p>
              <ul className="space-y-4">
                {aiFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Job Completed</p>
                      <p className="text-sm text-gray-500">Published to Instagram, Facebook</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Scheduled for 3:00 PM</p>
                      <p className="text-sm text-gray-500">LinkedIn post pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">12 posts scheduled</p>
                      <p className="text-sm text-gray-500">This week across 3 platforms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why choose SocialPilot?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Placeholder */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Start free, upgrade when you need more
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-2xl p-8 shadow-sm border-2 ${
                  plan.popular
                    ? 'border-indigo-600 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full mb-4">
                    <Star className="w-3 h-3" />
                    Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500">/{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full py-3 px-6 text-center text-sm font-semibold rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faq.map((item) => (
              <div key={item.question} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to simplify your social media?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and businesses who manage their social media from one
              powerful dashboard.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-indigo-50 transition-all shadow-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SocialPilot</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SocialPilot. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Globe,
    title: 'Multi-Platform Support',
    description: 'Connect and manage Instagram, Facebook, and LinkedIn from one unified dashboard.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts for optimal times. Your content publishes automatically.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track your posting performance across all connected platforms.',
  },
  {
    icon: Shield,
    title: 'Secure OAuth',
    description: 'Bank-level security with encrypted tokens and secure OAuth flows.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Manage your social media from anywhere with our responsive design.',
  },
  {
    icon: Zap,
    title: 'AI Automation',
    description: 'Intelligent publishing workflows that handle the heavy lifting for you.',
  },
];

const steps = [
  {
    title: 'Connect Accounts',
    description: 'Securely connect your Instagram, Facebook, and LinkedIn accounts using OAuth.',
  },
  {
    title: 'Create Content',
    description: 'Write your captions, upload images, and select which platforms to post to.',
  },
  {
    title: 'Publish & Schedule',
    description: 'Publish immediately or schedule for later. Automation handles the rest.',
  },
];

const aiFeatures = [
  'Automated publishing to multiple platforms',
  'Intelligent scheduling based on engagement',
  'Real-time status updates and notifications',
  'Error handling and retry mechanisms',
  'Secure backend-to-backend communication',
];

const benefits = [
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Manage all your accounts from one place instead of switching between apps.',
  },
  {
    icon: Shield,
    title: 'Stay Secure',
    description: 'Your credentials are encrypted and never exposed to the browser.',
  },
  {
    icon: Globe,
    title: 'Reach More',
    description: 'Publish to multiple platforms simultaneously for maximum reach.',
  },
  {
    icon: BarChart3,
    title: 'Track Results',
    description: 'Monitor publishing status and performance across all platforms.',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '$9',
    period: 'month',
    features: ['3 Social Accounts', '50 Posts/month', 'Basic Scheduling', 'Email Support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Professional',
    price: '$29',
    period: 'month',
    features: ['10 Social Accounts', 'Unlimited Posts', 'Advanced Scheduling', 'Priority Support', 'Analytics'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: 'month',
    features: ['Unlimited Accounts', 'Unlimited Posts', 'Custom Workflows', 'Dedicated Support', 'API Access', 'White Label'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faq = [
  {
    question: 'How does the OAuth connection work?',
    answer: 'We use official OAuth flows from each platform. You never share your password with us. We request specific permissions needed to publish content on your behalf.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. All tokens are encrypted at rest, all communication is over HTTPS, and we implement row-level security in our database. Your credentials are never exposed to the browser.',
  },
  {
    question: 'Can I disconnect my accounts?',
    answer: 'Yes, you can disconnect any account at any time from the Accounts page. This will revoke our access to that platform.',
  },
  {
    question: 'What happens if publishing fails?',
    answer: 'Failed posts are clearly marked with error messages. You can retry failed posts or edit and republish them.',
  },
  {
    question: 'Do I need to keep my browser open?',
    answer: 'No. Scheduled posts are handled server-side. You can close your browser and your posts will still publish on time.',
  },
];
