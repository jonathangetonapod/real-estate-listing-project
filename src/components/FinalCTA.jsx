import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './FinalCTA.module.css';

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
    <section className={styles.section}>
      <motion.h2
        className={styles.heading}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        Every Day You Wait, Another Agent Gets the{' '}
        <span className={styles.headingAccent}>Appointment</span>.
      </motion.h2>

      <motion.p
        className={styles.subtitle}
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
          <div className={styles.formWrapper}>
            <form className={styles.emailForm} onSubmit={handleSubmit}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Send Me My Seller List &rarr;
              </button>
            </form>
          </div>
        ) : (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.successIcon}>&#10003;</span>
            <span className={styles.successText}>
              You&apos;re in! We&apos;ll reach out within 12 hours to set up
              your farm area.
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.p
        className={styles.trustLine}
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
