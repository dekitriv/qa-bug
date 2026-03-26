import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#141414",
        fog: "#f3efe5",
        brass: "#9f7a31",
        rust: "#7f3b1f",
        slate: "#5d6470",
        steel: "#d7d2c8"
      },
      fontFamily: {
        display: ["'Bodoni MT'", "'Iowan Old Style'", "serif"],
        body: ["'Segoe UI Variable'", "'Trebuchet MS'", "sans-serif"],
        mono: ["'Consolas'", "'Courier New'", "monospace"]
      },
      boxShadow: {
        plate: "0 18px 50px rgba(20, 20, 20, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

