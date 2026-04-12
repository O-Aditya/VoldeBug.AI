/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1024px",
      xl: "1440px",
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
      colors: {
        bg: {
          DEFAULT: "var(--color-bg)",
          elevated: "var(--color-bg-elevated)",
          overlay: "var(--color-bg-overlay)",
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          hover: "var(--color-surface-hover)",
        },
        foreground: "var(--color-fg)",
        "foreground-muted": "var(--color-fg-muted)",
        "foreground-subtle": "var(--color-fg-subtle)",
        card: {
          DEFAULT: "var(--color-card)",
          hover: "var(--color-card-hover)",
          border: "var(--color-card-border)",
          "border-hover": "var(--color-card-border-hover)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
          muted: "var(--color-accent-muted)",
          glow: "var(--color-accent-glow)",
          "glow-strong": "var(--color-accent-glow-strong)",
          surface: "var(--color-accent-surface)",
          "surface-hover": "var(--color-accent-surface-hover)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          glow: "var(--color-success-glow)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          glow: "var(--color-warning-glow)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          glow: "var(--color-error-glow)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          glow: "var(--color-info-glow)",
        },
        input: {
          DEFAULT: "var(--color-input)",
          border: "var(--color-input-border)",
          focus: "var(--color-input-focus)",
        },
        ring: "var(--color-ring)",
        xp: {
          bar: "var(--color-xp-bar)",
          glow: "var(--color-xp-glow)",
          track: "var(--color-xp-track)",
        },
        badge: {
          gold: "var(--color-badge-gold)",
          goldGlow: "var(--color-badge-gold-glow)",
          silver: "var(--color-badge-silver)",
          silverGlow: "var(--color-badge-silver-glow)",
          bronze: "var(--color-badge-bronze)",
          bronzeGlow: "var(--color-badge-bronze-glow)",
          locked: "var(--color-badge-locked)",
        },
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "var(--shadow-glow)",
        "glow-accent": "var(--shadow-glow-accent)",
        inset: "var(--shadow-inset)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      spacing: {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        trophyGlow: {
          "0%, 100%": {
            filter: "drop-shadow(0 0 4px rgba(251, 191, 36, 0.3))",
          },
          "50%": {
            filter: "drop-shadow(0 0 12px rgba(251, 191, 36, 0.6))",
          },
        },
        xpGlow: {
          "0%, 100%": { boxShadow: "0 0 8px var(--color-xp-glow)" },
          "50%": { boxShadow: "0 0 20px var(--color-xp-glow)" },
        },
        "confetti-burst": {
          "0%": { transform: "scale(0)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 400ms var(--ease-out) both",
        "fade-in-up": "fade-in-up 400ms var(--ease-out) both",
        scaleIn: "scaleIn 400ms var(--ease-out) both",
        shimmer: "shimmer 2s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        trophyGlow: "trophyGlow 2s ease-in-out infinite",
        xpGlow: "xpGlow 1.5s ease-in-out infinite",
        confettiBurst: "confetti-burst 600ms ease-out forwards",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
        celebration: "var(--duration-celebration)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        DEFAULT: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
