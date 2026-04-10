/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom dark navy palette
        navy: {
          50: "#eef2ff",
          100: "#dce5ff",
          200: "#b9cbff",
          300: "#8aa8ff",
          400: "#5a7dff",
          500: "#3b5bdb",
          600: "#2541b2",
          700: "#1a2f80",
          800: "#111b42",
          900: "#0a0e17",
          950: "#060911",
        },
        // Anime accent colors
        anime: {
          cyan: "#06b6d4",
          purple: "#8b5cf6",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "slide-down": "slideDown 0.3s ease-out forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(6, 182, 212, 0.2)" },
          "50%": { boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        card: "0 4px 24px rgba(0, 0, 0, 0.3)",
        elevated: "0 8px 40px rgba(0, 0, 0, 0.45)",
        glow: "0 0 30px rgba(6, 182, 212, 0.12)",
        "glow-lg": "0 0 50px rgba(6, 182, 212, 0.2)",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #06b6d4, #8b5cf6)",
        "hero-gradient":
          "linear-gradient(180deg, transparent 0%, rgba(10, 14, 23, 0.8) 60%, rgba(10, 14, 23, 1) 100%)",
        "card-gradient":
          "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%)",
      },
      screens: {
        xs: "475px",
      },
    },
  },
  plugins: [],
};
