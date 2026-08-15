'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Zap, ArrowRight, Star, HelpCircle } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small businesses',
    monthlyPrice: 9,
    annualPrice: 7,
    features: [
      '3 Social Accounts',
      '50 Posts/month',
      'Basic Scheduling',
      'Email Support',
      'Single user',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams who need more power',
    monthlyPrice: 29,
    annualPrice: 23,
    features: [
      '10 Social Accounts',
      'Unlimited Posts',
      'Advanced Scheduling',
      'Priority Support',
      'Analytics Dashboard',
      'AI Content Engine',
      'Content Calendar',
      'Team collaboration (3 seats)',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: 99,
    annualPrice: 79,
    features: [
      'Unlimited Accounts',
      'Unlimited Posts',
      'Custom Workflows',
      'Dedicated Support',
      'API Access',
      'Custom Integrations',
      'SSO/SAML',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    highlighted: false,
  },
]

const featureComparison = [
  { name: 'Social Accounts', starter: '3', professional: '10', enterprise: 'Unlimited' },
  { name: 'Posts/month', starter: '50', professional: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Basic Scheduling', starter: true, professional: true, enterprise: true },
  { name: 'Advanced Scheduling', starter: false, professional: true, enterprise: true },
  { name: 'Custom Workflows', starter: false, professional: false, enterprise: true },
  { name: 'Analytics Dashboard', starter: false, professional: true, enterprise: true },
  { name: 'AI Content Engine', starter: false, professional: true, enterprise: true },
  { name: 'Content Calendar', starter: false, professional: true, enterprise: true },
  { name: 'Team Collaboration', starter: false, professional: '3 seats', enterprise: 'Unlimited' },
  { name: 'API Access', starter: false, professional: false, enterprise: true },
  { name: 'Custom Integrations', starter: false, professional: false, enterprise: true },
  { name: 'SSO/SAML', starter: false, professional: false, enterprise: true },
  { name: 'SLA Guarantee', starter: false, professional: false, enterprise: true },
  { name: 'Dedicated Account Manager', starter: false, professional: false, enterprise: true },
  { name: 'Email Support', starter: true, professional: true, enterprise: true },
  { name: 'Priority Support', starter: false, professional: true, enterprise: true },
  { name: 'Dedicated Support', starter: false, professional: false, enterprise: true },
]

const faqs = [
  {
    question: 'Can I change plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, the change takes effect at your next billing cycle.',
  },
  {
    question: 'What happens when I hit my limit?',
    answer: 'For Starter plans, scheduling will pause once you reach 50 posts. You can upgrade to Professional or Enterprise for unlimited posts. We\'ll send you a reminder when you\'re approaching your limit.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 14-day money-back guarantee on all plans. If you\'re not satisfied within the first 14 days, contact us for a full refund. No questions asked.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Every plan comes with a 14-day free trial. No credit card required. You can explore all the features of your chosen plan before committing.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for Enterprise plans. All payments are securely processed through Stripe.',
  },
  {
    question: 'Can I get a discount for non-profits?',
    answer: 'Absolutely! We offer a 50% discount for verified non-profit organizations. Contact our support team with your non-profit documentation to get started.',
  },
]

function PricingCard({
  plan,
  isAnnual,
}: {
  plan: (typeof plans)[0]
  isAnnual: boolean
}) {
  const price = isAnnual ? plan.annualPrice : plan.monthlyPrice

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        plan.highlighted
          ? 'border-indigo-600 bg-gradient-to-b from-indigo-50 to-white shadow-xl'
          : 'border-gray-200 bg-white'
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-sm font-semibold text-white">
            <Star className="h-4 w-4" />
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-500">/mo</span>
        </div>
        {isAnnual && (
          <p className="mt-2 text-sm text-indigo-600">
            Save ${plan.monthlyPrice * 12 - plan.annualPrice * 12}/year
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-4">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
          plan.highlighted
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-200'
            : 'border border-gray-300 bg-white text-gray-900 hover:border-indigo-600 hover:text-indigo-600'
        }`}
      >
        Get Started
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function FeatureValue({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-indigo-600" />
  }
  if (value === false) {
    return <span className="mx-auto text-gray-300">—</span>
  }
  return <span className="mx-auto text-sm font-medium text-gray-700">{value}</span>
}

function FAQItem({ faq }: { faq: (typeof faqs)[0] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-600" />
          <span className="font-semibold text-gray-900">{faq.question}</span>
        </div>
        <span
          className={`mt-1 flex-shrink-0 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>
      {isOpen && <p className="mt-4 pl-8 text-gray-600">{faq.answer}</p>}
    </div>
  )
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="px-6 pb-24 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                !isAnnual ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                isAnnual
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                  : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${
                isAnnual ? 'text-gray-900' : 'text-gray-500'
              }`}
            >
              Annual
            </span>
            {isAnnual && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Save 20%
              </span>
            )}
          </div>

          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} isAnnual={isAnnual} />
            ))}
          </div>

          <div className="mx-auto mt-24 max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Feature Comparison
            </h2>
            <p className="mt-4 text-center text-gray-600">
              See which plan is right for you
            </p>

            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Starter
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-indigo-600">
                        Professional
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureComparison.map((feature, index) => (
                      <tr
                        key={feature.name}
                        className={
                          index < featureComparison.length - 1
                            ? 'border-b border-gray-100'
                            : ''
                        }
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {feature.name}
                        </td>
                        <td className="px-6 py-4">
                          <FeatureValue value={feature.starter} />
                        </td>
                        <td className="px-6 py-4">
                          <FeatureValue value={feature.professional} />
                        </td>
                        <td className="px-6 py-4">
                          <FeatureValue value={feature.enterprise} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-center text-gray-600">
              Everything you need to know about our pricing
            </p>

            <div className="mt-12 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-8">
              {faqs.map((faq) => (
                <FAQItem key={faq.question} faq={faq} />
              ))}
            </div>
          </div>

          <div className="mx-auto mt-24 max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-white">
              Start Free Today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
              Join thousands of businesses already using SocialPilot to grow
              their social media presence. No credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-indigo-600 shadow-lg transition-all hover:shadow-xl hover:shadow-indigo-200"
              >
                <Zap className="h-4 w-4" />
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
