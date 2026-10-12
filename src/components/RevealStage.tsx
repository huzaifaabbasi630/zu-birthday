import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { config } from '../config';
import { PolaroidGallery } from './PolaroidGallery';
import { Lightbox } from './Lightbox';
import { LoveLetter } from './LoveLetter';
import { FloatingHearts } from './FloatingHearts';

interface RevealStageProps {
  onContinue: () => void;
}

export const RevealStage: React.FC<RevealStageProps> = ({ onContinue }) => {
  const [showCurtain, setShowCurtain] = useState<boolean>(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowCurtain(false);
    }, 1150);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative min-h-[100dvh] w-full overflow-x-hidden py-14 sm:py-20 px-4 sm:px-6"
      style={{ backgroundColor: 'var(--bg-soft)', color: '#3F1D24' }}
      aria-label="Our Memories and Love Letter"
    >
      {/* Red/Orange Curtain Opening Transition with Beating Heart in Corner */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div
            key="reveal-curtain"
            initial={{ clipPath: 'circle(150% at 90% 10%)' }}
            animate={{ clipPath: 'circle(150% at 90% 10%)' }}
            exit={{ clipPath: 'circle(0% at 90% 10%)' }}
            transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, var(--bg) 0%, var(--accent) 55%, #EA580C 100%)',
            }}
          >
            {/* Beating heart in top-right corner */}
            <motion.div
              animate={{ scale: [1, 1.28, 1, 1.22, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
              className="absolute top-8 right-8 sm:top-12 sm:right-12 text-white drop-shadow-lg"
            >
              <Heart className="w-10 h-10 sm:w-14 sm:h-14 fill-white" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="font-handwriting text-4xl sm:text-6xl text-white drop-shadow-md px-6 text-center"
            >
              For You, {config.herName}...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Rising Hearts */}
      <FloatingHearts count={16} lightMode />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-rose-700/80 font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Chapter One
          </span>
          <h1
            className="font-handwriting text-5xl sm:text-6xl font-bold text-rose-950"
            style={{ textWrap: 'balance' }}
          >
            Our Memories
          </h1>
          <p className="text-xs sm:text-sm text-rose-900/70 mt-2">
            Tap any polaroid to take a closer look
          </p>
        </motion.div>

        {/* 4 Scattered Polaroids */}
        <PolaroidGallery
          photos={config.photos}
          onSelectPhoto={(index) => setSelectedPhotoIndex(index)}
        />

        {/* Love Letter Section */}
        <div className="w-full mt-16 sm:mt-24">
          <LoveLetter />
        </div>

        {/* Continue CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 sm:mt-16 mb-8"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onContinue}
            className="min-h-[52px] px-9 py-3.5 rounded-full text-white font-medium text-base sm:text-lg shadow-xl flex items-center justify-center gap-2.5 cursor-pointer transition-shadow hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-400 whitespace-nowrap shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--bg) 0%, var(--accent) 100%)',
            }}
          >
            <span>Continue 🎂</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photos={config.photos}
        currentIndex={selectedPhotoIndex}
        onClose={() => setSelectedPhotoIndex(null)}
        onChangeIndex={(idx) => setSelectedPhotoIndex(idx)}
      />
    </section>
  );
};
