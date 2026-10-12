import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { config } from '../config';

interface LoadingScreenProps {
  onComplete: () => void;
}

const FLOATING_KAMOJI = [
  { text: '♡', left: '12%', top: '18%', duration: 5.5, delay: 0 },
  { text: '✦', left: '82%', top: '22%', duration: 6.2, delay: 0.4 },
  { text: '🎀', left: '20%', top: '76%', duration: 5.8, delay: 0.8 },
  { text: '(´｡• ᵕ •｡`)', left: '72%', top: '72%', duration: 7.0, delay: 0.2 },
  { text: '✿', left: '16%', top: '46%', duration: 6.4, delay: 1.1 },
  { text: '☆', left: '84%', top: '48%', duration: 5.9, delay: 0.6 },
  { text: '♡', left: '52%', top: '14%', duration: 6.6, delay: 0.3 },
  { text: '✧', left: '46%', top: '84%', duration: 5.4, delay: 0.9 },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);

  // Preload the 4 photos during the loading stage
  useEffect(() => {
    config.photos.forEach((photo) => {
      const img = new Image();
      img.src = photo.src;
    });
  }, []);

  // Animate 0 -> 100% in ~3.5 seconds with realistic pauses
  useEffect(() => {
    const keyframes: Array<{ time: number; value: number }> = [
      { time: 180, value: 12 },
      { time: 520, value: 28 },
      { time: 950, value: 34 }, // Brief pause
      { time: 1450, value: 58 },
      { time: 1950, value: 64 }, // Brief pause
      { time: 2550, value: 86 },
      { time: 2950, value: 92 }, // Final anticipation pause
      { time: 3350, value: 100 },
    ];

    const timers = keyframes.map((kf) =>
      window.setTimeout(() => {
        setProgress(kf.value);
      }, kf.time)
    );

    const finishTimer = window.setTimeout(() => {
      onComplete();
    }, 3650);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <section
      className="relative w-full h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-6 select-none"
      style={{ backgroundColor: 'var(--bg-soft)', color: '#4A1D1F' }}
      aria-label="Loading your birthday surprise"
    >
      {/* Floating small emojis & kaomoji */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {FLOATING_KAMOJI.map((item, idx) => (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: [0.25, 0.65, 0.25],
              y: [-10, 10, -10],
              x: [-5, 5, -5],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ left: item.left, top: item.top }}
            className="absolute text-sm sm:text-base font-medium text-rose-400/80"
          >
            {item.text}
          </motion.span>
        ))}
      </div>

      {/* Center Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center text-center"
      >
        {/* Crisp Pixel-Style Birthday Cake SVG */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-5"
          aria-hidden="true"
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            shapeRendering="crispEdges"
            className="drop-shadow-sm"
          >
            {/* Flame */}
            <rect x="7" y="1" width="2" height="1" fill="#FBBF24" />
            <rect x="7" y="2" width="2" height="1" fill="#F59E0B" />
            {/* Candle */}
            <rect x="7" y="3" width="2" height="3" fill="#FFF1F2" />
            <rect x="7" y="4" width="2" height="1" fill="#FB7185" />
            {/* Top strawberry & frosting */}
            <rect x="4" y="6" width="8" height="2" fill="#FDA4AF" />
            <rect x="5" y="5" width="2" height="1" fill="#E11D48" />
            <rect x="9" y="5" width="2" height="1" fill="#E11D48" />
            {/* Cake middle sponge */}
            <rect x="3" y="8" width="10" height="3" fill="#FDE68A" />
            {/* Frosting drip */}
            <rect x="3" y="8" width="2" height="1" fill="#FDA4AF" />
            <rect x="7" y="8" width="2" height="1" fill="#FDA4AF" />
            <rect x="11" y="8" width="2" height="1" fill="#FDA4AF" />
            {/* Bottom berry layer */}
            <rect x="3" y="11" width="10" height="3" fill="#FECDD3" />
            {/* Plate */}
            <rect x="1" y="14" width="14" height="1" fill="#D6D3D1" />
          </svg>
        </motion.div>

        <h2 className="font-handwriting text-3xl sm:text-4xl font-bold text-rose-900 mb-2">
          Hey {config.herName}! 👋
        </h2>

        <p className="text-xs sm:text-sm text-rose-800/80 mb-5 font-medium">
          Loading your birthday surprise...
        </p>

        {/* Progress Bar */}
        <div
          className="w-full h-3 bg-rose-200/70 rounded-full overflow-hidden p-0.5 shadow-inner border border-rose-300/60"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 100%)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        <span className="mt-2.5 text-xs font-semibold text-rose-700/80 tabular-nums">
          {progress}%
        </span>
      </motion.div>
    </section>
  );
};
