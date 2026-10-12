import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { PhotoItem } from '../config';

interface LightboxProps {
  photos: PhotoItem[];
  currentIndex: number | null;
  onClose: () => void;
  onChangeIndex: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photos,
  currentIndex,
  onClose,
  onChangeIndex,
}) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onChangeIndex((currentIndex - 1 + photos.length) % photos.length);
  }, [currentIndex, onChangeIndex, photos.length]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onChangeIndex((currentIndex + 1) % photos.length);
  }, [currentIndex, onChangeIndex, photos.length]);

  useEffect(() => {
    if (currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleNext, handlePrev, onClose]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 45) {
      handlePrev();
    } else if (deltaX < -45) {
      handleNext();
    }
    setTouchStartX(null);
  };

  if (currentIndex === null) return null;

  const currentPhoto = photos[currentIndex];
  const isFailed = Boolean(failedImages[currentIndex]);

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Memory photo viewer"
      >
        {/* Top bar controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 max-w-4xl mx-auto">
          <span className="text-xs sm:text-sm font-medium text-white/80 tabular-nums">
            {currentIndex + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Previous photo"
          className="absolute left-3 sm:left-8 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Next photo"
          className="absolute right-3 sm:right-8 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Polaroid Card */}
        <motion.div
          key={currentPhoto.src}
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#FFFDF9] p-4 pb-8 sm:p-5 sm:pb-10 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-rose-100">
            {!isFailed ? (
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                referrerPolicy="no-referrer"
                onError={() =>
                  setFailedImages((prev) => ({ ...prev, [currentIndex]: true }))
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
                style={{ background: currentPhoto.fallbackGradient }}
              >
                <Heart className="w-16 h-16 text-white/90 fill-white/80 mb-3 drop-shadow" />
                <span className="text-white text-sm font-medium">
                  Memory #{currentIndex + 1}
                </span>
              </div>
            )}
          </div>
          <p className="font-handwriting text-stone-800 text-center text-2xl sm:text-3xl mt-5 leading-snug px-2">
            {currentPhoto.caption}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
