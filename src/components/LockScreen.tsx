import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart } from 'lucide-react';
import { config } from '../config';
import { PinDots } from './PinDots';
import { Keypad } from './Keypad';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [input, setInput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Prevent scrolling and zooming while on lock screen
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'manipulation';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // Optional subtle device orientation tilt on mobile
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const x = Math.max(-8, Math.min(8, e.gamma / 4));
        const y = Math.max(-8, Math.min(8, (e.beta - 45) / 4));
        setTilt({ x, y });
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 7;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 7;
    setTilt({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleDigitPress = useCallback(
    (digit: string) => {
      if (isError || isUnlocked || input.length >= 4) return;
      setInput((prev) => prev + digit);
    },
    [input.length, isError, isUnlocked]
  );

  const handleBackspace = useCallback(() => {
    if (isError || isUnlocked) return;
    setInput((prev) => prev.slice(0, -1));
  }, [isError, isUnlocked]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitPress, handleBackspace]);

  // Evaluate 4-digit passcode
  useEffect(() => {
    if (input.length !== 4) return;

    if (input === config.passcode) {
      setIsUnlocked(true);
      const timer = window.setTimeout(() => {
        onUnlock();
      }, 750);
      return () => window.clearTimeout(timer);
    } else {
      setIsError(true);
      setWrongAttempts((prev) => prev + 1);
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate([40, 60, 40]);
        }
      } catch {
        // Ignore
      }
      const timer = window.setTimeout(() => {
        setIsError(false);
        setInput('');
      }, 600);
      return () => window.clearTimeout(timer);
    }
  }, [input, onUnlock]);

  const coverPhoto = config.photos[0];

  return (
    <section
      className="relative w-full h-[100dvh] overflow-hidden select-none flex items-center justify-center px-4 py-3 sm:p-8"
      style={{ backgroundColor: 'var(--bg)' }}
      aria-label="Birthday Surprise Passcode Lock"
    >
      {/* Grain & Vignette */}
      <div className="absolute inset-0 bg-grain pointer-events-none" />
      <div className="absolute inset-0 vignette-overlay pointer-events-none" />

      {/* Warm ambient glow */}
      <div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: 'var(--glow)', top: '12%', left: '18%' }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col lg:grid lg:grid-cols-2 items-center justify-center gap-3 sm:gap-6 lg:gap-12">
        {/* LEFT / TOP: Tilted Polaroid Photo with Red Satin Bow */}
        <div
          className="flex items-center justify-center perspective-[1000px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -6 }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: -4,
              rotateY: tilt.x,
              rotateX: tilt.y,
            }}
            transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            className="relative bg-[#FFFDF9] p-2.5 pb-6 sm:p-4 sm:pb-9 rounded-xl polaroid-shadow w-36 sm:w-56 md:w-64 lg:w-72"
          >
            {/* Handcrafted SVG Red Bow on top-left corner */}
            <div
              className="absolute -top-3.5 -left-3.5 sm:-top-5 sm:-left-5 w-11 h-11 sm:w-14 sm:h-14 z-20 drop-shadow-md pointer-events-none"
              aria-hidden="true"
            >
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left ribbon tail */}
                <path
                  d="M28 34L16 56L24 52L29 58L33 35"
                  fill="#B91C1C"
                  stroke="#7F1D1D"
                  strokeWidth="1.5"
                />
                {/* Right ribbon tail */}
                <path
                  d="M36 34L48 55L40 51L35 57L31 35"
                  fill="#DC2626"
                  stroke="#7F1D1D"
                  strokeWidth="1.5"
                />
                {/* Left bow loop */}
                <path
                  d="M32 30C20 14 6 18 8 30C10 42 24 38 32 30Z"
                  fill="#EF4444"
                  stroke="#991B1B"
                  strokeWidth="1.5"
                />
                {/* Right bow loop */}
                <path
                  d="M32 30C44 14 58 18 56 30C54 42 40 38 32 30Z"
                  fill="#EF4444"
                  stroke="#991B1B"
                  strokeWidth="1.5"
                />
                {/* Center knot */}
                <rect
                  x="27"
                  y="24"
                  width="10"
                  height="11"
                  rx="4"
                  fill="#DC2626"
                  stroke="#7F1D1D"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Polaroid Image Frame */}
            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-rose-100">
              {!imageError ? (
                <img
                  src={coverPhoto.src}
                  alt={config.polaroidCaption}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                  style={{ background: coverPhoto.fallbackGradient }}
                >
                  <Heart className="w-8 h-8 sm:w-12 sm:h-12 text-white/90 fill-white/80 mb-1.5 drop-shadow" />
                  <span className="text-white/90 text-[11px] sm:text-xs font-medium tracking-wide">
                    {config.herName} &amp; {config.fromName}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-md pointer-events-none" />
            </div>

            {/* Handwritten Caption */}
            <p className="font-handwriting text-stone-800 text-center text-lg sm:text-2xl lg:text-3xl mt-2 sm:mt-4 leading-tight">
              {config.polaroidCaption}
            </p>
          </motion.div>
        </div>

        {/* RIGHT / BOTTOM: Passcode Lock & Keypad */}
        <div className="flex flex-col items-center justify-center">
          {/* Lock Icon */}
          <motion.div
            animate={
              isUnlocked
                ? { scale: [1, 1.25, 1.1], rotate: [0, -10, 8, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.45 }}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/12 border border-white/25 flex items-center justify-center mb-1.5 sm:mb-2 shadow-inner"
          >
            {isUnlocked ? (
              <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            ) : (
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-white/90" />
            )}
          </motion.div>

          <h1 className="text-xs sm:text-sm tracking-[0.22em] font-medium text-white/90 uppercase mb-1">
            Enter a Passcode
          </h1>

          {/* 4 Dot Indicators */}
          <PinDots
            filledCount={input.length}
            isError={isError}
            isSuccess={isUnlocked}
          />

          {/* Soft Hint after 2 wrong attempts */}
          <div className="h-5 sm:h-6 flex items-center justify-center mb-1.5 sm:mb-2">
            <AnimatePresence mode="wait">
              {isError ? (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-rose-200 font-medium"
                >
                  Hmm, try again sweetheart ✨
                </motion.p>
              ) : wrongAttempts >= 2 ? (
                <motion.p
                  key="hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-amber-200/90 italic"
                >
                  Hint: {config.passcodeHint}
                </motion.p>
              ) : (
                <motion.p
                  key="for-her"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.65 }}
                  className="text-[11px] text-white/75"
                >
                  Made exclusively for {config.herName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* 3x4 Numeric Keypad */}
          <Keypad
            onDigitPress={handleDigitPress}
            onBackspace={handleBackspace}
            disabled={isUnlocked}
          />
        </div>
      </div>
    </section>
  );
};
