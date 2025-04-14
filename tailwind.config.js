/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
import twScrollbar from 'tailwind-scrollbar';
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
      colors: {
        secondaryColor: "#FFCC00",
        paragraphColor: "#c0c0c0",
        whiteColor: "#ffffff",
        whiteSmoke: "#F5F5F5",
        whiteSmokeLight: "#FAFAFA",
        blackLight: "#2b4055",
        silverColor: "#bfbfbf",
        darkColorLight: "#171717",
        greenDark: "#2a9d8f",
      },
      keyframes: {
        zoom3d: {
          "0%, 100%": { transform: "scale3d(1, 1, 1)" },
          "50%": { transform: "scale3d(1.2, 1.2, 1.2)" },
        },
      },
      animation: {
        zoom3d: "zoom3d 1s ease-in-out infinite",
      },
    },
  },
  darkMode: ["selector", '[class~="dark"]'],
  plugins: [PrimeUI, twScrollbar],
};
