import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CakeProps {
  candlesLit: boolean;
  variant?: 'wish' | 'finale';
  audioLevel?: number;
  onCakeClick?: () => void;
}

export const Cake: React.FC<CakeProps> = ({
  candlesLit,
  variant = 'wish',
  audioLevel = 0,
  onCakeClick,
}) => {
  const isMint = variant === 'finale';
  const frostingColor = isMint ? '#6EE7B7' : '#FDA4AF';
  const frostingDark = isMint ? '#34D399' : '#FB7185';
  const spongeTop = isMint ? '#ECFDF5' : '#FFFBEB';
  const spongeBottom = isMint ? '#D1FAE5' : '#FEF3C7';

  // Subtle lean when blowing into the microphone
  const flameSkew = Math.min(22, audioLevel * 0.25);

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Warm Candlelight Halo Glow when lit */}
      <AnimatePresence>
        {candlesLit && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.45, 0.7, 0.45],
              scale: [0.96, 1.06, 0.96],
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-6 w-56 h-36 rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(251,191,36,0.55) 0%, rgba(245,158,11,0.18) 60%, transparent 100%)',
            }}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={onCakeClick}
        whileTap={{ scale: 0.96 }}
        aria-label={
          candlesLit
            ? 'Birthday cake with 3 lit candles. Tap to blow out the candles.'
            : 'Birthday cake. Tap for a surprise.'
        }
        className="relative z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-2xl p-2"
      >
        <svg
          width="260"
          height="240"
          viewBox="0 0 260 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-56 h-52 sm:w-64 sm:h-60 overflow-visible drop-shadow-xl"
        >
          {/* 3 Candles: Left (x=88), Center (x=130), Right (x=172) */}
          {[88, 130, 172].map((cx, idx) => (
            <g key={cx}>
              {/* Candle Stick */}
              <rect
                x={cx - 7}
                y={56}
                width="14"
                height="44"
                rx="4"
                fill="#FFFDF9"
                stroke="#E7E5E4"
                strokeWidth="1.5"
              />
              {/* Diagonal Stripes */}
              <path
                d={`M${cx - 6} 68L${cx + 6} 62M${cx - 6} 80L${cx + 6} 74M${cx - 6} 92L${cx + 6} 86`}
                stroke={isMint ? '#10B981' : '#FB7185'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Candle Wick */}
              <line
                x1={cx}
                y1={50}
                x2={cx}
                y2={56}
                stroke="#44403C"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Flickering Flame */}
              {candlesLit ? (
                <g
                  className="animate-flame"
                  style={{
                    transform: `skewX(${flameSkew}deg)`,
                    transformOrigin: `${cx}px 50px`,
                  }}
                >
                  {/* Outer Flame Glow */}
                  <ellipse
                    cx={cx}
                    cy={36}
                    rx="11"
                    ry="17"
                    fill="rgba(251, 191, 36, 0.32)"
                  />
                  {/* Main Flame Teardrop */}
                  <path
                    d={`M${cx} 18C${cx} 18 ${cx - 9} 30 ${cx - 9} 39C${cx - 9} 45 ${cx - 5} 49 ${cx} 49C${cx + 5} 49 ${cx + 9} 45 ${cx + 9} 39C${cx + 9} 30 ${cx} 18 ${cx} 18Z`}
                    fill="#F59E0B"
                  />
                  {/* Inner Bright Core */}
                  <path
                    d={`M${cx} 25C${cx} 25 ${cx - 5} 33 ${cx - 5} 40C${cx - 5} 44 ${cx - 2.5} 47 ${cx} 47C${cx + 2.5} 47 ${cx + 5} 44 ${cx + 5} 40C${cx + 5} 33 ${cx} 25 ${cx} 25Z`}
                    fill="#FEF08A"
                  />
                </g>
              ) : (
                /* Smoke Wisp when blown out */
                <motion.path
                  key={`smoke-${idx}`}
                  initial={{ opacity: 0.85, pathLength: 0, y: 0 }}
                  animate={{ opacity: 0, pathLength: 1, y: -24 }}
                  transition={{ duration: 1.4, delay: idx * 0.1, ease: 'easeOut' }}
                  d={`M${cx} 48 C${cx - 8} 38, ${cx + 8} 28, ${cx - 4} 14`}
                  stroke="#D6D3D1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          ))}

          {/* Cake Plate */}
          <ellipse cx="130" cy="212" rx="104" ry="14" fill="#E7E5E4" />
          <ellipse cx="130" cy="209" rx="96" ry="11" fill="#F5F5F4" />

          {/* Bottom Sponge Layer */}
          <rect
            x="48"
            y="148"
            width="164"
            height="60"
            rx="16"
            fill={spongeBottom}
            stroke="#D6D3D1"
            strokeWidth="2"
          />

          {/* Middle Cream Filling Stripe */}
          <rect x="48" y="144" width="164" height="10" rx="5" fill={frostingColor} />

          {/* Top Sponge Layer */}
          <rect
            x="56"
            y="94"
            width="148"
            height="58"
            rx="16"
            fill={spongeTop}
            stroke="#E7E5E4"
            strokeWidth="2"
          />

          {/* Kawaii Frosting Drips on Top Layer */}
          <path
            d="M56 108C56 98 64 92 74 92H186C196 92 204 98 204 108V114C198 114 195 126 188 126C181 126 179 112 172 112C165 112 162 128 154 128C146 128 143 114 135 114C127 114 124 129 116 129C108 129 105 113 97 113C89 113 86 126 78 126C70 126 68 114 62 114L56 108Z"
            fill={frostingColor}
          />
          <path
            d="M60 100C60 95 66 92 74 92H186C194 92 200 95 200 100"
            stroke={frostingDark}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Sprinkles on Frosting */}
          <circle cx="85" cy="102" r="2.5" fill="#FDE047" />
          <circle cx="112" cy="105" r="2.5" fill="#FFFFFF" />
          <circle cx="145" cy="101" r="2.5" fill="#FDE047" />
          <circle cx="174" cy="105" r="2.5" fill="#FFFFFF" />

          {/* Kawaii Sleepy-Smile Face on Bottom Layer */}
          {/* Blushing Cheeks */}
          <ellipse cx="95" cy="178" rx="9" ry="5" fill="#FDA4AF" opacity="0.75" />
          <ellipse cx="165" cy="178" rx="9" ry="5" fill="#FDA4AF" opacity="0.75" />

          {isMint ? (
            /* Happy awake eyes on Finale */
            <>
              <path
                d="M98 168C101 163 107 163 110 168"
                stroke="#44403C"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M150 168C153 163 159 163 162 168"
                stroke="#44403C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          ) : (
            /* Cute sleepy closed eyes on Make a Wish */
            <>
              <path
                d="M98 168C101 173 107 173 110 168"
                stroke="#44403C"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M150 168C153 173 159 173 162 168"
                stroke="#44403C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Cute Smile */}
          <path
            d="M122 175C125 181 135 181 138 175"
            stroke="#44403C"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </div>
  );
};
