/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "gochujang-red": "#780000",
        "crimson-blaze": "#C1121F",
        "varden": "#AE1F23",
        "cosmos-blue": "#003049",
        "blue-marble": "#669BBC",
      }
    },
  },
  plugins: [],
}
