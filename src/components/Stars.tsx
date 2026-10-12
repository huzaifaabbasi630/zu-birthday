import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface StarsProps {
  count?: number;
}

export const Stars: React.FC<StarsProps> = ({ count = 36 }) => {
  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 96}%`,
      top: `${(i * 13 + 5) % 92}%`,
      size: i % 4 === 0 ? 3 : 2,
      duration: 2.2 + (i % 4) * 0.9,
      delay: (i % 5) * 0.5,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {stars.map((star) => (
        <motion.span
          key={star.id}
          animate={{
            opacity: [0.15, 0.9, 0.15],
            scale: [0.85, 1.2, 0.85],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          className="absolute rounded-full bg-amber-100 shadow-[0_0_8px_rgba(253,230,138,0.8)]"
        />
      ))}
    </div>
  );
};
