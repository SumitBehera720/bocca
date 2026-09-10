/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00796B',
        primery: '#00796B',
        primaryDark: '#00574B',
        primaryLight: '#E0F2F1',
        accent: '#26A69A',
        success: '#66BB6A',
        danger: '#EF5350',
        coral: '#EF5350',
        orange: '#EF5350',
        text: '#607D8B',
        heading: '#263238',
        heading2: '#37474F',
        gray1: '#90A4AE',
        bgColor: '#F7FBFA',
        border: '#E0E6E5',
        borderColor: '#E0E6E5',
        link: '#00796B',
        active: '#26A69A'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
