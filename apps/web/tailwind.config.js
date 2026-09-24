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
        navy: {
          950: '#070B14',
          900: '#0B132B',
          850: '#0F1B38',
          800: '#1C2541',
          700: '#273456',
        },
        flood: {
          safe: '#10B981',
          caution: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
          cyan: '#06B6D4',
          blue: '#3B82F6',
          purple: '#A855F7',
        }
      },
    },
  },
  plugins: [],
}
