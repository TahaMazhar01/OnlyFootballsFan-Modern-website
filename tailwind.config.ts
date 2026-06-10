import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme tokens
        canvas: "#F8FAFC", // near-white background
        surface: "#FFFFFF",
        ink: "#0B1120", // primary text
        muted: "#5B6573", // secondary text
        line: "#E6EAF0", // borders
        // Brand
        accent: {
          DEFAULT: "#16E07A", // electric pitch green
          dark: "#0FB863",
          soft: "#E5FBEF",
        },
        navy: {
          DEFAULT: "#0A2540", // deep blue ink/depth
          light: "#16365C",
        },
        live: "#FF2D55", // live indicator red
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        // Slightly larger base scale for readability
        base: ["1.0625rem", { lineHeight: "1.7" }], // 17px
        lg: ["1.1875rem", { lineHeight: "1.7" }], // 19px
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(11, 17, 32, 0.08)",
        lift: "0 18px 48px -12px rgba(11, 17, 32, 0.18)",
        glow: "0 8px 32px -4px rgba(22, 224, 122, 0.45)",
      },
      backgroundImage: {
        "pitch-gradient":
          "radial-gradient(1200px 600px at 85% -10%, rgba(22,224,122,0.18), transparent 60%), radial-gradient(900px 500px at 0% 0%, rgba(10,37,64,0.10), transparent 55%)",
        "accent-gradient": "linear-gradient(135deg, #16E07A 0%, #0FB863 100%)",
      },
      keyframes: {
        "pulse-live": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "pulse-live": "pulse-live 1.4s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
