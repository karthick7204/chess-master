/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chess: {
          dark: '#1e293b',
          boardDark: '#739552',
          boardLight: '#ebecd0',
          accent: '#38bdf8',
          gold: '#eab308'
        }
      }
    },
  },
  plugins: [],
}
