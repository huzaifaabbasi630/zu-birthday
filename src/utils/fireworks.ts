import confetti from 'canvas-confetti';

const ROMANTIC_COLORS = ['#E11D48', '#F43F5E', '#FBBF24', '#FDE047', '#FB7185', '#FFF1F2', '#A7F3D0'];

function isReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function startFinaleFireworks(): () => void {
  const reduced = isReducedMotion();

  if (reduced) {
    // Gentle single burst for reduced motion users
    void confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.6 },
      colors: ROMANTIC_COLORS,
      disableForReducedMotion: false,
    });
    return () => {};
  }

  let isCancelled = false;
  const endTime = Date.now() + 6000;

  let heartShape: confetti.Shape | undefined;
  try {
    if (typeof confetti.shapeFromText === 'function') {
      heartShape = confetti.shapeFromText({ text: '❤️', scalar: 2 });
    }
  } catch {
    heartShape = undefined;
  }

  // 1. Six-second multi-position fireworks bursts
  const burstInterval = window.setInterval(() => {
    if (isCancelled || Date.now() > endTime) {
      window.clearInterval(burstInterval);
      return;
    }

    const randomX = 0.15 + Math.random() * 0.7;
    const randomY = 0.2 + Math.random() * 0.4;

    void confetti({
      particleCount: 45,
      startVelocity: 28,
      spread: 360,
      ticks: 70,
      origin: { x: randomX, y: randomY },
      colors: ROMANTIC_COLORS,
      shapes: heartShape ? ['circle', 'square', heartShape] : ['circle', 'square'],
      zIndex: 40,
    });
  }, 650);

  // Immediate dual cannon launch
  void confetti({
    particleCount: 65,
    angle: 60,
    spread: 60,
    origin: { x: 0.05, y: 0.75 },
    colors: ROMANTIC_COLORS,
    zIndex: 40,
  });
  void confetti({
    particleCount: 65,
    angle: 120,
    spread: 60,
    origin: { x: 0.95, y: 0.75 },
    colors: ROMANTIC_COLORS,
    zIndex: 40,
  });

  // 2. Continuous gentle confetti rain
  const rainInterval = window.setInterval(() => {
    if (isCancelled) return;

    void confetti({
      particleCount: 3,
      angle: 90,
      spread: 110,
      startVelocity: 10,
      gravity: 0.55,
      ticks: 240,
      origin: { x: Math.random(), y: -0.05 },
      colors: ROMANTIC_COLORS,
      scalar: 0.85,
      zIndex: 30,
    });
  }, 420);

  return () => {
    isCancelled = true;
    window.clearInterval(burstInterval);
    window.clearInterval(rainInterval);
  };
}

export function triggerHeartEasterEgg(): void {
  const reduced = isReducedMotion();
  let heartShape: confetti.Shape | undefined;
  try {
    if (typeof confetti.shapeFromText === 'function') {
      heartShape = confetti.shapeFromText({ text: '💖', scalar: 2.2 });
    }
  } catch {
    heartShape = undefined;
  }

  void confetti({
    particleCount: reduced ? 20 : 60,
    spread: 90,
    startVelocity: 32,
    origin: { x: 0.5, y: 0.52 },
    colors: ['#FB7185', '#E11D48', '#F472B6', '#FDE047'],
    shapes: heartShape ? [heartShape, 'circle'] : ['circle'],
    scalar: 1.25,
    zIndex: 60,
  });
}
