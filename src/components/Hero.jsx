import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const roles = [
  { label: 'Solo Agent', sub: 'Fill your pipeline without cold calling.' },
  { label: 'Team', sub: 'Scale outreach across your farm areas.' },
  { label: 'Brokerage', sub: 'Give every agent exclusive seller leads.' },
];

export function Hero() {
  const [activeRole, setActiveRole] = useState(0);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    }),
  };

  return (
    <section className="flex flex-col items-center px-4 pt-16 pb-16 md:px-6 md:pt-20 md:pb-16 bg-white text-center">
      {/* Role selector tabs */}
      <motion.div
        className="flex items-center gap-1 rounded-full border border-gray-200 bg-light-bg p-1 mb-8"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        {roles.map((role, i) => (
          <button
            key={role.label}
            onClick={() => setActiveRole(i)}
            className={cn(
              'rounded-full px-5 py-2 font-sans text-sm font-medium transition-all duration-200',
              activeRole === i
                ? 'bg-charcoal text-white shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            )}
          >
            {role.label}
          </button>
        ))}
      </motion.div>

      {/* Badge */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/[0.06] text-orange border border-orange/20 rounded-full text-sm font-medium font-mono mb-8 tracking-wide"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.05}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse" />
        Limited to 5 agents per zip code
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-heading text-4xl md:text-6xl font-bold text-dark leading-[1.1] tracking-tight max-w-3xl mb-5"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        Stop Competing for Leads.{' '}
        <span className="italic text-orange">Own</span>{' '}
        Your Market.
      </motion.h1>

      {/* Role-specific subheadline */}
      <motion.p
        className="font-sans text-lg md:text-xl font-normal text-charcoal/50 leading-relaxed max-w-2xl mb-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.15}
        key={activeRole}
      >
        {roles[activeRole].sub}
      </motion.p>

      {/* Main subheadline */}
      <motion.p
        className="font-sans text-base md:text-lg font-normal text-charcoal/40 leading-relaxed max-w-xl mb-10"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        Verified seller leads in 12 hours. AI-drafted pitches. We send on your behalf. Replies in your dashboard.
      </motion.p>

      {/* CTA */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        <Link to="/waitlist">
          <Button
            className="h-auto rounded-xl bg-orange text-white font-sans text-base font-semibold px-10 py-4 border-orange hover:bg-orange/90 transition-colors duration-200"
          >
            Join the Waitlist &rarr;
          </Button>
        </Link>
      </motion.div>

      {/* Trust line */}
      <motion.p
        className="font-sans text-sm text-charcoal/30 leading-relaxed mt-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        No credit card. We notify you when your market opens.
      </motion.p>
    </section>
  );
}

export default Hero;
