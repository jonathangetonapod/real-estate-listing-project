import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './DashboardMockup.module.css';

const metrics = [
  { label: 'Leads Delivered', value: '327', color: 'orange', change: '+43 this week', changeType: 'up' },
  { label: 'Pitches Sent', value: '214', color: 'default', change: '65% of leads', changeType: 'neutral' },
  { label: 'Replies', value: '18', color: 'green', change: '8.4% reply rate', changeType: 'up' },
  { label: 'Appointments', value: '6', color: 'orange', change: '33% conversion', changeType: 'up' },
];

const allLeads = [
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
    type: 'Expired',
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
    type: 'FSBO',
  },
  {
    name: 'David Hernandez',
    address: '892 Sunset Blvd, Palm Canyon',
    match: 91,
    badge: 'Pre-Foreclosure',
    badgeVariant: 'Red',
    price: '$520K',
    equity: '$310K equity',
    daysInfo: 'NOD filed 34d ago',
    avatar: 'DH',
    type: 'Pre-Foreclosure',
  },
  {
    name: 'Linda Chen',
    address: '2710 Harbor View Dr, Eastlake',
    match: 82,
    badge: 'Expired 21d',
    badgeVariant: 'Red',
    price: '$415K',
    equity: '$195K equity',
    daysInfo: 'Expired 21d ago',
    avatar: 'LC',
    type: 'Expired',
  },
  {
    name: 'Robert Williams',
    address: '558 Palm Ave, Northpark',
    match: 78,
    badge: 'FSBO',
    badgeVariant: 'Orange',
    price: '$349K',
    equity: '$120K equity',
    daysInfo: 'Listed 45d ago',
    avatar: 'RW',
    type: 'FSBO',
  },
];

const tabFilters = ['All', 'Expired', 'FSBO', 'Pre-Foreclosure'];

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
  const [activeTab, setActiveTab] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');

  const filteredLeads = activeTab === 'All'
    ? allLeads
    : allLeads.filter(l => l.type === activeTab);

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
                {[
                  { icon: '📊', label: 'Dashboard' },
                  { icon: '👥', label: 'My Leads' },
                  { icon: '✉️', label: 'Pitches' },
                  { icon: '📋', label: 'Pipeline' },
                  { icon: '⚙️', label: 'Settings' },
                ].map(item => (
                  <div
                    key={item.label}
                    className={`${styles.sidebarItem} ${activeSidebarItem === item.label ? styles.sidebarItemActive : ''}`}
                    onClick={() => setActiveSidebarItem(item.label)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </div>
                ))}
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
                    {tabFilters.map(tab => (
                      <span
                        key={tab}
                        className={activeTab === tab ? styles.tableTabActive : styles.tableTab}
                        onClick={() => setActiveTab(tab)}
                        style={{ cursor: 'pointer' }}
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.tableHead}>
                  <span className={styles.colContact}>Contact</span>
                  <span className={styles.colProperty}>Property</span>
                  <span className={styles.colMatch}>Match</span>
                  <span className={styles.colStatus}>Status</span>
                </div>
                {filteredLeads.map((lead) => (
                  <div
                    key={lead.name}
                    className={`${styles.leadRow} ${selectedLead === lead.name ? styles.leadRowSelected : ''}`}
                    onClick={() => setSelectedLead(selectedLead === lead.name ? null : lead.name)}
                    style={{ cursor: 'pointer' }}
                  >
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
