/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pink: { 50: '#fff1f7', 100: '#ffe0ee' },
        mint: { 50: '#effdf5', 100: '#dafce6' },
        butter: { 50: '#fffbe6', 100: '#fff3b0' },
        ink: { DEFAULT: '#1f2937' },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(236, 72, 153, 0.08), 0 2px 8px rgba(20, 184, 166, 0.04)',
        pop: '0 12px 40px rgba(236, 72, 153, 0.18)',
      },
      animation: {
        'pop-in': 'pop-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float-slow': 'float 7s ease-in-out infinite',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        wiggle: 'wiggle 0.6s ease-in-out',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: 0, transform: 'scale(0.85)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-12px) translateX(6px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(0.8)' },
          '50%': { opacity: 1, transform: 'scale(1.1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
