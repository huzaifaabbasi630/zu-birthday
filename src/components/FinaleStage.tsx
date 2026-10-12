import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, MailOpen, X, Sparkles } from 'lucide-react';
import { config } from '../config';
import { Cake } from './Cake';
import { LoveLetter } from './LoveLetter';
import { FloatingHearts } from './FloatingHearts';
import { startFinaleFireworks, triggerHeartEasterEgg } from '../utils/fireworks';

interface FinaleStageProps {
  onReplayWish: () => void;
}

export const FinaleStage: React.FC<FinaleStageProps> = ({ onReplayWish }) => {
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);
  const [cakeTapCount, setCakeTapCount] = useState<number>(0);
  const [showEasterEggToast, setShowEasterEggToast] = useState<boolean>(false);

  // Launch fireworks + gentle confetti rain on mount
  useEffect(() => {
    const stopFireworks = startFinaleFireworks();
    return () => {
      stopFireworks();
    };
  }, []);

  // Calculate live days shining if config.birthDate is provided
  const daysShining = useMemo(() => {
    if (!config.birthDate || config.birthDate.trim() === '') return null;
    const birth = new Date(config.birthDate);
    if (Number.isNaN(birth.getTime())) return null;
    const diffMs = Date.now() - birth.getTime();
    if (diffMs <= 0) return null;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }, []);

  // Easter egg: tapping the cake 5 times on the finale makes extra heart confetti pop out
  const handleCakeTap = () => {
    const nextCount = cakeTapCount + 1;
    setCakeTapCount(nextCount);
    if (nextCount >= 5) {
      triggerHeartEasterEgg();
      setCakeTapCount(0);
      setShowEasterEggToast(true);
      window.setTimeout(() => {
        setShowEasterEggToast(false);
      }, 2500);
    }
  };

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-x-hidden flex flex-col items-center justify-center px-4 py-12 sm:py-16 select-none"
      style={{
        background: 'radial-gradient(circle at 50% 35%, var(--accent) 0%, var(--bg) 65%, #2A0810 100%)',
      }}
      aria-label="Happy Birthday Finale Celebration"
    >
      <div className="absolute inset-0 bg-grain pointer-events-none" />
      <FloatingHearts count={18} />

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Mint Green Kawaii Cake with 5-Tap Easter Egg */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="relative"
        >
          <Cake
            candlesLit={false}
            variant="finale"
            onCakeClick={handleCakeTap}
          />
          <AnimatePresence>
            {showEasterEggToast && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: -8, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/95 text-rose-700 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-lg whitespace-nowrap"
              >
                Extra birthday love for {config.herName}! 💖
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Big Handwritten Birthday Greeting */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-handwriting text-5xl sm:text-7xl font-bold text-white mt-2 mb-3 leading-tight"
          style={{
            textShadow: '0 4px 28px var(--glow), 0 2px 10px rgba(0, 0, 0, 0.35)',
            textWrap: 'balance',
          }}
        >
          Happy Birthday, {config.herName}! 🎉
        </motion.h1>

        {/* Optional Live Age/Days Counter */}
        {daysShining !== null && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-amber-200/95 mb-4 tabular-nums"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>You&apos;ve been shining for {daysShining.toLocaleString()} days ✨</span>
          </motion.p>
        )}

        {/* Final Sweet Message */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-sm sm:text-lg text-rose-50/95 max-w-lg leading-relaxed px-2"
        >
          {config.finalMessage}
        </motion.p>

        {/* Handwritten Signature */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="font-handwriting text-3xl sm:text-4xl text-amber-200 mt-4 mb-8"
        >
          — {config.fromName}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onReplayWish}
            className="min-h-[48px] px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-white text-sm sm:text-base font-medium flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay 🔁</span>
          </motion.button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsLetterModalOpen(true)}
            className="min-h-[48px] px-6 py-3 rounded-full bg-white text-rose-950 hover:bg-rose-50 text-sm sm:text-base font-semibold shadow-xl flex items-center gap-2 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 whitespace-nowrap shrink-0"
          >
            <MailOpen className="w-4 h-4 text-rose-600" />
            <span>Read the letter again 💌</span>
          </motion.button>
        </motion.div>

        <p className="text-[11px] text-white/55 mt-6">
          Psst... try tapping the cake 5 times 🎂
        </p>
      </div>

      {/* Love Letter Modal */}
      <AnimatePresence>
        {isLetterModalOpen && (
          <motion.div
            key="letter-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLetterModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Love Letter Modal"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl my-8"
            >
              <button
                type="button"
                onClick={() => setIsLetterModalOpen(false)}
                aria-label="Close letter modal"
                className="absolute -top-3 -right-3 z-20 w-11 h-11 rounded-full bg-rose-900 text-white shadow-lg flex items-center justify-center hover:bg-rose-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="w-5 h-5" />
              </button>
              <LoveLetter startImmediately />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
