/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        '20px': '20px',
        'glass': '20px',
      },
      colors: {
        primary: {
          DEFAULT: '#0EA5E9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        secondary: {
          DEFAULT: '#2563EB',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
        },
        accent: {
          DEFAULT: '#06B6D4',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        success: {
          DEFAULT: '#22C55E',
          500: '#22c55e',
        },
        warning: {
          DEFAULT: '#F59E0B',
          500: '#f59e0b',
        },
        danger: {
          DEFAULT: '#EF4444',
          500: '#ef4444',
        },
        surface: 'rgba(15, 23, 42, 0.72)',
        navy: {
          950: '#020617',
          900: '#0B132B',
          850: '#0F1B38',
          800: '#1C2541',
          700: '#273456',
        },
      },
      backdropBlur: {
        glass: '16px',
        heavy: '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px -5px rgba(14, 165, 233, 0.25)',
        'pulse-glow': '0 0 35px 2px rgba(6, 182, 212, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
