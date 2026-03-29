import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function Hero() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    }),
  };

  return (
    <section className="flex flex-col items-center px-4 pt-12 pb-12 md:px-6 md:pt-20 md:pb-16 bg-white text-center">
      {/* Badge */}
      <motion.div
        className="inline-flex items-center px-4 py-1.5 bg-yellow/10 text-yellow-800 border border-yellow/30 rounded-full text-sm font-medium font-sans mb-8 tracking-[0.01em]"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Limited to 5 agents per zip code — check availability
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="font-heading text-3xl md:text-6xl font-bold text-dark leading-[1.1] tracking-tight max-w-3xl mb-6"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        Stop Competing for Leads.{' '}
        <span className="italic text-orange">Own</span>{' '}
        Your Market.
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="font-sans text-lg md:text-xl font-normal text-charcoal/60 leading-relaxed max-w-2xl mb-10"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        We deliver verified seller leads with full property and financial data,
        then deploy 3-step email sequences with A/B/C variations on your behalf.
        Replies flow into your Inbox. Hot leads move to your Deals pipeline. No cold calling, no shared leads.
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
            className="h-auto w-full sm:w-auto rounded-xl bg-orange text-white font-sans text-base font-semibold px-10 py-4 border-orange hover:bg-orange/90 transition-colors duration-200"
          >
            Join the Waitlist &rarr;
          </Button>
        </Link>
      </motion.div>

      {/* Trust line */}
      <motion.p
        className="font-sans text-sm text-charcoal/40 leading-relaxed mt-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        Limited spots per zip code. We&apos;ll notify you when your market opens.
      </motion.p>
    </section>
  );
}

export default Hero;
