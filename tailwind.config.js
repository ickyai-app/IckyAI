/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00ffc8',
        'neon-blue': '#00d9ff',
      },
    },
  },
  plugins: [],
};
