/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      
    },
    extend: {
      colors: {
        "primary-color": "var(--primary-color)",
        "secondary-color": "var(--secondary-color)",
        "primary-dark-color": "var(--primary-dark-color)",
      },
      height: {
        '128': '32rem',
        '144': '36rem'
      },
      width: {
        '128': '32rem',
        '144': '36rem'
      }
    },
  },
  plugins: [],
}

