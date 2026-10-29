/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          main: '#111318',
          secondary: '#181B22',
        },
        clay: {
          surface: '#20242D',
          elevated: '#282D38',
          border: '#2E3442',
          borderLight: 'rgba(255, 255, 255, 0.08)',
          inset: '#161920',
        },
        accent: {
          primary: '#A78BFA',
          secondary: '#67E8F9',
        },
        state: {
          success: '#86EFAC',
          warning: '#FBBF24',
        },
        txt: {
          primary: '#F3F4F6',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'clay-surface': '8px 8px 18px rgba(0, 0, 0, 0.45), -4px -4px 12px rgba(255, 255, 255, 0.025), inset 1px 1px 1px rgba(255, 255, 255, 0.08)',
        'clay-elevated': '12px 12px 28px rgba(0, 0, 0, 0.55), -6px -6px 18px rgba(255, 255, 255, 0.035), inset 1px 1px 2px rgba(255, 255, 255, 0.12)',
        'clay-card': '6px 6px 16px rgba(0, 0, 0, 0.45), -3px -3px 10px rgba(255, 255, 255, 0.02), inset 1px 1px 1px rgba(255, 255, 255, 0.06)',
        'clay-btn': '4px 4px 10px rgba(0, 0, 0, 0.4), -2px -2px 8px rgba(255, 255, 255, 0.03), inset 1px 1px 1px rgba(255, 255, 255, 0.1)',
        'clay-btn-hover': '6px 6px 14px rgba(0, 0, 0, 0.45), -3px -3px 10px rgba(255, 255, 255, 0.04), inset 1px 1px 1px rgba(255, 255, 255, 0.15)',
        'clay-btn-active': 'inset 3px 3px 6px rgba(0, 0, 0, 0.65), inset -2px -2px 4px rgba(255, 255, 255, 0.03)',
        'clay-inset': 'inset 3px 3px 8px rgba(0, 0, 0, 0.6), inset -2px -2px 6px rgba(255, 255, 255, 0.025)',
        'clay-badge': '2px 2px 6px rgba(0, 0, 0, 0.35), -1px -1px 4px rgba(255, 255, 255, 0.02), inset 1px 1px 1px rgba(255, 255, 255, 0.06)',
      },
      borderRadius: {
        'clay': '16px',
        'clay-lg': '22px',
        'clay-sm': '12px',
      }
    },
  },
  plugins: [],
}
