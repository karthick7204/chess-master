/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chesscom: {
          bg: '#262522',
          panel: '#21201d',
          card: '#2b2926',
          border: '#363430',
          button: '#312e2b',
          buttonHover: '#3d3a36',
          green: '#81b64c',
          greenHover: '#a3d160',
          brownDark: '#b58863',
          brownLight: '#f0d9b5'
        }
      }
    },
  },
  plugins: [],
}
