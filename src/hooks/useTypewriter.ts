import { useState, useEffect, useCallback } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startWhen?: boolean;
}

interface UseTypewriterReturn {
  displayedText: string;
  isComplete: boolean;
  skipToEnd: () => void;
}

export function useTypewriter({
  text,
  speed = 28,
  startWhen = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [index, setIndex] = useState<number>(0);

  const skipToEnd = useCallback(() => {
    setIndex(text.length);
  }, [text.length]);

  useEffect(() => {
    if (!startWhen) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIndex(text.length);
      return;
    }

    if (index >= text.length) {
      return;
    }

    const currentChar = text[index];
    const delay =
      currentChar === '.' || currentChar === ',' || currentChar === '\n'
        ? speed * 4
        : speed;

    const timer = window.setTimeout(() => {
      setIndex((prev) => Math.min(prev + 1, text.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [index, speed, startWhen, text]);

  return {
    displayedText: text.slice(0, index),
    isComplete: index >= text.length,
    skipToEnd,
  };
}
