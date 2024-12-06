/** @type {import('tailwindcss').Config} */


module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'landscape-phone': { 'raw': '(max-height: 450px) and (orientation: landscape)' },
        'portrait-phone': { 'raw': '(max-width: 768px) and (orientation: portrait)' },
      },
      fontSize: {
        'md': '1.25rem'
      },
      scale: {
        25: '0.25',
        50: '0.5',
        70: '0.7',
        80: '0.8',

      },
      colors: {
        "brown": "#9d584a",
        "light-brown": "#aa6355",
        "dark-brown": "#78372c",
        "light-orange": "#ff9580",
        "dark-orange": "#eb836f",
        "light-peach": "#ffc5b9",
        "light-gray": "#bbcbce",
        "medium-gray": "#8fa8ae",
        "dark-gray": "#65858b",
      },
      keyframes: {
        grow: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        grow: 'grow 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
