/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'product-sans': ['Product Sans', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

