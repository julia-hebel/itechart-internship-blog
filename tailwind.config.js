/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-purple': 'rgb(117,11,150)',
        'foreground-dark': 'rgb(43,44,45)',
        'interactive-dark': 'rgb(64,65,66)',
        'element-dark-hover': 'rgb(74,75,76)',
        'interactive-dark-hover': 'rgb(80,81,82)',
      },
    },
  },
  plugins: [],
};
