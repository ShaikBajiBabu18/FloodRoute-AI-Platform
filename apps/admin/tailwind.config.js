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
          950: '#050811',
          900: '#0A0F1E',
          850: '#0E172E',
          800: '#14203D',
          750: '#1A2A50',
          700: '#223666',
        },
      },
    },
  },
  plugins: [],
}
