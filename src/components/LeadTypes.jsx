import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const leadCards = [
  {
    color: 'bg-danger',
    colorBg: 'bg-danger/10',
    title: 'Expired Listings',
    stat: '7 in 10 choose a new agent',
    description:
      'Their last agent couldn\u2019t close. 70% of expired listings relist with a different agent. The fastest one to reach them wins.',
  },
  {
    color: 'bg-orange',
    colorBg: 'bg-orange/10',
    title: 'FSBOs',
    stat: 'Sell for 23% less without an agent',
    description:
      'FSBO homes sell for a median of $310K vs $405K agent-assisted. They tried going solo. After 60 days, they\u2019re ready for help.',
    source: 'NAR, 2023',
  },
  {
    color: 'bg-danger',
    colorBg: 'bg-danger/10',
    title: 'Pre-Foreclosure',
    stat: '357K+ filings in 2023',
    description:
      'Homeowners facing auction have a 3\u20136 month window to sell. 1 in 4 resolve before auction. They need an agent who moves fast.',
    source: 'ATTOM Data, 2024',
  },
  {
    color: 'bg-[#2196F3]',
    colorBg: 'bg-[#2196F3]/10',
    title: 'Absentee Owners',
    stat: '1 in 4 U.S. properties',
    description:
      'Over 26% of residential properties are absentee-owned. Millions of landlords and investors not being contacted by most agents.',
    source: 'ATTOM Data',
  },
  {
    color: 'bg-success',
    colorBg: 'bg-success/10',
    title: 'High Equity',
    stat: '$315K avg homeowner equity',
    description:
      'Nearly 49% of mortgaged homes are equity-rich, owing less than half their value. They don\u2019t know what they\u2019re sitting on.',
    source: 'CoreLogic, 2024',
  },
  {
    color: 'bg-[#9C27B0]',
    colorBg: 'bg-[#9C27B0]/10',
    title: 'Probate / Estate',
    stat: '1.5\u20132M properties/year',
    description:
      'Millions of properties enter probate annually. Heirs want quick, hassle-free sales, often at 10\u201320% below market value. Be the easy button.',
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

export function LeadTypes() {
  return (
    <section className="bg-white py-12 px-4 md:py-20 md:px-5">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          className="font-heading text-[28px] md:text-[34px] lg:text-[44px] font-bold text-dark text-center mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Find Sellers Before They Find Another Agent
        </motion.h2>

        <motion.p
          className="font-sans text-base md:text-lg text-[#555555] text-center max-w-[600px] mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          Every list includes verified emails, property data, and seller
          motivation signals. Sourced from 160M+ properties, refreshed daily.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {leadCards.map((card) => (
            <motion.div
              key={card.title}
              className="border border-border rounded-xl p-5 md:p-7 transition-colors duration-200 hover:border-orange"
              variants={cardVariants}
            >
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', card.colorBg)}>
                <div className={cn('w-3 h-3 rounded-full', card.color)} />
              </div>
              <h3 className="font-heading text-lg font-bold text-dark mb-2">
                {card.title}
              </h3>
              <p className="font-mono text-[13px] font-medium text-orange mb-3">
                {card.stat}
              </p>
              <p className="font-sans text-sm text-[#555555] leading-relaxed">
                {card.description}
                {card.source && (
                  <>
                    {' '}
                    <span className="text-xs text-[#999]">({card.source})</span>
                  </>
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="font-sans text-[13px] text-muted-foreground text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          All data sourced from 160M+ property records, updated daily.
          Skip-traced and verified emails included.
        </motion.p>
      </div>
    </section>
  );
}

export default LeadTypes;
