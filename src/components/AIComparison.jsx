import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AIComparison.module.css';

const examples = [
  {
    type: 'Expired Listing',
    property: '4821 Oakwood Dr, Riverside Heights',
    daysExpired: 47,
    generic: {
      subject: 'Your Home at 4821 Oakwood Dr',
      body: 'Hi [First Name], I noticed your home at [Address] is no longer on the market. I\'d love to discuss how I can help you sell your home. Please call me at your convenience. Best regards, [Agent Name]',
    },
    ai: {
      subject: 'That corner lot on Oakwood — buyers are circling',
      body: 'Hey Michael, I drove past your place on Oakwood last week and honestly, your corner lot with the updated kitchen is exactly what buyers in Riverside Heights are fighting over right now. The Hendersons two streets over just closed at $485K, which is $30K over their original list. I know the last experience didn\'t pan out, but I think with the right pricing strategy and staging, we could move fast. Worth a 10-minute chat?',
      highlights: ['corner lot with the updated kitchen', '$485K', '$30K over their original list', 'right pricing strategy and staging'],
    },
  },
  {
    type: 'FSBO',
    property: '1203 Maple Ridge Ln, Canyon Crest',
    daysListed: 68,
    generic: {
      subject: 'Interested in Helping You Sell',
      body: 'Hello, I saw that your property at [Address] is for sale by owner. I specialize in your area and would love the opportunity to help you get the best price. Let me know if you\'d like to schedule a call.',
    },
    ai: {
      subject: 'Maple Ridge is hot right now — here\'s what I\'m seeing',
      body: 'Hi Sarah, I noticed you\'ve had your place on Maple Ridge listed for about 2 months now. Totally get wanting to save on commission, but here\'s what I\'m seeing in Canyon Crest right now: the 3 beds that closed this month all had professional staging and went under contract in 9 days. Your layout with the open kitchen and that backyard? That\'s exactly what young families are paying a premium for. I think we could net you more even after my fee. Want me to run the numbers for you? No pressure.',
      highlights: ['listed for about 2 months', '3 beds that closed this month', 'under contract in 9 days', 'open kitchen and that backyard', 'net you more even after my fee'],
    },
  },
  {
    type: 'Pre-Foreclosure',
    property: '892 Sunset Blvd, Palm Canyon',
    generic: {
      subject: 'Can I Help With Your Property?',
      body: 'Dear Homeowner, I understand you may be going through a difficult time. I am a real estate professional who helps homeowners explore their options. Please don\'t hesitate to reach out if you\'d like to discuss your situation.',
    },
    ai: {
      subject: 'A few options for 892 Sunset — no strings attached',
      body: 'David, I\'m reaching out because I work with a lot of homeowners in Palm Canyon, and I wanted to make sure you know your options. Your place on Sunset has solid equity right now. Homes on your block are trading between $520-560K, and with your lot size, you\'re on the higher end. Whether you want to sell quickly, explore a short sale, or just understand your timeline, I can walk you through it in 15 minutes. No sales pitch. Just info so you can make the best decision for your family.',
      highlights: ['solid equity right now', '$520-560K', 'your lot size', 'sell quickly, explore a short sale', 'No sales pitch. Just info'],
    },
  },
  {
    type: 'Absentee Owner',
    property: '3347 Elm Street, Northpark',
    generic: {
      subject: 'Considering Selling Your Investment Property?',
      body: 'Hi [Name], Are you considering selling your investment property at [Address]? The market is favorable right now and I can provide a free market analysis. Please contact me at your earliest convenience.',
    },
    ai: {
      subject: 'Your Elm Street rental — the numbers might surprise you',
      body: 'Hi Jennifer, I noticed you own the duplex at 3347 Elm in Northpark. I work with a few investors in the area and wanted to flag something: Northpark duplexes are selling at a 12% premium over last year. Your unit is in the sweet spot — the 2/1 + 2/1 layout is exactly what out-of-state investors are competing for. One just closed at $620K on Pine Street, fully tenant-occupied. If you\'ve been thinking about cashing out or doing a 1031, this might be your window. Want me to send over a quick valuation?',
      highlights: ['duplex at 3347 Elm', '12% premium over last year', '2/1 + 2/1 layout', '$620K on Pine Street', 'cashing out or doing a 1031'],
    },
  },
];

function highlightText(text, highlights) {
  if (!highlights || highlights.length === 0) return text;
  let result = text;
  const parts = [];
  let lastIndex = 0;

  const sortedHighlights = [...highlights].sort((a, b) => {
    const indexA = result.indexOf(a);
    const indexB = result.indexOf(b);
    return indexA - indexB;
  });

  for (const highlight of sortedHighlights) {
    const index = result.indexOf(highlight, lastIndex);
    if (index === -1) continue;
    if (index > lastIndex) {
      parts.push({ text: result.slice(lastIndex, index), highlighted: false });
    }
    parts.push({ text: highlight, highlighted: true });
    lastIndex = index + highlight.length;
  }
  if (lastIndex < result.length) {
    parts.push({ text: result.slice(lastIndex), highlighted: false });
  }

  return parts.map((part, i) =>
    part.highlighted ? (
      <mark key={i} className={styles.highlight}>{part.text}</mark>
    ) : (
      <span key={i}>{part.text}</span>
    )
  );
}

export function AIComparison() {
  const [activeIndex, setActiveIndex] = useState(0);
  const example = examples[activeIndex];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-80px' }}
        >
          Not Another Template Tool.<br />
          <span className={styles.headingAccent}>This Actually Sounds Like You.</span>
        </motion.h2>

        {/* Carousel tabs */}
        <motion.div
          className={styles.tabs}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {examples.map((ex, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {ex.type}
            </button>
          ))}
        </motion.div>

        {/* Property context bar */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`context-${activeIndex}`}
            className={styles.contextBar}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <span className={styles.contextIcon}>📍</span>
            <span className={styles.contextAddress}>{example.property}</span>
            {example.daysExpired && (
              <span className={styles.contextBadge} data-type="expired">
                Expired {example.daysExpired}d ago
              </span>
            )}
            {example.daysListed && (
              <span className={styles.contextBadge} data-type="fsbo">
                Listed {example.daysListed}d (FSBO)
              </span>
            )}
            <span className={styles.contextBadge} data-type="type">
              {example.type}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Email comparison cards */}
        <div className={styles.cards}>
          <AnimatePresence mode="wait">
            {/* Generic */}
            <motion.div
              key={`generic-${activeIndex}`}
              className={styles.card}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.iconX}>✕</span>
                <span className={styles.cardLabel}>Generic template</span>
                <span className={styles.cardBadgeBad}>Low response rate</span>
              </div>
              <div className={styles.emailMockup}>
                <div className={styles.emailSubject}>
                  <span className={styles.emailSubjectLabel}>Subject:</span>
                  {example.generic.subject}
                </div>
                <div className={styles.emailDivider} />
                <p className={styles.emailBody}>
                  &ldquo;{example.generic.body}&rdquo;
                </p>
              </div>
              <div className={styles.cardFooterBad}>
                <span>⚠️ No personalization</span>
                <span>⚠️ No property data</span>
                <span>⚠️ Feels like spam</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* AI */}
            <motion.div
              key={`ai-${activeIndex}`}
              className={`${styles.card} ${styles.cardAI}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.iconCheck}>✓</span>
                <span className={styles.cardLabel}>ListingPitch AI</span>
                <span className={styles.cardBadgeGood}>3-5x higher reply rate</span>
              </div>
              <div className={styles.emailMockup}>
                <div className={styles.emailSubject}>
                  <span className={styles.emailSubjectLabel}>Subject:</span>
                  {example.ai.subject}
                </div>
                <div className={styles.emailDivider} />
                <p className={styles.emailBody}>
                  &ldquo;{highlightText(example.ai.body, example.ai.highlights)}&rdquo;
                </p>
              </div>
              <div className={styles.cardFooterGood}>
                <span>✓ References real property details</span>
                <span>✓ Uses actual comps & data</span>
                <span>✓ Matches your voice & tone</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel dots */}
        <div className={styles.dots}>
          {examples.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Example ${i + 1}`}
            />
          ))}
        </div>

        <motion.p
          className={styles.callout}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Every pitch references real property data, real comps, and real neighborhood context.
          No placeholders. No templates. Just emails that sound like you sat down and wrote them yourself.
        </motion.p>
      </div>
    </section>
  );
}

export default AIComparison;
