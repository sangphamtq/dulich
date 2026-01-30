import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ========= BRAND ========= */
        primary: {
          DEFAULT: "#16A34A", // CTA chính
          hover: "#15803D",
          soft: "rgba(22,163,74,0.15)",
        },

        secondary: {
          DEFAULT: "#2563EB", // link, action phụ
          hover: "#1D4ED8",
          soft: "rgba(37,99,235,0.15)",
        },

        accent: {
          DEFAULT: "#CA8A04", // warning / highlight
        },

        /* ========= BACKGROUND ========= */
        surface: {
          DEFAULT: "#FFFFFF", // card
          muted: "#FFF4CC",   // nền vàng nhạt
        },

        /* ========= TEXT ========= */
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          disabled: "#9CA3AF",
          inverse: "#FFFFFF",
        },

        /* ========= BORDER ========= */
        border: {
          DEFAULT: "#E5E7EB",
          focus: "#16A34A",
        },
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },

      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.05)",
        focus: "0 0 0 2px rgba(22,163,74,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
