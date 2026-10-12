import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { config } from '../config';

// Gentle procedural Web Audio music-box lullaby fallback when /music/song.mp3 is not present
const MELODY_NOTES = [
  261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
  261.63, 261.63, 293.66, 261.63, 392.0, 349.23,  // Happy birthday to you
  261.63, 261.63, 523.25, 440.0, 349.23, 329.63, 293.66, // Happy birthday dear...
  466.16, 466.16, 440.0, 349.23, 392.0, 349.23,   // Happy birthday to you
];

export const MusicToggle: React.FC = () => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [useSynthFallback, setUseSynthFallback] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const synthCtxRef = useRef<AudioContext | null>(null);
  const noteIndexRef = useRef<number>(0);

  const stopSynthLoop = useCallback(() => {
    if (synthTimerRef.current !== null) {
      window.clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  }, []);

  const startSynthLoop = useCallback(() => {
    stopSynthLoop();
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!synthCtxRef.current || synthCtxRef.current.state === 'closed') {
        synthCtxRef.current = new AudioCtx();
      }
      const ctx = synthCtxRef.current;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const playChime = (freq: number) => {
        if (!synthCtxRef.current || synthCtxRef.current.state !== 'running') return;
        const osc = synthCtxRef.current.createOscillator();
        const gain = synthCtxRef.current.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, synthCtxRef.current.currentTime);

        gain.gain.setValueAtTime(0.001, synthCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.035, synthCtxRef.current.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, synthCtxRef.current.currentTime + 0.65);

        osc.connect(gain);
        gain.connect(synthCtxRef.current.destination);
        osc.start();
        osc.stop(synthCtxRef.current.currentTime + 0.7);
      };

      synthTimerRef.current = window.setInterval(() => {
        const freq = MELODY_NOTES[noteIndexRef.current % MELODY_NOTES.length];
        noteIndexRef.current += 1;
        playChime(freq);
      }, 650);
    } catch {
      // Ignore Web Audio errors
    }
  }, [stopSynthLoop]);

  // Setup HTMLAudioElement once
  useEffect(() => {
    const audio = new Audio();
    audio.src = config.musicSrc;
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';

    const handleError = () => {
      setUseSynthFallback(true);
    };

    audio.addEventListener('error', handleError);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener('error', handleError);
      audio.pause();
      if (fadeIntervalRef.current !== null) {
        window.clearInterval(fadeIntervalRef.current);
      }
      stopSynthLoop();
    };
  }, [stopSynthLoop]);

  // Listen for first user interaction to start audio softly
  useEffect(() => {
    if (hasInteracted) return;

    const unlockAudio = () => {
      setHasInteracted(true);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [hasInteracted]);

  // Control playback based on interaction, mute state, and fallback availability
  useEffect(() => {
    if (!hasInteracted) return;

    const audio = audioRef.current;

    if (isMuted) {
      if (audio) {
        audio.pause();
      }
      stopSynthLoop();
      return;
    }

    if (useSynthFallback) {
      startSynthLoop();
      return;
    }

    if (audio) {
      audio
        .play()
        .then(() => {
          // Soft volume fade-in
          if (fadeIntervalRef.current !== null) {
            window.clearInterval(fadeIntervalRef.current);
          }
          audio.volume = 0.05;
          fadeIntervalRef.current = window.setInterval(() => {
            if (!audioRef.current) return;
            if (audioRef.current.volume < 0.45) {
              audioRef.current.volume = Math.min(0.45, audioRef.current.volume + 0.05);
            } else if (fadeIntervalRef.current !== null) {
              window.clearInterval(fadeIntervalRef.current);
            }
          }, 180);
        })
        .catch(() => {
          // If mp3 file is missing or fails to decode, switch cleanly to gentle music-box synth
          setUseSynthFallback(true);
        });
    }
  }, [hasInteracted, isMuted, startSynthLoop, stopSynthLoop, useSynthFallback]);

  const handleToggle = () => {
    setHasInteracted(true);
    setIsMuted((prev) => !prev);
  };

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      onClick={handleToggle}
      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
      aria-pressed={!isMuted}
      className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full bg-black/35 hover:bg-black/50 border border-white/25 backdrop-blur-md text-white shadow-lg flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      {isMuted ? (
        <VolumeX className="w-5 h-5 text-white/80" />
      ) : (
        <Volume2 className="w-5 h-5 text-amber-300" />
      )}
    </motion.button>
  );
};
