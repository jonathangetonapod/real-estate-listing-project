import { motion } from 'framer-motion';
import styles from './HowItWorks.module.css';

const steps = [
  {
    number: 1,
    title: 'We Find Your Sellers',
    description:
      'Tell us your farm area. We deliver a curated list of motivated sellers \u2014 expireds, FSBOs, pre-foreclosures, and more \u2014 within 12 hours.',
  },
  {
    number: 2,
    title: 'Verified Data, Ready to Go',
    description:
      'Every lead comes with verified email addresses, property details, equity estimates, and days on market. No stale data, no guessing.',
  },
  {
    number: 3,
    title: 'Connect Your Gmail',
    description:
      'Link your email account in one click. Replies land in your real inbox. Homeowners see you, not us.',
  },
  {
    number: 4,
    title: 'Write Emails with AI',
    description:
      "You\u2019re in control. Our AI helps you craft personal, property-specific pitches that sound like you wrote them yourself. Hit send when you\u2019re ready.",
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

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          From Farm Area to Listing Appointment
        </motion.h2>

        <motion.div
          className={styles.steps}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className={styles.step}
              variants={stepVariants}
            >
              <div className={styles.numberCircle}>{step.number}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
