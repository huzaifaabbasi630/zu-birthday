import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { PhotoItem } from '../config';

interface PolaroidGalleryProps {
  photos: PhotoItem[];
  onSelectPhoto: (index: number) => void;
}

const ROTATIONS = [-4.5, 3.5, -3, 4];

export const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({
  photos,
  onSelectPhoto,
}) => {
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const handleImageError = (index: number) => {
    setFailedImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8 place-items-center">
        {photos.map((photo, index) => {
          const rotation = ROTATIONS[index % ROTATIONS.length];
          const isFailed = Boolean(failedImages[index]);

          return (
            <motion.button
              key={photo.src}
              type="button"
              initial={{ opacity: 0, y: -45, rotate: rotation * 2 }}
              animate={{ opacity: 1, y: 0, rotate: rotation }}
              transition={{
                duration: 0.65,
                delay: 0.25 + index * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{
                scale: 1.05,
                rotate: 0,
                y: -6,
                transition: { duration: 0.22 },
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectPhoto(index)}
              aria-label={`Open memory ${index + 1}: ${photo.caption}`}
              className="group relative bg-[#FFFDF9] p-3 pb-7 sm:p-3.5 sm:pb-8 rounded-xl polaroid-shadow w-64 sm:w-full max-w-[260px] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              {/* Decorative Washi Tape at top */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-rose-200/70 backdrop-blur-[1px] rotate-[-2deg] rounded-xs shadow-2xs pointer-events-none border border-rose-300/40"
                aria-hidden="true"
              />

              {/* Photo Area */}
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-rose-50">
                {!isFailed ? (
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(index)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
                    style={{ background: photo.fallbackGradient }}
                  >
                    <Heart className="w-10 h-10 text-white/90 fill-white/80 mb-2 drop-shadow-sm" />
                    <span className="text-white/95 text-xs font-medium tracking-wide">
                      Memory #{index + 1}
                    </span>
                  </div>
                )}

                {/* Subtle hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-end justify-end p-2.5">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/55 text-white text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Tap to view
                  </span>
                </div>
              </div>

              {/* Handwritten Caption */}
              <p className="font-handwriting text-stone-800 text-center text-xl sm:text-2xl mt-3.5 leading-snug min-h-[2.5rem] flex items-center justify-center px-1">
                {photo.caption}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
