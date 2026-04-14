/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './global.css',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#B04500',
          dark: '#8A3600',
          light: '#D45500',
        },
      },
      borderRadius: {
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
