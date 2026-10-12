import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingHeartsProps {
  count?: number;
  lightMode?: boolean;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 14,
  lightMode = false,
}) => {
  const hearts = useMemo(() => {
    return Array.from({ length: count }).map((_, index) => ({
      id: index,
      left: `${(index * 7 + 5) % 94}%`,
      size: 12 + (index % 4) * 5,
      duration: 9 + (index % 5) * 2.2,
      delay: (index % 6) * 1.1,
      symbol: index % 3 === 0 ? '♥' : index % 3 === 1 ? '♡' : '✦',
    }));
  }, [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {hearts.map((heart) => (
        <motion.span
          key={heart.id}
          initial={{ y: '105vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, lightMode ? 0.35 : 0.45, lightMode ? 0.35 : 0.45, 0],
            x: [0, heart.id % 2 === 0 ? 18 : -18, 0],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            left: heart.left,
            fontSize: `${heart.size}px`,
            color: lightMode ? 'var(--accent)' : 'rgba(255, 228, 230, 0.5)',
          }}
          className="absolute select-none"
        >
          {heart.symbol}
        </motion.span>
      ))}
    </div>
  );
};
