/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,scss}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 45px -24px rgba(23, 35, 42, 0.28)',
      },
      colors: {
        canvas: '#f5efe6',
        ink: '#17232a',
        accent: '#1f6f78',
        warmth: '#d99058',
      },
    },
  },
  plugins: [],
};