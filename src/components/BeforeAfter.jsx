import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const withoutItems = [
  '10+ hours weekly researching leads and pulling lists',
  'Manual skip-tracing and email verification',
  'Copy-pasting the same generic email templates',
  'Zillow leads shared with 47 other agents',
  'No idea who opened, replied, or ignored you',
];

const withItems = [
  '250 verified leads delivered in 12 hours',
  'Skip-traced emails included, ready to go',
  'AI drafts a unique pitch for every lead',
  'Exclusive to 5 agents per zip code',
  'Track opens, replies, and follow-ups in your dashboard',
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function BeforeAfter() {
  return (
    <section className="bg-white py-20 px-6">
      <motion.h2
        className="font-heading text-4xl font-bold text-center text-charcoal mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true, margin: '-80px' }}
      >
        Deliver better results in 10% of the time.
      </motion.h2>

      <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Without OffMarket */}
        <motion.div
          className="rounded-xl border border-gray-200 p-8 bg-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div
            className="flex items-center gap-2 mb-6"
            variants={itemVariants}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-danger" />
            <span className="font-sans text-sm font-semibold uppercase tracking-wide text-danger">
              Without OffMarket
            </span>
          </motion.div>

          <ul className="space-y-4">
            {withoutItems.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                variants={itemVariants}
              >
                <span className="mt-1.5 inline-block w-2 h-2 shrink-0 rounded-full bg-danger" />
                <span className="font-sans text-sm text-charcoal/70 leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* With OffMarket */}
        <motion.div
          className="rounded-xl border-2 border-orange p-8 bg-orange/[0.02]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div
            className="flex items-center gap-2 mb-6"
            variants={itemVariants}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-orange" />
            <span className="font-sans text-sm font-semibold uppercase tracking-wide text-orange">
              With OffMarket
            </span>
          </motion.div>

          <ul className="space-y-4">
            {withItems.map((item, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                variants={itemVariants}
              >
                <span className="mt-1.5 inline-block w-2 h-2 shrink-0 rounded-full bg-orange" />
                <span className="font-sans text-sm font-semibold text-charcoal leading-relaxed">
                  {item}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      <motion.p
        className="font-mono text-sm text-orange text-center mt-8"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        OffMarket agents save 6+ hours per week on prospecting.
      </motion.p>
    </section>
  );
}

export default BeforeAfter;
