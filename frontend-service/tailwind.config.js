/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { navy: '#102B45', ink: '#18364F', aqua: '#0B9E94', mist: '#EFF8F7' },
      boxShadow: { soft: '0 12px 35px rgba(16, 43, 69, 0.10)', card: '0 4px 16px rgba(16, 43, 69, 0.07)' },
      animation: { 'fade-up': 'fadeUp .45s ease-out both', 'pulse-soft': 'pulseSoft 1.6s ease-in-out infinite' },
      keyframes: { fadeUp: { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } }, pulseSoft: { '0%,100%': { opacity: '.45' }, '50%': { opacity: '1' } } }
    }
  },
  plugins: []
};
