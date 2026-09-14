/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          saffron: "#F97316",
          deepOrange: "#EA580C",
          marigold: "#D97706",
          gold: "#F59E0B",
          darkRed: "#991B1B",
          vermilion: "#DC2626",
          templeGold: "#FEF3C7",
          cream: "#FFFBEB",
          darkSlate: "#0F172A",
          softBg: "#FAFAF9"
        }
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}
