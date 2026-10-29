import React from 'react';

interface ChessQueenProps {
  className?: string;
  variant?: 'placed' | 'candidate' | 'conflicted' | 'solution' | 'threat';
  size?: number | string;
}

export const ChessQueen: React.FC<ChessQueenProps> = ({
  className = '',
  variant = 'placed',
  size = '80%',
}) => {
  // Palettes for various search states
  const colors = {
    placed: {
      primary: '#FBBF24', // Warm Gold
      secondary: '#F59E0B',
      accent: '#FEF3C7',
      glow: 'rgba(251, 191, 36, 0.45)',
      band: '#9333EA',
    },
    candidate: {
      primary: '#67E8F9', // Cyan
      secondary: '#06B6D4',
      accent: '#CFFAFE',
      glow: 'rgba(103, 232, 249, 0.5)',
      band: '#3B82F6',
    },
    conflicted: {
      primary: '#F87171', // Coral Red
      secondary: '#EF4444',
      accent: '#FEE2E2',
      glow: 'rgba(239, 68, 68, 0.6)',
      band: '#DC2626',
    },
    solution: {
      primary: '#86EFAC', // Soft Green
      secondary: '#22C55E',
      accent: '#DCFCE7',
      glow: 'rgba(74, 222, 128, 0.6)',
      band: '#15803D',
    },
    threat: {
      primary: '#FB923C', // Amber-Orange
      secondary: '#EA580C',
      accent: '#FFEDD5',
      glow: 'rgba(249, 115, 22, 0.5)',
      band: '#C2410C',
    },
  }[variant];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${className}`}
      style={{
        filter: `drop-shadow(0 0 6px ${colors.glow})`,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`queen-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.accent} />
          <stop offset="45%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <radialGradient id={`jewel-${variant}`} cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor={colors.accent} />
          <stop offset="100%" stopColor={colors.primary} />
        </radialGradient>
      </defs>

      {/* Pedestal Base */}
      <path
        d="M 22 88 L 78 88 C 80 88 82 86 80 83 L 74 76 C 73 74 71 73 68 73 L 32 73 C 29 73 27 74 26 76 L 20 83 C 18 86 20 88 22 88 Z"
        fill={`url(#queen-grad-${variant})`}
        stroke="rgba(0, 0, 0, 0.35)"
        strokeWidth="1.5"
      />

      {/* Base Accent Ring */}
      <rect
        x="28"
        y="78"
        width="44"
        height="3.5"
        rx="1.5"
        fill={colors.band}
        opacity="0.9"
      />

      {/* Torso / Gown Curves */}
      <path
        d="M 33 73 C 33 62 38 52 42 42 L 58 42 C 62 52 67 62 67 73 Z"
        fill={`url(#queen-grad-${variant})`}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="1.5"
      />

      {/* Corset Belt Jewel */}
      <ellipse cx="50" cy="55" rx="4" ry="2.5" fill={colors.band} />

      {/* Royal Crown Headpiece */}
      <path
        d="M 20 28 L 33 41 L 43 23 L 50 41 L 57 23 L 67 41 L 80 28 L 72 44 C 70 48 64 50 50 50 C 36 50 30 48 28 44 Z"
        fill={`url(#queen-grad-${variant})`}
        stroke="rgba(0, 0, 0, 0.3)"
        strokeWidth="1.5"
      />

      {/* Crown Spire Pearls (5 jewels) */}
      <circle cx="20" cy="27" r="4.5" fill={`url(#jewel-${variant})`} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <circle cx="43" cy="22" r="4" fill={`url(#jewel-${variant})`} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <circle cx="50" cy="18" r="5" fill={`url(#jewel-${variant})`} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <circle cx="57" cy="22" r="4" fill={`url(#jewel-${variant})`} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      <circle cx="80" cy="27" r="4.5" fill={`url(#jewel-${variant})`} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />

      {/* Center Crown Cross / Star highlight */}
      <path
        d="M 50 29 L 51.5 33.5 L 56 35 L 51.5 36.5 L 50 41 L 48.5 36.5 L 44 35 L 48.5 33.5 Z"
        fill="#FFFFFF"
        opacity="0.85"
      />
    </svg>
  );
};
