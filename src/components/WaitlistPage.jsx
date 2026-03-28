import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const FOUNDING_PRICE = 79;
const REGULAR_PRICE = 99;
const SPOTS_PER_MARKET = 50;

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
    q: 'What do I get for $99/mo?',
    a: '250 verified motivated seller leads per month, AI-drafted outreach emails for each, managed sending with your name and brand, and reply tracking in your dashboard. All lead types included.',
  },
  {
    q: 'Why limit agents per zip code?',
    a: 'If 50 agents email the same sellers, nobody gets replies. We cap each market so your outreach actually works. When your zip code is full, new agents are waitlisted until a spot opens.',
  },
  {
    q: 'How is this different from Zillow leads?',
    a: 'Zillow shares each lead with dozens of agents and charges $1,200+/mo. ListSignal delivers exclusive, verified seller data with AI-drafted pitches for $99/mo.',
  },
  {
    q: 'When do you launch?',
    a: 'We are onboarding markets in waves. Waitlist members get first access when their market opens. Founding members ($79/mo for life) are prioritized.',
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
      className="border-b border-white/[0.06]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="font-heading text-[17px] font-bold text-white/90 leading-snug pr-8">
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
            <p className="pb-5 font-sans text-[15px] leading-relaxed text-white/50">
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

  const waitlistCount = useCountUp(2347, 2000, counterVisible);

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
    <div className="min-h-screen bg-dark text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 mx-auto max-w-5xl">
        <div className="font-heading text-xl font-bold">
          <span className="text-white">List</span>
          <span className="text-orange">Signal</span>
        </div>
        <span className="hidden sm:block font-mono text-xs text-white/30 tracking-wider uppercase">
          Early Access
        </span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 md:pt-24 md:pb-28">
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
            className="font-heading text-4xl md:text-[56px] font-bold leading-[1.08] tracking-tight mb-6"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.1}
          >
            Motivated sellers in your zip code.{' '}
            <span className="italic text-orange">Delivered by morning.</span>
          </motion.h1>

          <motion.p
            className="font-sans text-lg md:text-xl text-white/50 leading-relaxed mb-10 max-w-xl mx-auto"
            variants={fadeUp} initial="hidden" animate="visible" custom={0.2}
          >
            ListSignal finds homeowners ready to sell, drafts personalized outreach with AI, and sends it with your name. You wake up to replies.
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
                    className="h-auto flex-1 rounded-xl sm:rounded-r-none bg-white/[0.06] border-white/[0.08] px-5 py-4 font-sans text-[15px] text-white placeholder:text-white/30 focus-visible:border-orange focus-visible:ring-orange/30"
                  />
                  <Button
                    type="submit"
                    className="h-auto rounded-xl sm:rounded-l-none bg-orange px-7 py-4 font-sans text-[15px] font-semibold text-white border-none hover:bg-orange/90 transition-colors whitespace-nowrap"
                  >
                    Join the Waitlist &rarr;
                  </Button>
                </div>
                <p className="mt-4 font-sans text-sm text-white/25">
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
                  <p className="font-sans text-sm text-white/40">
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
                    className="h-auto flex-1 rounded-xl bg-white/[0.06] border-white/[0.08] px-5 py-4 font-sans text-[15px] text-white placeholder:text-white/30 focus-visible:border-orange focus-visible:ring-orange/30"
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
                  <p className="font-heading text-2xl font-bold text-white mb-2">
                    You&apos;re #{Math.floor(Math.random() * 200) + 100} on the waitlist
                  </p>
                  <p className="font-sans text-sm text-white/40 mb-4">
                    Founding members get priority access at ${FOUNDING_PRICE}/mo for life (regular ${REGULAR_PRICE}/mo).
                  </p>
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="font-sans text-xs text-white/30 mb-2">
                      Know an agent in a different market? You both lock in founding pricing.
                    </p>
                    <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                      <span className="flex-1 font-mono text-xs text-white/50 truncate">
                        listsignal.com/ref/{email.split('@')[0]}
                      </span>
                      <button
                        className="shrink-0 font-sans text-xs font-semibold text-orange hover:text-orange/80 transition-colors"
                        onClick={() => navigator.clipboard?.writeText(`listsignal.com/ref/${email.split('@')[0]}`)}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Social proof counter */}
      <section ref={counterRef} className="border-y border-white/[0.06] py-6">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-orange">
              {waitlistCount.toLocaleString()}
            </span>
            <span className="block font-sans text-xs text-white/30 mt-1">agents on waitlist</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-white/80">127</span>
            <span className="block font-sans text-xs text-white/30 mt-1">markets requested</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-white/80">12hrs</span>
            <span className="block font-sans text-xs text-white/30 mt-1">lead turnaround</span>
          </div>
          <div className="text-center">
            <span className="font-mono text-2xl font-bold text-white/80">$99</span>
            <span className="block font-sans text-xs text-white/30 mt-1">per month</span>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="px-6 py-20">
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
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-14 leading-tight"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything you need to fill your pipeline.{' '}
            <span className="text-white/40">Nothing you don&apos;t.</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors duration-200 hover:border-orange/20"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <h3 className="font-sans text-[15px] font-semibold text-white mb-2">
                  {b.title}
                </h3>
                <p className="font-sans text-sm text-white/40 leading-relaxed">
                  {b.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Zillow comparison */}
      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto max-w-xl overflow-hidden rounded-xl border border-white/[0.06]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-2">
            <div className="border-r border-white/[0.06] p-6 text-center bg-white/[0.01]">
              <span className="block font-sans text-xs font-medium uppercase tracking-wide text-white/30 mb-2">
                Zillow Leads
              </span>
              <span className="block font-mono text-2xl font-bold text-white/20 line-through">
                $1,200+/mo
              </span>
              <span className="block font-sans text-xs text-white/20 mt-1">
                Shared with dozens of agents
              </span>
            </div>
            <div className="p-6 text-center">
              <span className="block font-sans text-xs font-medium uppercase tracking-wide text-orange mb-2">
                ListSignal
              </span>
              <span className="block font-mono text-2xl font-bold text-orange">
                $99/mo
              </span>
              <span className="block font-sans text-xs text-white/40 mt-1">
                Exclusive to your zip code
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Founding member pricing */}
      <section className="px-6 pb-20">
        <motion.div
          className="mx-auto max-w-xl rounded-xl border border-orange/20 bg-orange/[0.04] p-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block font-mono text-xs font-medium uppercase tracking-widest text-orange mb-3">
            Founding Member Offer
          </span>
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
            <span className="line-through text-white/30 mr-2">${REGULAR_PRICE}/mo</span>
            ${FOUNDING_PRICE}/mo for life
          </h3>
          <p className="font-sans text-sm text-white/40 mb-6 max-w-sm mx-auto">
            First 500 agents lock in founding pricing forever. Join the waitlist to reserve your spot.
          </p>
          <Button
            className="h-auto rounded-xl bg-orange px-8 py-4 font-sans text-base font-semibold text-white border-none hover:bg-orange/90 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Reserve My Spot &rarr;
          </Button>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-20">
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
      <section className="border-t border-white/[0.06] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="font-heading text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your market won&apos;t stay open forever.
          </motion.h2>
          <motion.p
            className="font-sans text-lg text-white/40 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {SPOTS_PER_MARKET} spots per zip code. Once they&apos;re gone, they&apos;re gone.
          </motion.p>
          <Button
            className="h-auto rounded-xl bg-orange px-8 py-4 font-sans text-base font-semibold text-white border-none hover:bg-orange/90 transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Join the Waitlist &rarr;
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-3">
          <div className="font-heading text-base font-bold">
            List<span className="text-orange">Signal</span>
          </div>
          <p className="font-sans text-xs text-white/20">
            &copy; 2026 ListSignal. Not affiliated with any MLS or brokerage.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default WaitlistPage;
