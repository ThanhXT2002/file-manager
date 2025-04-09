/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      ".flex__middle": {
        display: "flex",
        "justify-content": "center",
        "align-items": "center",
      },
      ".flex__start": {
        display: "flex",
        "justify-content": "start",
        "align-items": "center",
      },
      ".flex__between": {
        display: "flex",
        "justify-content": "space-between",
        "align-items": "center",
      },
      ".flex__evenly": {
        display: "flex",
        "justify-content": "space-evenly",
        "align-items": "center",
      },
    },
  },
  darkMode: ["selector", '[class~="dark"]'],
  plugins: [PrimeUI],
};
