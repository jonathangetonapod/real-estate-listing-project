import { motion } from 'framer-motion';
import styles from './AIComparison.module.css';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function AIComparison() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          Not Another Template Tool. This Actually Sounds Like You.
        </motion.h2>

        <motion.div
          className={styles.cards}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className={styles.card}>
            <div className={styles.labelRow}>
              <span className={styles.iconX}>&times;</span>
              <span className={styles.label}>Generic template</span>
            </div>
            <p className={styles.emailBody}>
              &ldquo;Hi [First Name], I noticed your home at [Address] is no
              longer on the market. I&apos;d love to discuss how I can help you
              sell your home. Please call me at your convenience.&rdquo;
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.labelRow}>
              <span className={styles.iconCheck}>&#10003;</span>
              <span className={styles.label}>ListingPitch AI</span>
            </div>
            <p className={styles.emailBody}>
              &ldquo;Hey Michael, I drove past your place on Oakwood last week
              and honestly, your corner lot with the updated kitchen is exactly
              what buyers in Riverside Heights are fighting over right now. The
              Hendersons two streets over just closed at $485K, which is $30K
              over their original list. Worth a 10-minute chat?&rdquo;
            </p>
          </div>
        </motion.div>

        <motion.p
          className={styles.callout}
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          Every pitch references real property data, real comps, and real
          neighborhood context. No placeholders. No templates. Just emails that
          sound like you sat down and wrote them yourself.
        </motion.p>
      </div>
    </section>
  );
}

export default AIComparison;
