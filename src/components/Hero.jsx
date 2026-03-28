import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

export function Hero() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: 'easeOut' },
    }),
  };

  return (
    <section className={styles.hero}>
      <motion.div
        className={styles.badge}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        Now onboarding agents in select markets
      </motion.div>

      <motion.h1
        className={styles.headline}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        Your Next{' '}
        <span className={styles.headlineItalicOrange}>Listing</span>{' '}
        Is Already Waiting.
      </motion.h1>

      <motion.p
        className={styles.subheadline}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        We find motivated sellers in your farm area and deliver verified
        contact data within 12 hours. You connect your Gmail, write
        personalized pitches with AI, and close more listings.
      </motion.p>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.3}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {!submitted ? (
          <form className={styles.emailForm} onSubmit={handleSubmit}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                className={styles.emailInput}
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.submitBtn}>
              Get Early Access &rarr;
            </button>
          </form>
        ) : (
          <motion.div
            className={styles.successMessage}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className={styles.successIcon}>&#10003;</span>
            <span className={styles.successText}>
              You&apos;re in! We&apos;ll reach out within 12 hours to set up your farm area.
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.p
        className={styles.trustLine}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.4}
      >
        We&apos;ll reach out within 12 hours to set up your farm area. No credit card required.
      </motion.p>
    </section>
  );
}

export default Hero;
