import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

interface KeypadProps {
  onDigitPress: (digit: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const KEYS: Array<string | null> = ['1', '2', '3', '4', '5', '6', '7', '8', '9', null, '0', 'BACKSPACE'];

export const Keypad: React.FC<KeypadProps> = ({
  onDigitPress,
  onBackspace,
  disabled = false,
}) => {
  const triggerHaptic = () => {
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(14);
      }
    } catch {
      // Ignore vibration errors on unsupported devices
    }
  };

  const handleDigit = (digit: string) => {
    if (disabled) return;
    triggerHaptic();
    onDigitPress(digit);
  };

  const handleBack = () => {
    if (disabled) return;
    triggerHaptic();
    onBackspace();
  };

  return (
    <div
      className="grid grid-cols-3 gap-3 sm:gap-4 place-items-center"
      role="group"
      aria-label="Passcode numeric keypad"
    >
      {KEYS.map((key, index) => {
        if (key === null) {
          return <div key={`empty-${index}`} className="w-14 h-14 sm:w-16 sm:h-16" aria-hidden="true" />;
        }

        if (key === 'BACKSPACE') {
          return (
            <motion.button
              key="backspace"
              type="button"
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={handleBack}
              disabled={disabled}
              aria-label="Delete last digit"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 active:bg-white/25 border border-white/25 backdrop-blur-md text-white shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50"
            >
              <Delete className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => handleDigit(key)}
            disabled={disabled}
            aria-label={`Digit ${key}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white/14 hover:bg-white/24 active:bg-white/30 border border-white/30 backdrop-blur-md text-white text-lg sm:text-xl font-medium shadow-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-50 tabular-nums"
          >
            {key}
          </motion.button>
        );
      })}
    </div>
  );
};
