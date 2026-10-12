import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { LockScreen } from './components/LockScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { RevealStage } from './components/RevealStage';
import { WishStage } from './components/WishStage';
import { FinaleStage } from './components/FinaleStage';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { MusicToggle } from './components/MusicToggle';

export type Stage = 'lock' | 'loading' | 'reveal' | 'wish' | 'finale';

const SESSION_UNLOCK_KEY = 'birthday_surprise_unlocked';

export default function App() {
  const [stage, setStage] = useState<Stage>(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true'
      ) {
        return 'reveal';
      }
    } catch {
      // Ignore sessionStorage errors
    }
    return 'lock';
  });

  const handleUnlock = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
    } catch {
      // Ignore sessionStorage errors
    }
    setStage('loading');
  }, []);

  const handleRelock = useCallback(() => {
    try {
      window.sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    } catch {
      // Ignore
    }
    setStage('lock');
  }, []);

  return (
    <main className="relative min-h-[100dvh] w-full overflow-x-hidden">
      {/* Floating Background Music Mute/Unmute (top-right) */}
      <MusicToggle />

      {/* Optional Re-lock button (top-left) when unlocked so she can replay from the start */}
      {stage !== 'lock' && stage !== 'loading' && (
        <button
          type="button"
          onClick={handleRelock}
          aria-label="Return to lock screen"
          title="Return to lock screen"
          className="fixed top-4 left-4 z-50 w-11 h-11 rounded-full bg-black/25 hover:bg-black/45 border border-white/20 backdrop-blur-md text-white/80 hover:text-white shadow-md flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Lock className="w-4 h-4" />
        </button>
      )}

      {/* Floating Theme/Color Wheel Switcher (bottom-right) */}
      <ThemeSwitcher />

      {/* 5-Stage State Machine with Smooth Transitions */}
      <AnimatePresence mode="wait">
        {stage === 'lock' && (
          <motion.div
            key="stage-lock"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <LockScreen onUnlock={handleUnlock} />
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div
            key="stage-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            <LoadingScreen onComplete={() => setStage('reveal')} />
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="stage-reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            <RevealStage onContinue={() => setStage('wish')} />
          </motion.div>
        )}

        {stage === 'wish' && (
          <motion.div
            key="stage-wish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <WishStage onWishComplete={() => setStage('finale')} />
          </motion.div>
        )}

        {stage === 'finale' && (
          <motion.div
            key="stage-finale"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
          >
            <FinaleStage onReplayWish={() => setStage('wish')} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
