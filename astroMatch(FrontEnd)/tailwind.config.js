import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "#FFD700",    // Dorado
        secondary: "#f1db5b", 
       


      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          primary: "#FFD700",    // Dorado
          secondary: "#FFFACD",
           // Amarillo flojo
        },
        dark: {
          primary: "#FFD700",
          secondary: "#FFFACD",
            // Amarillo flojo
        },
      },
    })
  ],
}

