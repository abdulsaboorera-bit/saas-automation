'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Calendar,
  Sparkles,
  Send,
  BarChart3,
  ArrowRight,
  Zap,
  Shield,
  Star,
  Users,
  TrendingUp,
  Check,
  ChevronDown,
  Play,
  Cpu,
  Layers,
  Target,
  Clock,
  Link2,
  PenLine,
  Rocket,
  Quote,

} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function AnimatedSection({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.03, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      <motion.div
        className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] bg-gradient-to-br from-pink-500/15 to-rose-500/15 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
    </div>
  );
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
}

function ParticleField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: [0, -40, 0], opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Hero ─── */

function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center pt-16 pb-20"
    >
      <FloatingOrbs />
      <GridPattern />
      <ParticleField />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            Now in Public Beta — Start Free Today
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Automate Your{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Social Media
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-indigo-100 rounded-full -z-10"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: 'left' }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect Instagram, Facebook, and LinkedIn. Create content once,
            publish everywhere with AI-powered automation. Built for modern
            creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:-translate-y-0.5 text-lg"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all text-lg group">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <Play className="w-4 h-4 text-gray-600 group-hover:text-indigo-600 ml-0.5" />
              </div>
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500'].map(
                  (color, i) => (
                    <div
                      key={i}
                      className={`w-7 h-7 ${color} rounded-full border-2 border-white flex items-center justify-center`}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {String.fromCharCode(65 + i)}
                      </span>
                    </div>
                  )
                )}
              </div>
              <span>2,400+ creators</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
              <span className="ml-1">4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 bg-gray-200 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Pipeline Preview ─── */

function PipelinePreviewSection() {
  const pipelineSteps = [
    {
      label: 'Connect',
      sub: 'OAuth secure linking',
      icon: Globe,
      color: 'from-indigo-500 to-indigo-600',
      shadow: 'shadow-indigo-200',
      status: '3 connected',
      statusColor: 'text-indigo-600',
    },
    {
      label: 'Plan',
      sub: 'Schedule & organize',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      shadow: 'shadow-purple-200',
      status: '18 scheduled',
      statusColor: 'text-purple-600',
    },
    {
      label: 'AI Create',
      sub: 'Auto-generate posts',
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
      shadow: 'shadow-amber-200',
      status: 'Ready to publish',
      statusColor: 'text-amber-600',
    },
    {
      label: 'Publish',
      sub: 'Multi-platform sync',
      icon: Send,
      color: 'from-cyan-500 to-blue-500',
      shadow: 'shadow-cyan-200',
      status: '127 published',
      statusColor: 'text-cyan-600',
    },
    {
      label: 'Analytics',
      sub: 'Track performance',
      icon: BarChart3,
      color: 'from-pink-500 to-rose-500',
      shadow: 'shadow-pink-200',
      status: '+24% growth',
      statusColor: 'text-pink-600',
    },
  ];

  const statCards = [
    {
      label: 'Connected',
      value: '3',
      icon: Globe,
      change: '+1 this week',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Published',
      value: '127',
      icon: Check,
      change: '+24 this month',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Scheduled',
      value: '18',
      icon: Clock,
      change: 'Next: 2hrs',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <Zap className="w-4 h-4" />
            Automation Pipeline
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight"
          >
            Your content journey, automated{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              end-to-end
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-500 max-w-xl mx-auto">
            From connecting accounts to tracking analytics — every step is
            handled automatically.
          </motion.p>
        </AnimatedSection>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden p-8"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10" />

          <div className="relative mb-10">
            <div className="absolute top-10 left-[8%] right-[8%] h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30" />
            <div className="absolute top-10 left-[8%] right-[8%] h-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                style={{ width: '75%' }}
              />
            </div>

            <div className="grid grid-cols-5 gap-4 relative">
              {pipelineSteps.map((step) => (
                <div key={step.label} className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, y: -5 }}
                    className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg ${step.shadow} mb-3 relative z-10 cursor-pointer`}
                  >
                    <step.icon className="w-9 h-9 text-white" strokeWidth={2} />
                  </motion.div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{step.label}</h4>
                  <p className="text-xs text-gray-400 mb-2">{step.sub}</p>
                  <span className={`text-xs font-semibold ${step.statusColor}`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                  <div
                    className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-[11px] text-gray-400">{stat.change}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Trusted By ─── */

function TrustedBySection() {
  const logos = [
    { name: 'Stripe', letter: 'S' },
    { name: 'Vercel', letter: 'V' },
    { name: 'Linear', letter: 'L' },
    { name: 'Notion', letter: 'N' },
    { name: 'Figma', letter: 'F' },
    { name: 'Slack', letter: 'S' },
  ];

  return (
    <section className="py-20 border-y border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
      <AnimatedSection className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          variants={fadeUp}
          className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
        >
          Trusted by forward-thinking companies worldwide
        </motion.p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {logos.map((logo) => (
            <motion.div
              key={logo.name}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center gap-2.5 opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-default"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-sm font-black text-gray-500">{logo.letter}</span>
              </div>
              <span className="text-xl font-bold text-gray-500 tracking-tight">
                {logo.name}
              </span>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}

/* ─── Features Grid ─── */

function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: 'Multi-Platform Publishing',
      description:
        'Connect and manage Instagram, Facebook, and LinkedIn from one unified dashboard.',
      iconBg: 'bg-blue-500',
      iconShadow: 'shadow-blue-200',
      hoverBorder: 'hover:border-blue-200',
      tag: 'Social',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description:
        'Schedule posts for optimal engagement times. Your content publishes automatically.',
      iconBg: 'bg-purple-500',
      iconShadow: 'shadow-purple-200',
      hoverBorder: 'hover:border-purple-200',
      tag: 'Planning',
    },
    {
      icon: Cpu,
      title: 'AI Content Engine',
      description:
        'Generate compelling content with our AI-powered automation pipeline.',
      iconBg: 'bg-amber-500',
      iconShadow: 'shadow-amber-200',
      hoverBorder: 'hover:border-amber-200',
      tag: 'Automation',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description:
        'AES-256-GCM encrypted tokens and secure OAuth flows protect your credentials.',
      iconBg: 'bg-emerald-500',
      iconShadow: 'shadow-emerald-200',
      hoverBorder: 'hover:border-emerald-200',
      tag: 'Security',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description:
        'Track your posting performance and engagement across all connected platforms.',
      iconBg: 'bg-cyan-500',
      iconShadow: 'shadow-cyan-200',
      hoverBorder: 'hover:border-cyan-200',
      tag: 'Insights',
    },
    {
      icon: Layers,
      title: 'Content Calendar',
      description:
        'Visual calendar view to plan, organize, and manage your content strategy.',
      iconBg: 'bg-rose-500',
      iconShadow: 'shadow-rose-200',
      hoverBorder: 'hover:border-rose-200',
      tag: 'Organize',
    },
  ];

  return (
    <section id="features" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Features
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              scale
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-500">
            Powerful features to automate your social media workflow and grow your
            audience.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
              className={`group relative p-8 bg-white rounded-2xl border border-gray-100 ${feature.hoverBorder} hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 overflow-hidden`}
            >
              <div
                className={`absolute -top-20 -right-20 w-40 h-40 ${feature.iconBg} rounded-full opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-500`}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center shadow-lg ${feature.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */

function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Connect Accounts',
      description:
        'Securely connect your social accounts using official OAuth flows. Your credentials are encrypted and never exposed.',
      icon: Link2,
    },
    {
      number: '02',
      title: 'Create Content',
      description:
        'Write captions, upload images, and select which platforms to post to. Use AI to generate engaging content.',
      icon: PenLine,
    },
    {
      number: '03',
      title: 'Publish & Automate',
      description:
        'Publish immediately or schedule for later. Our AI-powered automation handles the heavy lifting.',
      icon: Rocket,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <Target className="w-4 h-4" />
            How It Works
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Up and running in{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              minutes
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-500">
            Three simple steps to transform your social media workflow.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={fadeUp} className="relative">
              <div className="text-8xl font-black text-gray-100 absolute -top-4 -left-2 select-none">
                {step.number}
              </div>
              <div className="relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-indigo-200/50">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ─── */

function StatsSection() {
  const stats = [
    { value: '10K+', label: 'Active Users', icon: Users },
    { value: '500K+', label: 'Posts Published', icon: Send },
    { value: '99.9%', label: 'Uptime', icon: TrendingUp },
    { value: '24/7', label: 'Automation', icon: Clock },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>
      <motion.div
        className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={scaleIn} className="text-center">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-4xl sm:text-5xl font-bold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-sm text-white/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */

function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "SocialPilot has completely transformed how I manage my social presence. I create one post and it goes out everywhere — the AI content suggestions are incredible.",
      name: 'Sarah Chen',
      role: 'Content Creator',
      avatar: 'SC',
      avatarBg: 'bg-indigo-500',
      rating: 5,
    },
    {
      quote:
        "We manage social for 12 client accounts. Before SocialPilot, that meant 12 different logins and constant context switching. Now it's all in one place.",
      name: 'Marcus Johnson',
      role: 'Agency Director',
      avatar: 'MJ',
      avatarBg: 'bg-purple-500',
      rating: 5,
    },
    {
      quote:
        "The analytics alone are worth the subscription. I can finally see which content performs best across platforms and adjust my strategy accordingly.",
      name: 'Elena Rodriguez',
      role: 'Marketing Manager',
      avatar: 'ER',
      avatarBg: 'bg-pink-500',
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <Star className="w-4 h-4" />
            Testimonials
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Loved by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              creators
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-500">
            See what our users have to say about their experience.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-indigo-200 mb-4" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 ${t.avatarBg} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white text-xs font-bold">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Pricing ─── */

function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: '/month',
      features: [
        '3 Social Accounts',
        '50 Posts/month',
        'Basic Scheduling',
        'Email Support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$29',
      period: '/month',
      features: [
        '10 Social Accounts',
        'Unlimited Posts',
        'Advanced Scheduling',
        'Priority Support',
        'Analytics',
        'AI Content',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: '/month',
      features: [
        'Unlimited Accounts',
        'Unlimited Posts',
        'Custom Workflows',
        'Dedicated Support',
        'API Access',
        'Custom Integrations',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            Pricing
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Simple, transparent{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              pricing
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-gray-500">
            Start free. Upgrade when you need more power.
          </motion.p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`relative p-8 bg-white rounded-2xl border ${
                plan.popular
                  ? 'border-indigo-500 shadow-xl shadow-indigo-100 ring-1 ring-indigo-500'
                  : 'border-gray-200 shadow-sm'
              } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-400">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-200/50 hover:shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faq = [
    {
      question: 'How does the OAuth connection work?',
      answer:
        'We use official OAuth flows from each platform. You never share your password with us. We request specific permissions needed to publish content on your behalf, and all tokens are encrypted at rest.',
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. All tokens are encrypted with AES-256-GCM, all communication is over HTTPS, and we implement proper authentication. Your credentials are never exposed to the browser.',
    },
    {
      question: 'Can I disconnect my accounts?',
      answer:
        'Yes, you can disconnect any account at any time from the Accounts page. This will immediately revoke our access to that platform and delete all associated tokens.',
    },
    {
      question: 'What happens if publishing fails?',
      answer:
        'Failed posts are clearly marked with detailed error messages. You can retry failed posts, edit them, or republish. Our system automatically retries transient failures.',
    },
    {
      question: 'Do I need to keep my browser open?',
      answer:
        'No. All scheduled posts are handled server-side. You can close your browser and your posts will still publish on time. Our built-in automation engine handles all scheduling.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-700 mb-4"
          >
            <Zap className="w-4 h-4" />
            FAQ
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
          >
            Frequently asked{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              questions
            </span>
          </motion.h2>
        </AnimatedSection>

        <div className="space-y-3">
          {faq.map((item, i) => (
            <motion.div key={i} variants={fadeUp}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-sm text-gray-500 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <motion.h2
            variants={fadeUp}
            className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight"
          >
            Ready to transform your social media?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of creators who are automating their social media
            workflow. Start free, no credit card required.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-indigo-600 bg-white rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl hover:shadow-white/20 hover:scale-105 duration-300"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 transition-all"
            >
              Talk to Sales
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── Page ─── */

export default function MarketingPage() {
  return (
    <div>
      <HeroSection />
      <PipelinePreviewSection />
      <TrustedBySection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
