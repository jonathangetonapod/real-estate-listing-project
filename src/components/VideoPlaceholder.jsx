import { motion } from 'framer-motion';
import styles from './VideoPlaceholder.module.css';

export function VideoPlaceholder({ onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
    >
      <div
        className={styles.videoContainer}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Play demo video"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <button className={styles.playButton} aria-hidden="true" tabIndex={-1}>
          <div className={styles.playTriangle} />
        </button>
      </div>
      <p className={styles.label}>See how it works in 90 seconds</p>
    </motion.div>
  );
}

export default VideoPlaceholder;
