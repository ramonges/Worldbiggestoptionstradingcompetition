/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        columbia: {
          light: "#b9d9eb",
          DEFAULT: "#1b5fa7",
          dark: "#003d7c",
        },
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 26, 36, 0.12)",
      },
    },
  },
  plugins: [],
};
