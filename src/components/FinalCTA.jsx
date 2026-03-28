import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function FinalCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="bg-dark px-5 py-20 text-center text-white">
      <motion.h2
        className="mx-auto mb-4 font-heading text-4xl font-bold leading-tight md:text-[44px]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        Every Day You Wait, Another Agent Gets the{' '}
        <span className="text-orange">Appointment</span>.
      </motion.h2>

      <motion.p
        className="mb-8 font-sans text-lg text-gray-400 md:text-lg"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        Limited to 5 agents per zip code. Claim your farm area before someone else does.
      </motion.p>

      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {!submitted ? (
          <div className="mb-4 flex justify-center">
            <form
              className="flex w-full max-w-lg flex-col items-center gap-3 sm:flex-row sm:gap-0"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                className="h-auto w-full flex-1 rounded-lg border-[#444] bg-[#333] px-5 py-4 font-sans text-[15px] text-white placeholder:text-[#777] focus-visible:border-orange focus-visible:ring-orange/50 sm:rounded-r-none sm:border-r-0"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="h-auto w-full whitespace-nowrap rounded-lg bg-orange px-7 py-4 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-orange/90 sm:w-auto sm:rounded-l-none"
              >
                Send Me My Seller List &rarr;
              </Button>
            </form>
          </div>
        ) : (
          <motion.div
            className="mb-4 inline-flex items-center gap-2.5 rounded-lg border border-success/30 bg-success/10 px-7 py-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="shrink-0 text-xl text-green-400">&#10003;</span>
            <span className="text-left font-sans text-[15px] font-medium text-green-400">
              You&apos;re in! We&apos;ll reach out within 12 hours to set up
              your farm area.
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.p
        className="font-sans text-[13px] text-[#666]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
      >
        No credit card required &middot; Cancel anytime &middot; Your data stays
        private
      </motion.p>
    </section>
  );
}

export default FinalCTA;
