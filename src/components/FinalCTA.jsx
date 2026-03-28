import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
        className="mb-8 font-sans text-lg text-gray-400"
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
        <Link to="/waitlist">
          <Button
            className="h-auto rounded-xl bg-orange px-10 py-4 font-sans text-base font-semibold text-white border-none hover:bg-orange/90 transition-colors"
          >
            Join the Waitlist &rarr;
          </Button>
        </Link>
      </motion.div>

      <motion.p
        className="mt-4 font-sans text-[13px] text-[#666]"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
      >
        No credit card required &middot; Cancel anytime &middot; Founding members get $79/mo for life
      </motion.p>
    </section>
  );
}

export default FinalCTA;
