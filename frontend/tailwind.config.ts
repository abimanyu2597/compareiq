import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#030712",
        surface: "rgba(15, 20, 40, 0.7)",
        indigo: {
          DEFAULT: "#6366f1",
          dim: "rgba(99, 102, 241, 0.15)",
        },
        violet: "#8b5cf6",
        cyan: "#06b6d4",
        brand: {
          green: "#10b981",
          amber: "#f59e0b",
          red: "#ef4444",
          pink: "#ec4899",
        },
        border: {
          DEFAULT: "rgba(99, 102, 241, 0.12)",
          hover: "rgba(99, 102, 241, 0.4)",
        },
        text: {
          DEFAULT: "#f1f5f9",
          secondary: "#cbd5e1",
          muted: "#94a3b8",
          dim: "#475569",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "Helvetica Neue", "sans-serif"],
        mono: ["DM Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.2)",
        "glow-lg": "0 0 80px rgba(99, 102, 241, 0.35)",
        panel: "0 20px 60px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite",
        blink: "blink 1s infinite",
        spin: "spin 0.7s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
