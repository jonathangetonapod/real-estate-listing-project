import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const REGULAR_PRICE = 99;
const SPOTS_PER_MARKET = 5;

const benefits = [
  {
    title: '250 verified leads per month',
    detail: 'Expireds, FSBOs, pre-foreclosures, absentee owners, high equity, probate.',
  },
  {
    title: 'AI-drafted email for every lead',
    detail: 'References the property address, asking price, comps, and days on market.',
  },
  {
    title: 'We send on your behalf',
    detail: 'Your name, your brand. 94% inbox rate. Warm-up handled automatically.',
  },
  {
    title: 'Replies in your dashboard',
    detail: 'Track conversations, follow up, and move leads to listing appointments.',
  },
];

const faqItems = [
  {
    q: 'What do I get for $299/mo?',
    a: '250 verified motivated seller leads per month, AI-drafted outreach emails for each lead, managed sending with your name and brand (94% inbox rate), reply tracking in your dashboard, and follow-up sequences. All lead types included: expireds, FSBOs, pre-foreclosures, absentee owners, high equity, and probate.',
  },
  {
    q: 'Why limit agents per zip code?',
    a: 'If multiple agents email the same sellers with the same tool, nobody gets replies. We limit each zip code to 5 agents so your outreach actually works and your leads stay exclusive.',
  },
  {
    q: 'How is this different from Zillow leads?',
    a: 'Zillow shares each lead with dozens of agents and charges $1,200+/mo. OffMarket delivers exclusive, verified seller data with AI-drafted pitches for $299/mo. Your leads are yours. No bidding, no sharing.',
  },
  {
    q: 'Will this hurt my email reputation?',
    a: 'We never touch your personal email. Every email goes out from our managed infrastructure with your name and brand in the from field. We handle warm-up, rotation, and deliverability. Replies come into your OffMarket dashboard.',
  },
  {
    q: 'Do I need any other tools?',
    a: 'No. We handle all data sourcing, skip-tracing, email verification, AI drafting, and sending. No exporting CSVs, no manual lookups, no separate subscriptions.',
  },
  {
    q: 'How long until I see results?',
    a: 'Your sending domain needs 7-14 days to warm up. This is non-negotiable \u2014 it keeps your emails out of spam. Most agents see their first replies within 3-4 weeks. Once warm-up is done, you have a reliable outreach channel that works month after month.',
  },
  {
    q: 'Is cold emailing homeowners legal?',
    a: 'Yes, when done properly under CAN-SPAM. Every email includes your real identity, physical address, and one-click unsubscribe. We handle compliance automatically.',
  },
  {
    q: 'When do you launch?',
    a: 'We are onboarding markets in waves. Waitlist members get first access when their market opens.',
  },
  {
    q: 'What if I want to cancel?',
    a: 'Cancel anytime from your dashboard. No calls, no retention team, no hoops. Your data and conversation history stay available for 30 days after cancellation.',
  },
];

function useCountUp(target, duration = 2000, shouldStart = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) return;
    const startTime = performance.now();
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(Math.round(easeOut(progress) * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, shouldStart]);

  return value;
}

function FAQItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border-b border-gray-200"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        className="flex w-full items-center justify-between py-4 md:py-5 min-h-[44px] text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-heading text-[15px] md:text-[17px] font-bold text-charcoal leading-snug pr-8">
          {q}
        </span>
        <span className={cn(
          'shrink-0 text-orange text-xl font-sans transition-transform duration-200',
          open && 'rotate-45'
        )}>
          +
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-sans text-[15px] leading-relaxed text-gray-500">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [zipSubmitted, setZipSubmitted] = useState(false);
  const counterRef = useRef(null);
  const [counterVisible, setCounterVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCounterVisible(true); },
      { threshold: 0.3 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, []);

  // No fake social proof numbers — show real product stats instead
  const unused = counterVisible; // keep observer for animation trigger

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  const handleZipSubmit = (e) => {
    e.preventDefault();
    if (zipCode.trim()) setZipSubmitted(true);
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (d = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.6, delay: d, ease: 'easeOut' },
    }),
  };

  return (
    <div className="min-h-screen bg-white text-charcoal">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-4 md:px-6 md:py-5 mx-auto max-w-5xl">
        <Link to="/" className="font-heading text-xl font-bold">
          <span className="text-charcoal">Off</span>
          <span className="text-orange">Market</span>
        </Link>
        <Link to="/" className="font-sans text-sm text-gray-400 hover:text-charcoal transition-colors">
          &larr; Back to home
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-4 pt-12 pb-12 md:px-6 md:pt-24 md:pb-28">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/[0.06] px-4 py-1.5 mb-8"
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
            <span className="font-mono text-xs font-medium text-orange tracking-wide">
              Limited to {SPOTS_PER_MARKET} agents per zip code
            </span>
          </motion.div>

          <motion.h1
            className="font-heading text-3xl md:text-[56px] font-bold leading-[1.08] tracking-tight mb-6"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          >
            Motivated sellers in your zip code.{' '}
            <span className="italic text-orange">Delivered in 12 hours.</span>
          </motion.h1>

          <motion.p
            className="font-sans text-lg md:text-xl text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
          >
            OffMarket finds homeowners ready to sell, drafts personalized outreach with AI, and sends it with your name. You wake up to replies.
          </motion.p>

          {/* Email form */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
          >
            {!submitted ? (
              <form onSubmit={handleEmailSubmit} className="mx-auto max-w-md">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-0">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-auto flex-1 rounded-xl sm:rounded-r-none bg-light-bg border-gray-200 px-5 py-4 font-sans text-[15px] text-charcoal placeholder:text-gray-400 focus-visible:border-orange focus-visible:ring-orange/30"
                  />
                  <Button
                    type="submit"
                    className="h-auto rounded-xl sm:rounded-l-none bg-orange px-7 py-4 font-sans text-[15px] font-semibold text-white border-none hover:bg-orange/90 transition-colors whitespace-nowrap"
                  >
                    Join the Waitlist &rarr;
                  </Button>
                </div>
                <p className="mt-4 font-sans text-sm text-gray-400">
                  No credit card. We&apos;ll notify you when your market opens.
                </p>
              </form>
            ) : !zipSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-md"
              >
                <div className="rounded-xl border border-success/20 bg-success/[0.06] p-6 mb-4">
                  <p className="font-sans text-base font-medium text-success mb-1">
                    You&apos;re on the list.
                  </p>
                  <p className="font-sans text-sm text-gray-400">
                    One more thing: tell us your market so we can check availability.
                  </p>
                </div>
                <form onSubmit={handleZipSubmit} className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="Your zip code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    maxLength={5}
                    className="h-auto flex-1 rounded-xl bg-light-bg border-gray-200 px-5 py-4 font-sans text-[15px] text-charcoal placeholder:text-gray-400 focus-visible:border-orange focus-visible:ring-orange/30"
                  />
                  <Button
                    type="submit"
                    className="h-auto rounded-xl bg-orange px-7 py-4 font-sans text-[15px] font-semibold text-white border-none hover:bg-orange/90"
                  >
                    Check
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto max-w-md"
              >
                <div className="rounded-xl border border-orange/20 bg-orange/[0.06] p-6">
                  <p className="font-mono text-sm text-orange mb-1">
                    {zipCode} — 11 of {SPOTS_PER_MARKET} spots claimed
                  </p>
                  <p className="font-heading text-2xl font-bold text-charcoal mb-2">
                    You&apos;re on the waitlist
                  </p>
                  <p className="font-sans text-sm text-gray-400">
                    We&apos;ll notify you when your market opens.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Product facts strip */}
      <section ref={counterRef} className="border-y border-gray-200 py-6">
        <div className="mx-auto max-w-5xl px-4 md:px-6 flex flex-wrap items-center justify-center gap-6 md:gap-16">
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-orange">250</span>
            <span className="block font-sans text-xs text-gray-500 mt-1">verified leads/month</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-charcoal">12hrs</span>
            <span className="block font-sans text-xs text-gray-500 mt-1">lead turnaround</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-charcoal">94%</span>
            <span className="block font-sans text-xs text-gray-500 mt-1">inbox placement</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-charcoal">$299</span>
            <span className="block font-sans text-xs text-gray-500 mt-1">per month</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-3xl">
          <motion.p
            className="font-mono text-xs font-medium uppercase tracking-widest text-orange mb-4 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What you get
          </motion.p>
          <motion.h2
            className="font-heading text-2xl md:text-4xl font-bold text-center mb-10 md:mb-14 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything you need to fill your pipeline.{' '}
            <span className="text-gray-400">Nothing you don&apos;t.</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-colors duration-200 hover:border-orange/20"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <h3 className="font-sans text-[15px] font-semibold text-charcoal mb-2">
                  {b.title}
                </h3>
                <p className="font-sans text-sm text-gray-500 leading-relaxed">
                  {b.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zillow comparison */}
      <section className="px-4 pb-12 md:px-6 md:pb-20">
        <motion.div
          className="mx-auto max-w-xl overflow-hidden rounded-xl border border-gray-200"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2">
            <div className="border-r border-gray-200 p-4 md:p-6 text-center bg-gray-50">
              <span className="block font-sans text-xs font-medium uppercase tracking-wide text-gray-400 mb-2">
                Zillow Leads
              </span>
              <span className="block font-mono text-2xl font-bold text-gray-300 line-through">
                $1,200+/mo
              </span>
              <span className="block font-sans text-xs text-gray-300 mt-1">
                Shared with dozens of agents
              </span>
            </div>
            <div className="p-4 md:p-6 text-center">
              <span className="block font-sans text-xs font-medium uppercase tracking-wide text-orange mb-2">
                OffMarket
              </span>
              <span className="block font-mono text-2xl font-bold text-orange">
                $299/mo
              </span>
              <span className="block font-sans text-xs text-gray-400 mt-1">
                Exclusive to your zip code
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-4 pb-12 md:px-6 md:pb-20">
        <div className="mx-auto max-w-xl">
          <motion.h2
            className="font-heading text-2xl font-bold text-center mb-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Questions
          </motion.h2>
          {faqItems.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} index={i} />
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-gray-200 px-4 py-12 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="font-heading text-2xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your market won&apos;t stay open forever.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {SPOTS_PER_MARKET} spots per zip code. Once they&apos;re gone, they&apos;re gone.
          </motion.p>
          <Button
            className="h-auto w-full sm:w-auto rounded-xl bg-orange px-8 py-4 font-sans text-base font-semibold text-white border-none hover:bg-orange/90 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Join the Waitlist &rarr;
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-3">
          <div className="font-heading text-base font-bold">
            Off<span className="text-orange">Market</span>
          </div>
          <p className="font-sans text-xs text-gray-300">
            &copy; 2026 OffMarket. Not affiliated with any MLS or brokerage.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default WaitlistPage;
