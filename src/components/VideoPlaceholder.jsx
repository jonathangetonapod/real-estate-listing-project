import { motion } from 'framer-motion';

export function VideoPlaceholder({ onClick }) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center px-4 pb-20 md:pb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
    >
      <div
        className="relative w-full max-w-2xl aspect-video bg-light-bg border border-border rounded-xl flex items-center justify-center cursor-pointer overflow-hidden"
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
        <button
          className="w-16 h-16 rounded-full bg-orange flex items-center justify-center border-none cursor-pointer shadow-[0_4px_20px_rgba(255,89,36,0.3)] transition-transform duration-200 hover:scale-105 hover:shadow-[0_6px_28px_rgba(255,89,36,0.4)]"
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* CSS triangle play icon */}
          <div
            className="w-0 h-0 ml-1"
            style={{
              borderStyle: 'solid',
              borderWidth: '12px 0 12px 22px',
              borderColor: 'transparent transparent transparent white',
            }}
          />
        </button>
      </div>
      <p className="font-sans text-[15px] font-medium text-charcoal/60 mt-6">
        Watch: How one agent booked 3 listing appointments in her first month
      </p>
    </motion.div>
  );
}

export default VideoPlaceholder;
