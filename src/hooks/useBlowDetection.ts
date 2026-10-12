import { useState, useRef, useCallback, useEffect } from 'react';

export type MicPermissionState = 'idle' | 'listening' | 'denied' | 'unsupported';

interface UseBlowDetectionOptions {
  onBlowDetected: () => void;
  sustainedMs?: number;
  threshold?: number;
}

interface UseBlowDetectionReturn {
  permissionState: MicPermissionState;
  audioLevel: number;
  blowProgress: number;
  startListening: () => Promise<void>;
  stopListening: () => void;
}

export function useBlowDetection({
  onBlowDetected,
  sustainedMs = 400,
  threshold = 42,
}: UseBlowDetectionOptions): UseBlowDetectionReturn {
  const [permissionState, setPermissionState] = useState<MicPermissionState>('idle');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [blowProgress, setBlowProgress] = useState<number>(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const blowStartRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const stopListening = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      void audioContextRef.current.close().catch(() => {
        // Ignore close errors
      });
      audioContextRef.current = null;
    }
    blowStartRef.current = null;
    setAudioLevel(0);
    setBlowProgress(0);
  }, []);

  const startListening = useCallback(async () => {
    if (
      typeof window === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setPermissionState('unsupported');
      return;
    }

    try {
      stopListening();
      hasTriggeredRef.current = false;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      streamRef.current = stream;

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setPermissionState('listening');

      const checkAudio = (timestamp: number) => {
        if (hasTriggeredRef.current) return;

        analyser.getByteFrequencyData(dataArray);

        // Focus on low-frequency breath turbulence (bins 0 to 14)
        let lowFreqSum = 0;
        const lowBins = Math.min(15, bufferLength);
        for (let i = 0; i < lowBins; i++) {
          lowFreqSum += dataArray[i];
        }
        const avgLowEnergy = lowFreqSum / lowBins;
        const normalizedLevel = Math.min(100, Math.round((avgLowEnergy / 120) * 100));
        setAudioLevel(normalizedLevel);

        if (avgLowEnergy >= threshold) {
          if (blowStartRef.current === null) {
            blowStartRef.current = timestamp;
          }
          const elapsed = timestamp - blowStartRef.current;
          const progress = Math.min(100, Math.round((elapsed / sustainedMs) * 100));
          setBlowProgress(progress);

          if (elapsed >= sustainedMs) {
            hasTriggeredRef.current = true;
            stopListening();
            setPermissionState('idle');
            onBlowDetected();
            return;
          }
        } else {
          blowStartRef.current = null;
          setBlowProgress((prev) => Math.max(0, prev - 10));
        }

        rafRef.current = requestAnimationFrame(checkAudio);
      };

      rafRef.current = requestAnimationFrame(checkAudio);
    } catch {
      stopListening();
      setPermissionState('denied');
    }
  }, [onBlowDetected, stopListening, sustainedMs, threshold]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    permissionState,
    audioLevel,
    blowProgress,
    startListening,
    stopListening,
  };
}
