import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoPlaceholder() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 100);
  };

  return (
    <motion.div
      className="flex flex-col items-center px-4 pb-20 md:pb-20"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
    >
      <div className="relative w-full max-w-3xl aspect-video bg-charcoal border border-border rounded-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
        <AnimatePresence>
          {!playing && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
              onClick={handlePlay}
              role="button"
              tabIndex={0}
              aria-label="Play demo video"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePlay();
                }
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Poster frame overlay */}
              <div className="absolute inset-0 bg-charcoal flex flex-col items-center justify-center">
                <div className="font-heading text-2xl md:text-3xl font-bold text-white/80 text-center mb-2 px-8">
                  See OffMarket in Action
                </div>
                <div className="font-sans text-sm text-white/30 mb-8">
                  53 seconds
                </div>
              </div>

              {/* Play button */}
              <button
                className="relative z-20 w-20 h-20 rounded-full bg-orange flex items-center justify-center border-none cursor-pointer shadow-[0_4px_24px_rgba(255,89,36,0.4)] transition-transform duration-200 hover:scale-110"
                aria-hidden="true"
                tabIndex={-1}
              >
                <div
                  className="w-0 h-0 ml-1.5"
                  style={{
                    borderStyle: 'solid',
                    borderWidth: '14px 0 14px 26px',
                    borderColor: 'transparent transparent transparent white',
                  }}
                />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/listsignal-explainer.mp4"
          controls={playing}
          playsInline
          onEnded={() => setPlaying(false)}
        />
      </div>

      <p className="font-sans text-[15px] font-medium text-charcoal/60 mt-6">
        How OffMarket finds motivated sellers and drafts your outreach
      </p>
    </motion.div>
  );
}

export default VideoPlaceholder;
