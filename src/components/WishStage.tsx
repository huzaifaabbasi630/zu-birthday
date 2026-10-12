import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Wind } from 'lucide-react';
import { config } from '../config';
import { Cake } from './Cake';
import { Stars } from './Stars';
import { useBlowDetection } from '../hooks/useBlowDetection';

interface WishStageProps {
  onWishComplete: () => void;
}

export const WishStage: React.FC<WishStageProps> = ({ onWishComplete }) => {
  const [candlesLit, setCandlesLit] = useState<boolean>(true);
  const [darkFlash, setDarkFlash] = useState<boolean>(false);

  const triggerExtinguish = useCallback(() => {
    if (!candlesLit) return;
    setCandlesLit(false);

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(30);
      }
    } catch {
      // Ignore
    }

    // Momentary dark flash after smoke rises, then transition to Finale
    const flashTimer = window.setTimeout(() => {
      setDarkFlash(true);
    }, 650);

    const completeTimer = window.setTimeout(() => {
      onWishComplete();
    }, 1350);

    return () => {
      window.clearTimeout(flashTimer);
      window.clearTimeout(completeTimer);
    };
  }, [candlesLit, onWishComplete]);

  const {
    permissionState,
    audioLevel,
    blowProgress,
    startListening,
    stopListening,
  } = useBlowDetection({
    onBlowDetected: () => {
      triggerExtinguish();
    },
    sustainedMs: 400,
    threshold: 38,
  });

  const handleManualBlow = () => {
    stopListening();
    triggerExtinguish();
  };

  return (
    <section
      className="relative w-full h-[100dvh] overflow-hidden bg-[#09070E] text-amber-50 flex flex-col items-center justify-center px-4 py-6 select-none"
      aria-label="Make a Birthday Wish"
    >
      {/* Twinkling Starfield */}
      <Stars count={40} />

      {/* Brief Dark Flash Overlay when candles go out */}
      <AnimatePresence>
        {darkFlash && (
          <motion.div
            key="dark-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-40 bg-black pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Glowing Top Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-handwriting text-4xl sm:text-6xl font-bold text-amber-100 mb-4 sm:mb-6"
          style={{
            textShadow: '0 0 24px rgba(251, 191, 36, 0.65), 0 0 48px rgba(245, 158, 11, 0.35)',
          }}
        >
          ✨ {config.wishText} ✨
        </motion.h1>

        {/* Kawaii Birthday Cake */}
        <Cake
          candlesLit={candlesLit}
          variant="wish"
          audioLevel={audioLevel}
          onCakeClick={handleManualBlow}
        />

        {/* Instruction Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm sm:text-base text-amber-100/85 mt-3 sm:mt-5 max-w-xs leading-relaxed"
        >
          {candlesLit
            ? 'Close your eyes, make a wish, then blow the candles 🌬️'
            : 'Your wish is on its way to the stars... ✨'}
        </motion.p>

        {/* Interactive Blow Controls */}
        {candlesLit && (
          <div className="mt-6 sm:mt-8 w-full flex flex-col items-center gap-3">
            {permissionState === 'idle' && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => void startListening()}
                  className="min-h-[48px] px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.45)] flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap shrink-0"
                >
                  <Mic className="w-4 h-4" />
                  <span>Tap to blow 🎤</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleManualBlow}
                  className="min-h-[48px] px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-amber-100 text-xs sm:text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
                >
                  <Wind className="w-4 h-4" />
                  <span>Blow the candles</span>
                </motion.button>
              </div>
            )}

            {permissionState === 'listening' && (
              <div className="w-full max-w-xs flex flex-col items-center gap-3">
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-amber-300/30">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400"
                    animate={{ width: `${Math.max(blowProgress, audioLevel * 0.5)}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-amber-200/90 animate-pulse">
                  Listening... Blow gently into your microphone 🌬️
                </p>
                <button
                  type="button"
                  onClick={handleManualBlow}
                  className="min-h-[44px] px-4 py-2 text-xs text-white/75 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Or tap here to blow out the candles
                </button>
              </div>
            )}

            {(permissionState === 'denied' || permissionState === 'unsupported') && (
              <div className="flex flex-col items-center gap-2.5">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleManualBlow}
                  className="min-h-[50px] px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-stone-950 font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.4)] flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 whitespace-nowrap shrink-0"
                >
                  <Wind className="w-4 h-4" />
                  <span>Blow the candles 🌬️</span>
                </motion.button>
                <span className="text-[11px] text-white/60">
                  (You can also tap directly on the candles)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
