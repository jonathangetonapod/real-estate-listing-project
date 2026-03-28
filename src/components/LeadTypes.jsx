import { motion } from 'framer-motion';
import styles from './LeadTypes.module.css';

const leadCards = [
  {
    icon: '\uD83D\uDD34',
    iconBg: '#FFE8E8',
    title: 'Expired Listings',
    stat: '7 in 10 choose a new agent',
    description:
      'Their last agent couldn\u2019t close. 70% of expired listings relist with a different agent. The fastest one to reach them wins.',
  },
  {
    icon: '\uD83C\uDFE0',
    iconBg: '#FFF3E0',
    title: 'FSBOs',
    stat: 'Sell for 23% less without an agent',
    description:
      'FSBO homes sell for a median of $310K vs $405K agent-assisted. They tried going solo. After 60 days, they\u2019re ready for help.',
    source: 'NAR, 2023',
  },
  {
    icon: '\u26A0\uFE0F',
    iconBg: '#FFEAEA',
    title: 'Pre-Foreclosure',
    stat: '357K+ filings in 2023',
    description:
      'Homeowners facing auction have a 3\u20136 month window to sell. 1 in 4 resolve before auction. They need an agent who moves fast.',
    source: 'ATTOM Data, 2024',
  },
  {
    icon: '\uD83D\uDCCD',
    iconBg: '#E8F4FD',
    title: 'Absentee Owners',
    stat: '1 in 4 U.S. properties',
    description:
      'Over 26% of residential properties are absentee-owned. Millions of landlords and investors not being contacted by most agents.',
    source: 'ATTOM Data',
  },
  {
    icon: '\uD83D\uDCB0',
    iconBg: '#E6F9E9',
    title: 'High Equity',
    stat: '$315K avg homeowner equity',
    description:
      'Nearly 49% of mortgaged homes are equity-rich, owing less than half their value. They don\u2019t know what they\u2019re sitting on.',
    source: 'CoreLogic, 2024',
  },
  {
    icon: '\uD83D\uDCCB',
    iconBg: '#F3E8FF',
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
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          Find Sellers Before They Find Another Agent
        </motion.h2>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          Every list includes verified emails, property data, and seller
          motivation signals. Sourced from 155M+ properties, refreshed daily.
        </motion.p>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {leadCards.map((card) => (
            <motion.div
              key={card.title}
              className={styles.card}
              variants={cardVariants}
            >
              <div
                className={styles.iconContainer}
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.statLine}>{card.stat}</p>
              <p className={styles.cardDescription}>
                {card.description}
                {card.source && (
                  <>
                    {' '}
                    <span className={styles.source}>({card.source})</span>
                  </>
                )}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className={styles.sourceLine}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          All data sourced from PropStream&apos;s database of 155M+ properties.
          Skip-traced and verified emails included.
        </motion.p>
      </div>
    </section>
  );
}

export default LeadTypes;
