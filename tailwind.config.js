/** @type {import('tailwindcss').Config} */
module.exports = {
  assets: ["./assets/fonts/"], // 👈 add this line
  content: [
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}", // 👈 important for Expo Router
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        accent: "#AB8BFF",
        light: {
          100: "#D6C6FF",
          200: "#A8B5DB",
          300: "#9CA4AB",
        },
        dark: {
          100: "#221f3d",
          200: "#0f0d23",
        },
      },
    },
  },
  plugins: [],
};
