import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { config } from '../config';
import { useTypewriter } from '../hooks/useTypewriter';

interface LoveLetterProps {
  startImmediately?: boolean;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({ startImmediately = false }) => {
  const [inView, setInView] = useState<boolean>(startImmediately);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (startImmediately) {
      setInView(true);
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [startImmediately]);

  const { displayedText, isComplete, skipToEnd } = useTypewriter({
    text: config.loveLetter,
    speed: 24,
    startWhen: inView,
  });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="relative w-full max-w-2xl mx-auto bg-[#FFFDF9] rounded-2xl p-6 sm:p-10 md:p-12 shadow-xl border border-rose-200/80 text-stone-800"
    >
      {/* Wax seal decorative header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm text-white"
            style={{ backgroundColor: 'var(--accent)' }}
            aria-hidden="true"
          >
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <span className="font-handwriting text-2xl sm:text-3xl text-rose-900 font-bold">
            A Note for {config.herName}
          </span>
        </div>

        {!isComplete && inView && (
          <button
            type="button"
            onClick={skipToEnd}
            className="text-xs font-medium text-rose-700/80 hover:text-rose-900 underline underline-offset-4 cursor-pointer py-1 px-2"
          >
            Show full letter
          </button>
        )}
      </div>

      {/* Letter Body with Typewriter */}
      <div
        className="font-handwriting text-2xl sm:text-[28px] leading-relaxed text-stone-800 whitespace-pre-line min-h-[220px]"
        aria-live="polite"
      >
        {displayedText}
        {!isComplete && inView && (
          <span
            className="inline-block w-0.5 h-6 bg-rose-600 ml-1 animate-pulse align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </motion.div>
  );
};
