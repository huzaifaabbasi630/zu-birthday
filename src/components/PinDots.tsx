import React from 'react';
import { motion } from 'framer-motion';

interface PinDotsProps {
  filledCount: number;
  isError: boolean;
  isSuccess: boolean;
}

export const PinDots: React.FC<PinDotsProps> = ({ filledCount, isError, isSuccess }) => {
  return (
    <motion.div
      animate={
        isError
          ? { x: [0, -10, 10, -8, 8, -4, 4, 0] }
          : isSuccess
            ? { scale: [1, 1.12, 1] }
            : { x: 0 }
      }
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="flex items-center justify-center gap-4 my-2"
      role="status"
      aria-label={`Passcode progress: ${filledCount} of 4 digits entered`}
    >
      {[0, 1, 2, 3].map((idx) => {
        const isFilled = idx < filledCount;
        return (
          <motion.span
            key={idx}
            initial={false}
            animate={{
              scale: isFilled ? 1.18 : 1,
              backgroundColor: isError
                ? '#FCA5A5'
                : isSuccess
                  ? '#FDE047'
                  : isFilled
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.22)',
              borderColor: isError
                ? '#EF4444'
                : isSuccess
                  ? '#FACC15'
                  : isFilled
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.55)',
            }}
            transition={{ duration: 0.2 }}
            className="w-3.5 h-3.5 rounded-full border shadow-sm"
          />
        );
      })}
    </motion.div>
  );
};
