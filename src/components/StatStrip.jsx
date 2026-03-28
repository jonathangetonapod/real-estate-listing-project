import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './StatStrip.module.css';

function useCountUp(target, duration = 2000, shouldStart = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!shouldStart) {
      setValue(0);
      return;
    }

    const startTime = performance.now();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOut(progress);

      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [target, duration, shouldStart]);

  return value;
}

const stats = [
  { target: 12847, display: (v) => v.toLocaleString(), label: 'Listing pitches sent' },
  { target: 500, display: (v) => `${v}+`, label: 'Agents onboarded' },
  { target: 94, display: (v) => `${v}%`, label: 'Avg deliverability' },
  { target: 12, display: (v) => `${v}hrs`, label: 'List turnaround' },
];

function StatItem({ target, display, label, shouldAnimate }) {
  const count = useCountUp(target, 2000, shouldAnimate);

  return (
    <div className={styles.stat}>
      <div className={styles.value}>{display(count)}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

export function StatStrip() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={ref}
      className={styles.strip}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.inner}>
        {stats.map((stat) => (
          <StatItem
            key={stat.label}
            target={stat.target}
            display={stat.display}
            label={stat.label}
            shouldAnimate={isInView}
          />
        ))}
      </div>
    </motion.section>
  );
}

export default StatStrip;
