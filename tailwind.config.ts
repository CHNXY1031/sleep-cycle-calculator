import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#05070D",
        midnight: "#111A3A",
        aurora: "#8B5CF6",
        emerald: "#5EE7B7",
        moon: "#F4F1E8",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(94,231,183,.22), 0 18px 70px rgba(94,231,183,.16)",
        violet: "0 0 0 1px rgba(139,92,246,.30), 0 18px 70px rgba(139,92,246,.18)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseSlow: "pulseSlow 4s ease-in-out infinite",
        rise: "rise .7s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-3deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: ".45" },
          "50%": { opacity: ".8" },
        },
        rise: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
