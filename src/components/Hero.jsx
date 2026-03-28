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
        Limited to 5 agents per zip code — check availability
      </motion.div>

      <motion.h1
        className={styles.headline}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.1}
      >
        Stop Competing for Leads.{' '}
        <span className={styles.headlineItalicOrange}>Own</span>{' '}
        Your Market.
      </motion.h1>

      <motion.p
        className={styles.subheadline}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0.2}
      >
        We deliver motivated seller leads in your farm area within 12 hours,
        with verified emails, property data, and AI-written pitches ready to send.
        More listing appointments without cold calling, door knocking, or paying for shared leads.
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
        See your leads before you pay. No credit card. Cancel in one click.
      </motion.p>
    </section>
  );
}

export default Hero;
