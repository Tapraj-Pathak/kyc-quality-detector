/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#086C01",
          dark: "#065200",
          soft: "#E7F6E6",
          accent: "#14A44D",
        },
        canvas: "#F4F7F5",
        ink: "#152316",
        warn: "#D4A40B",
        danger: "#D93C2E",
      },
      boxShadow: {
        card: "0 18px 45px rgba(8, 108, 1, 0.08)",
        soft: "0 10px 30px rgba(15, 23, 42, 0.08)",
        glow: "0 0 0 6px rgba(20, 164, 77, 0.12)",
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(20, 164, 77, 0.0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(20, 164, 77, 0.16)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 1.8s ease-in-out infinite",
        "slide-up": "slideUp 300ms ease-out",
      },
    },
  },
  plugins: [],
};
