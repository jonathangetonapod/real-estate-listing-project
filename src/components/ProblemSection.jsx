import { motion } from 'framer-motion';
import styles from './ProblemSection.module.css';

const cards = [
  {
    icon: '\uD83D\uDCB8',
    title: 'Zillow leads cost $1,200+/mo. You share them with 47 agents.',
    body: "You\u2019re paying for a phone number that 47 other agents also bought. By the time you call, the homeowner is annoyed and you\u2019re competing on speed, not value.",
  },
  {
    icon: '\u23F0',
    title: 'Cold calling works. It just eats your whole morning.',
    body: "You can dial 100 numbers for 3 conversations, or email 500 verified sellers this week. Same hustle, 25x the reach. ListingPitch warms up your pipeline so every call is to someone who already knows your name.",
  },
  {
    icon: '\uD83D\uDDD1\uFE0F',
    title: 'Generic templates get deleted.',
    body: "Homeowners can smell a mass email from a mile away. If it doesn\u2019t feel personal, it\u2019s spam. If it references their actual property data and nearby comps, it\u2019s a conversation.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function ProblemSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          You Know Who Wants to Sell. You Just Can&rsquo;t Reach Them All.
        </motion.h2>

        <motion.div
          className={styles.cards}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              className={styles.card}
              variants={cardVariants}
            >
              <span className={styles.icon}>{card.icon}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ProblemSection;
