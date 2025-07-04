/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#d70f64',
        'primary-dark': '#b30d53',
        'secondary': '#1d1d1d',
        'accent': '#00a5cf',
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.04), 0 8px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
