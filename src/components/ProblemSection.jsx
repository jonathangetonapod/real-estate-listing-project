import { motion } from 'framer-motion';
import styles from './ProblemSection.module.css';

const cards = [
  {
    icon: '\u23F0',
    title: 'Expired listings go stale fast.',
    body: 'By the time you pull the list, write a letter, and drop it in the mail, three other agents already called. Speed wins listings.',
  },
  {
    icon: '\uD83D\uDCDE',
    title: "Cold calling is dead. Door knocking doesn\u2019t scale.",
    body: 'You can knock on 20 doors a day or email 500 motivated sellers this week. Same effort, 25x the reach.',
  },
  {
    icon: '\uD83D\uDDD1\uFE0F',
    title: 'Generic templates get deleted.',
    body: "Homeowners can smell a mass email from a mile away. If it doesn\u2019t feel personal, it\u2019s spam. If it feels personal, it\u2019s a conversation.",
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
