/** @type {import('tailwindcss').Config} */


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "brown": "#9d584a",
        "dark-brown": "#78372c",
        "light-orange": "#ff9580",
        "dark-orange": "#eb836f",
        "light-peach": "#ffc5b9",
        "light-gray": "#bbcbce",
        "medium-gray": "#8fa8ae",
        "dark-gray": "#65858b",
      }
    },
  },
  plugins: [],
};
