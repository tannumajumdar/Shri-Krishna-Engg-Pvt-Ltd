import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.5rem", lg: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        /* ------------------------------------------------------------------
         * Semantic tokens — the only colours that change with the theme.
         * Backed by CSS variables in globals.css, so flipping light/dark is a
         * single class on <html> rather than a dark: variant on every node.
         *
         * Sections that are dark in BOTH themes (hero, products, quality, CTA,
         * footer) keep their literal navy-* values on purpose.
         * ---------------------------------------------------------------- */
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        "ink-muted": "rgb(var(--ink-muted) / <alpha-value>)",
        "ink-faint": "rgb(var(--ink-faint) / <alpha-value>)",
        hairline: "rgb(var(--hairline) / <alpha-value>)",

        /* Built around the royal blue of the SKE mark, which sits at navy-600. */
        navy: {
          50: "#EFF3FB",
          100: "#DCE4F6",
          200: "#BAC9EC",
          300: "#8EA5DC",
          400: "#5F7CC7",
          500: "#3B5AAF",
          600: "#1B3A8B",
          700: "#162E6D",
          800: "#112250",
          900: "#0C1936",
          950: "#070F22",
        },
        /* Brushed aluminium greys */
        alu: {
          50: "#F7F8F9",
          100: "#EFF1F3",
          200: "#E1E5E9",
          300: "#CBD2D9",
          400: "#A8B3BE",
          500: "#8A97A5",
          600: "#6C7A89",
          700: "#54616E",
          800: "#3D4854",
          900: "#2A323C",
        },
        /* The lime of the K, used sparingly on rules, counters and hovers.
           400 is for dark grounds; 600 is the version that holds contrast
           against white. */
        accent: {
          400: "#9ED14F",
          500: "#8CC63F",
          600: "#6E9F2B",
        },
        /* Full brand-green scale — derived from the logo K (#8CC63F).
           Used on primary buttons, CTA highlights and keyword accents
           so the entire site speaks the same green. */
        brand: {
          50:  "#F4FBE8",
          100: "#E4F5C8",
          200: "#CBE89D",
          300: "#AED86E",
          400: "#9ED14F",
          500: "#8CC63F",
          600: "#6E9F2B",
          700: "#5A8322",
          800: "#486A1C",
          900: "#3A5617",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        label: "0.22em",
      },
      fontSize: {
        "display-sm": ["clamp(2rem,1.4rem + 2.6vw,3.25rem)", { lineHeight: "1.06", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(2.5rem,1.6rem + 4vw,4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        "display-lg": ["clamp(3rem,1.8rem + 5.6vw,6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.04em" }],
      },
      backgroundImage: {
        "alu-sheen":
          "linear-gradient(100deg,transparent 8%,rgba(255,255,255,0.55) 26%,rgba(255,255,255,0.9) 40%,rgba(255,255,255,0.55) 54%,transparent 74%)",
        "navy-fade": "linear-gradient(180deg,#070F22 0%,#0C1936 55%,#112250 100%)",
        "grid-fine":
          "linear-gradient(to right,rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,.06) 1px,transparent 1px)",
      },
      backgroundSize: { "grid-fine": "72px 72px" },
      boxShadow: {
        lift: "0 1px 2px rgba(8,16,32,.06),0 12px 32px -12px rgba(8,16,32,.18)",
        "lift-lg": "0 2px 4px rgba(8,16,32,.06),0 32px 64px -24px rgba(8,16,32,.28)",
        inset01: "inset 0 1px 0 rgba(255,255,255,.08)",
      },
      transitionTimingFunction: {
        brand: "cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        sheen: {
          "0%": { transform: "translateX(-120%) skewX(-16deg)" },
          "100%": { transform: "translateX(220%) skewX(-16deg)" },
        },
        "scroll-hint": {
          "0%": { transform: "translateY(-40%)", opacity: "0" },
          "35%": { opacity: "1" },
          "100%": { transform: "translateY(120%)", opacity: "0" },
        },
      },
      animation: {
        sheen: "sheen 1.1s ease-brand",
        "scroll-hint": "scroll-hint 2s cubic-bezier(0.22,1,0.36,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
