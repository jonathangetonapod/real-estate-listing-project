import { motion } from 'framer-motion';
import styles from './DashboardMockup.module.css';

const metrics = [
  { label: 'Leads Delivered', value: '327', color: 'orange' },
  { label: 'Pitches Sent', value: '214', color: 'default' },
  { label: 'Replies', value: '18', color: 'green' },
  { label: 'Appointments', value: '6', color: 'orange' },
];

const leads = [
  {
    name: 'Michael Torres',
    address: '4821 Oakwood Dr, Riverside Heights',
    match: '94% match',
    badge: 'Pitch Ready',
    badgeVariant: 'Green',
  },
  {
    name: 'Sarah Kim',
    address: '1203 Maple Ridge Ln, Canyon Crest',
    match: '87% match',
    badge: 'FSBO',
    badgeVariant: 'Orange',
  },
  {
    name: 'David & Maria Hernandez',
    address: '892 Sunset Blvd, Palm Canyon',
    match: '91% match',
    badge: 'Expired 47d',
    badgeVariant: 'Red',
  },
];

const colorClassMap = {
  orange: styles.metricValueOrange,
  green: styles.metricValueGreen,
  default: styles.metricValueDefault,
};

export function DashboardMockup() {
  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.browser}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Browser chrome */}
        <div className={styles.chrome}>
          <span className={`${styles.dot} ${styles.dotRed}`} />
          <span className={`${styles.dot} ${styles.dotYellow}`} />
          <span className={`${styles.dot} ${styles.dotGreen}`} />
        </div>

        <div className={styles.body}>
          {/* Metric cards */}
          <div className={styles.metricsRow}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <div className={`${styles.metricValue} ${colorClassMap[metric.color]}`}>
                  {metric.value}
                </div>
                <div className={styles.metricLabel}>{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Lead rows */}
          <div className={styles.leadsContainer}>
            {leads.map((lead) => (
              <div key={lead.name} className={styles.leadRow}>
                <div className={styles.leadInfo}>
                  <span className={styles.leadName}>{lead.name}</span>
                  <span className={styles.leadAddress}>{lead.address}</span>
                </div>
                <div className={styles.leadMeta}>
                  <span className={styles.matchScore}>{lead.match}</span>
                  <span className={`${styles.badge} ${styles[`badge${lead.badgeVariant}`]}`}>
                    {lead.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMockup;
