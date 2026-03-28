import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function ScarcityBanner() {
  return (
    <section className="bg-charcoal text-white py-16 px-6 text-center">
      <motion.h2
        className="font-heading text-3xl md:text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
      >
        Only <span className="text-orange">5 agents</span> per zip code.
      </motion.h2>

      <motion.p
        className="font-sans text-lg text-white/50 mb-8"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
      >
        When your market is full, new agents are waitlisted.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <Link to="/waitlist">
          <Button
            className="h-auto rounded-xl bg-orange text-white font-sans text-base font-semibold px-8 py-4 border-orange hover:bg-orange/90 transition-colors duration-200"
          >
            Check Availability &rarr;
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}

export default ScarcityBanner;
