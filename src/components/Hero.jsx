import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Hero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    }),
  };

  return (
    <section className="flex flex-col items-center px-4 pt-20 pb-16 md:px-6 md:pt-20 md:pb-16 bg-white text-center">
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
        className="font-heading text-4xl md:text-6xl font-bold text-dark leading-[1.1] tracking-tight max-w-3xl mb-6"
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
        className="font-sans text-lg md:text-xl font-normal text-charcoal/60 leading-relaxed max-w-2xl mb-8"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        We deliver motivated seller leads in your farm area within 12 hours,
        with verified emails, property data, and AI-written pitches ready to send.
        More listing appointments without cold calling, door knocking, or paying for shared leads.
      </motion.p>

      {/* Email form / success */}
      <motion.div
        className="w-full flex flex-col items-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
      >
        {!submitted ? (
          <form
            className="flex flex-col md:flex-row items-center gap-4 md:gap-0 w-full max-w-lg mb-4"
            onSubmit={handleSubmit}
          >
            <div className="flex-1 w-full">
              <Input
                type="email"
                className="w-full h-auto px-4 py-4 font-sans text-[15px] text-charcoal bg-white border-border md:rounded-r-none md:border-r-0 rounded-xl focus-visible:border-orange focus-visible:ring-orange/50"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full md:w-auto rounded-xl md:rounded-l-none bg-orange text-white font-sans text-[15px] font-semibold px-8 py-4 h-auto border-orange hover:bg-orange/90 transition-colors duration-200 whitespace-nowrap"
            >
              See My Seller List &rarr;
            </Button>
          </form>
        ) : (
          <motion.div
            className="flex items-center gap-4 px-6 py-4 bg-success/10 border border-success/30 rounded-xl mb-4 max-w-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-xl flex-shrink-0 text-success">&#10003;</span>
            <span className="font-sans text-[15px] font-medium text-green-800 text-left">
              You&apos;re in! We&apos;ll reach out within 12 hours to set up your farm area.
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Trust line */}
      <motion.p
        className="font-sans text-sm text-charcoal/40 leading-relaxed"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        See your leads before you pay. No credit card. Cancel in one click.
      </motion.p>
    </section>
  );
}

export default Hero;
