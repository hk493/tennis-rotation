/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#010101',
          900: '#0a0a0a',
          850: '#101010',
          800: '#161616',
          700: '#1a1a1a',
        },
        accent: {
          DEFAULT: '#2C5C88',
          hover: '#3a7aad',
          soft: 'rgba(44, 92, 136, 0.18)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Hiragino Sans"', '"Hiragino Kaku Gothic ProN"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(55, 65, 81, 0.5)',
      },
    },
  },
  plugins: [],
}
