import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FAQ.module.css';

const faqData = [
  {
    q: 'Will this hurt my email reputation?',
    a: 'We never send from your primary email. We set up a protected secondary domain for your brand, handle warm-up, and route replies to your real inbox. Your main email stays untouched.',
  },
  {
    q: 'How is this different from buying Zillow leads?',
    a: 'Zillow leads are shared with up to 50 agents. ListingPitch emails go directly from you to the homeowner. No competition, no bidding, no sharing.',
  },
  {
    q: 'Do I need PropStream?',
    a: 'No. We handle all data sourcing. Your subscription includes full access to motivated seller data in your farm area.',
  },
  {
    q: "Can homeowners tell it's AI-written?",
    a: 'Our AI studies your writing style and references property-specific details. The address, days on market, nearby comps, and neighborhood context. Every email reads like you spent 5 minutes writing it personally.',
  },
  {
    q: 'Is cold emailing homeowners legal?',
    a: 'Yes, when done properly under CAN-SPAM. Every email includes your real identity, physical address, and one-click unsubscribe. We handle compliance automatically.',
  },
  {
    q: 'How many listings can I expect?',
    a: 'Results vary by market, but our target benchmark is 3-5 listing conversations per month from 500 emails. At average commission rates, that\u2019s $15,000-40,000 in potential GCI from a $199-299 investment.',
  },
  {
    q: 'How long until I see results?',
    a: 'Your secondary domain needs 14-21 days of warm-up before we scale to full volume. Most agents see their first replies within 3-4 weeks of signing up.',
  },
  {
    q: 'Can I customize which lead types I target?',
    a: 'Yes. You choose which lead types to include, set filters for price range, equity level, days expired, and more. You control who gets pitched.',
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.item}>
      <button
        className={styles.question}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className={styles.questionText}>{question}</span>
        <span className={isOpen ? styles.iconOpen : styles.icon}>+</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className={styles.answerWrapper}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <p className={styles.answer}>{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className={styles.section}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        Frequently Asked Questions
      </motion.h2>

      <div className={styles.list}>
        {faqData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
          >
            <FAQItem question={item.q} answer={item.a} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FAQ;
