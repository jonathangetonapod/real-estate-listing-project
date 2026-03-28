import { motion } from 'framer-motion';
import styles from './DashboardMockup.module.css';

const metrics = [
  { label: 'Leads Delivered', value: '327', color: 'orange', change: '+43 this week', changeType: 'up' },
  { label: 'Pitches Sent', value: '214', color: 'default', change: '65% of leads', changeType: 'neutral' },
  { label: 'Replies', value: '18', color: 'green', change: '8.4% reply rate', changeType: 'up' },
  { label: 'Appointments', value: '6', color: 'orange', change: '33% conversion', changeType: 'up' },
];

const leads = [
  {
    name: 'Michael Torres',
    address: '4821 Oakwood Dr, Riverside Heights',
    match: 94,
    badge: 'Pitch Ready',
    badgeVariant: 'Green',
    price: '$485K',
    equity: '$185K equity',
    daysInfo: 'Expired 47d ago',
    avatar: 'MT',
  },
  {
    name: 'Sarah Kim',
    address: '1203 Maple Ridge Ln, Canyon Crest',
    match: 87,
    badge: 'FSBO',
    badgeVariant: 'Orange',
    price: '$392K',
    equity: '$240K equity',
    daysInfo: 'Listed 12d ago',
    avatar: 'SK',
  },
  {
    name: 'David & Maria Hernandez',
    address: '892 Sunset Blvd, Palm Canyon',
    match: 91,
    badge: 'Expired 47d',
    badgeVariant: 'Red',
    price: '$520K',
    equity: '$310K equity',
    daysInfo: 'Pre-foreclosure',
    avatar: 'DH',
  },
];

const colorClassMap = {
  orange: styles.metricValueOrange,
  green: styles.metricValueGreen,
  default: styles.metricValueDefault,
};

function MatchBar({ value }) {
  return (
    <div className={styles.matchBar}>
      <div className={styles.matchBarFill} style={{ width: `${value}%` }} />
    </div>
  );
}

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
          <div className={styles.chromeLeft}>
            <span className={`${styles.dot} ${styles.dotRed}`} />
            <span className={`${styles.dot} ${styles.dotYellow}`} />
            <span className={`${styles.dot} ${styles.dotGreen}`} />
          </div>
          <div className={styles.urlBar}>
            <span className={styles.urlLock}>🔒</span>
            <span className={styles.urlText}>app.listingpitch.com/dashboard</span>
          </div>
          <div className={styles.chromeRight} />
        </div>

        <div className={styles.body}>
          {/* Sidebar + Main */}
          <div className={styles.layout}>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <div className={styles.sidebarLogo}>
                <span className={styles.logoMark}>LP</span>
                <span className={styles.logoText}>ListingPitch</span>
              </div>
              <div className={styles.sidebarNav}>
                <div className={`${styles.sidebarItem} ${styles.sidebarItemActive}`}>
                  <span>📊</span> Dashboard
                </div>
                <div className={styles.sidebarItem}>
                  <span>👥</span> My Leads
                </div>
                <div className={styles.sidebarItem}>
                  <span>✉️</span> Pitches
                </div>
                <div className={styles.sidebarItem}>
                  <span>📋</span> Pipeline
                </div>
                <div className={styles.sidebarItem}>
                  <span>⚙️</span> Settings
                </div>
              </div>
              <div className={styles.sidebarUser}>
                <div className={styles.userAvatar}>SJ</div>
                <div className={styles.userName}>Sarah Johnson</div>
              </div>
            </div>

            {/* Main content */}
            <div className={styles.main}>
              {/* Header */}
              <div className={styles.mainHeader}>
                <div>
                  <div className={styles.mainTitle}>Good morning, Sarah 👋</div>
                  <div className={styles.mainSubtitle}>Your Riverside Heights farm is performing well</div>
                </div>
                <div className={styles.headerActions}>
                  <button className={styles.btnSecondary}>Export</button>
                  <button className={styles.btnPrimary}>+ Request Leads</button>
                </div>
              </div>

              {/* Metric cards */}
              <div className={styles.metricsRow}>
                {metrics.map((metric) => (
                  <div key={metric.label} className={styles.metricCard}>
                    <div className={styles.metricTop}>
                      <div className={styles.metricLabel}>{metric.label}</div>
                      <div className={`${styles.metricChange} ${styles[`change${metric.changeType}`]}`}>
                        {metric.changeType === 'up' && '↑ '}{metric.change}
                      </div>
                    </div>
                    <div className={`${styles.metricValue} ${colorClassMap[metric.color]}`}>
                      {metric.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead table */}
              <div className={styles.tableContainer}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableTitle}>Recent Leads</div>
                  <div className={styles.tableTabs}>
                    <span className={styles.tableTabActive}>All</span>
                    <span className={styles.tableTab}>Expired</span>
                    <span className={styles.tableTab}>FSBO</span>
                    <span className={styles.tableTab}>Pre-Foreclosure</span>
                  </div>
                </div>
                <div className={styles.tableHead}>
                  <span className={styles.colContact}>Contact</span>
                  <span className={styles.colProperty}>Property</span>
                  <span className={styles.colMatch}>Match</span>
                  <span className={styles.colStatus}>Status</span>
                </div>
                {leads.map((lead) => (
                  <div key={lead.name} className={styles.leadRow}>
                    <div className={styles.colContact}>
                      <div className={`${styles.avatar} ${styles[`avatar${lead.badgeVariant}`]}`}>
                        {lead.avatar}
                      </div>
                      <div className={styles.leadInfo}>
                        <span className={styles.leadName}>{lead.name}</span>
                        <span className={styles.leadAddress}>{lead.address}</span>
                      </div>
                    </div>
                    <div className={styles.colProperty}>
                      <span className={styles.propertyPrice}>{lead.price}</span>
                      <span className={styles.propertyDetail}>{lead.equity}</span>
                      <span className={styles.propertyDetail}>{lead.daysInfo}</span>
                    </div>
                    <div className={styles.colMatch}>
                      <span className={styles.matchScore}>{lead.match}%</span>
                      <MatchBar value={lead.match} />
                    </div>
                    <div className={styles.colStatus}>
                      <span className={`${styles.badge} ${styles[`badge${lead.badgeVariant}`]}`}>
                        {lead.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DashboardMockup;
