/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        moveStars: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(1000px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        moveStars: "moveStars 200s linear infinite",
        moveStarsSlow: "moveStars 200s linear infinite",
        twinkle: "twinkle 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
}
