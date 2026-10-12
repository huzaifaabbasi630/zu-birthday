export interface PhotoItem {
  src: string;
  caption: string;
  fallbackGradient: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  swatch: string;
  variables: {
    '--bg': string;
    '--bg-soft': string;
    '--accent': string;
    '--accent-2': string;
    '--text': string;
    '--glow': string;
  };
}

export interface AppConfig {
  herName: string;
  fromName: string;
  passcode: string;
  passcodeHint: string;
  polaroidCaption: string;
  birthDate?: string;
  photos: [PhotoItem, PhotoItem, PhotoItem, PhotoItem];
  loveLetter: string;
  wishText: string;
  finalMessage: string;
  musicSrc: string;
  themes: ThemePreset[];
}

const HER_NAME = 'Zunaysha';
const FROM_NAME = 'Usaid';

export const config: AppConfig = {
  herName: HER_NAME,
  fromName: FROM_NAME,
  passcode: '2819',
  passcodeHint: '[e.g. Our special date]',
  polaroidCaption: 'Happy Birthday, Babe',
  // Optional: set YYYY-MM-DD to show "You've been shining for X days ✨" on the finale, or "" to hide
  birthDate: '2003-10-12',
  photos: [
    {
      src: '/photos/1.jpg',
      caption: 'Every golden hour feels warmer with you',
      fallbackGradient: 'linear-gradient(135deg, #fca5a5 0%, #f43f5e 50%, #9f1239 100%)',
    },
    {
      src: '/photos/2.jpg',
      caption: 'Slow mornings & our favorite little talks',
      fallbackGradient: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 55%, #b45309 100%)',
    },
    {
      src: '/photos/3.jpg',
      caption: 'Under the city lights, my favorite place to be',
      fallbackGradient: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #4c1d95 100%)',
    },
    {
      src: '/photos/4.jpg',
      caption: 'Here is to a thousand more birthdays together',
      fallbackGradient: 'linear-gradient(135deg, #fbcfe8 0%, #ec4899 55%, #831843 100%)',
    },
  ],
  loveLetter: `My dearest ${HER_NAME},\nFrom the moment you came into my life, ordinary days turned into my favorite memories. Your laugh is still the sweetest sound I know, and your kindness makes the whole world feel softer and brighter. On your birthday, I just want to remind you how deeply you are loved, today and every single day after. Thank you for being my safe place, my best friend, and my greatest adventure.\nHappy Birthday, my love — may all your sweetest wishes come true.\nForever yours, ${FROM_NAME}`,
  wishText: 'Make a Wish',
  finalMessage:
    'May this year bring you endless smiles, warm hugs, and every little dream your heart holds.',
  musicSrc: '/music/song.mp3',
  themes: [
    {
      id: 'crimson-rose',
      name: 'Crimson Rose',
      swatch: '#8B1E1E',
      variables: {
        '--bg': '#8B1E1E',
        '--bg-soft': '#FFF8F0',
        '--accent': '#E11D48',
        '--accent-2': '#F59E0B',
        '--text': '#FFF5F5',
        '--glow': 'rgba(251, 191, 36, 0.45)',
      },
    },
    {
      id: 'midnight-purple',
      name: 'Midnight Purple',
      swatch: '#2E1065',
      variables: {
        '--bg': '#2E1065',
        '--bg-soft': '#FAF5FF',
        '--accent': '#A855F7',
        '--accent-2': '#F472B6',
        '--text': '#F5F3FF',
        '--glow': 'rgba(192, 132, 252, 0.45)',
      },
    },
    {
      id: 'royal-gold',
      name: 'Royal Gold',
      swatch: '#5C3A14',
      variables: {
        '--bg': '#5C3A14',
        '--bg-soft': '#FFFBEB',
        '--accent': '#D97706',
        '--accent-2': '#FBBF24',
        '--text': '#FFFBEB',
        '--glow': 'rgba(251, 191, 36, 0.55)',
      },
    },
    {
      id: 'blush-pink',
      name: 'Blush Pink',
      swatch: '#831843',
      variables: {
        '--bg': '#831843',
        '--bg-soft': '#FDF2F8',
        '--accent': '#EC4899',
        '--accent-2': '#F9A8D4',
        '--text': '#FDF2F8',
        '--glow': 'rgba(244, 114, 182, 0.45)',
      },
    },
    {
      id: 'emerald-velvet',
      name: 'Emerald Velvet',
      swatch: '#064E3B',
      variables: {
        '--bg': '#064E3B',
        '--bg-soft': '#ECFDF5',
        '--accent': '#10B981',
        '--accent-2': '#FBBF24',
        '--text': '#ECFDF5',
        '--glow': 'rgba(52, 211, 153, 0.45)',
      },
    },
  ],
};
