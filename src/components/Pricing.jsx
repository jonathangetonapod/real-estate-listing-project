import { motion } from 'framer-motion';
import styles from './Pricing.module.css';

const starterFeatures = [
  '1 farm area (up to 3 zip codes)',
  '500 emails/month',
  'AI voice matching',
  'All lead types included',
  'Email warm-up & deliverability',
  'Reply tracking & notifications',
];

const growthFeatures = [
  'Unlimited farm areas',
  '1,500 emails/month',
  'AI voice matching + follow-ups',
  'All lead types included',
  'Full pipeline tracker (Kanban)',
  'Priority support',
];

const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

export function Pricing() {
  return (
    <section id="pricing" className={styles.section}>
      <motion.h2
        className={styles.heading}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        One Listing Pays for 2+ Years of ListingPitch
      </motion.h2>

      <motion.div
        className={styles.anchor}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <div className={styles.anchorBad}>
          <span className={styles.anchorLabel}>Zillow</span>
          <span className={styles.anchorPrice}>$1,200+/mo</span>
          <span className={styles.anchorNote}>Shared with 47 agents</span>
        </div>
        <div className={styles.anchorDivider}>vs</div>
        <div className={styles.anchorGood}>
          <span className={styles.anchorLabel}>ListingPitch</span>
          <span className={styles.anchorPrice}>$199/mo</span>
          <span className={styles.anchorNote}>Exclusive to your zip code</span>
        </div>
      </motion.div>

      <motion.div
        className={styles.grid}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Starter Card */}
        <div className={styles.card}>
          <span className={styles.planName}>Starter</span>
          <div className={styles.priceRow}>
            <span className={styles.price}>$199</span>
            <span className={styles.pricePeriod}>/month</span>
          </div>
          <ul className={styles.features}>
            {starterFeatures.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                <span className={styles.checkmark}>&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className={styles.ctaButton}>Get Early Access</button>
        </div>

        {/* Growth Card (Featured) */}
        <div className={styles.cardFeatured}>
          <span className={styles.planNameFeatured}>Growth</span>
          <div className={styles.priceRow}>
            <span className={styles.price}>$299</span>
            <span className={styles.pricePeriod}>/month</span>
          </div>
          <ul className={styles.features}>
            {growthFeatures.map((feature) => (
              <li key={feature} className={styles.featureItem}>
                <span className={styles.checkmark}>&#10003;</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <button className={styles.ctaButton}>Get Early Access</button>
        </div>
      </motion.div>

      <motion.p
        className={styles.disclaimer}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        14-day free trial. No contracts. Cancel in one click. If you don&apos;t book a conversation, we&apos;ll refund every penny.
      </motion.p>

      <motion.p
        className={styles.comparison}
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        The average agent spends $1,200/month on Zillow leads that 47 other
        agents also get. ListingPitch gives you exclusive, direct access to
        motivated sellers for a fraction of the cost.
      </motion.p>
    </section>
  );
}

export default Pricing;
