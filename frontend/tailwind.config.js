/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        sm: "var(--breakpoint-sm)",
        md: "var(--breakpoint-md)",
        lg: "var(--breakpoint-lg)",
        xl: "var(--breakpoint-xl)",
        "2xl": "var(--breakpoint-2xl)",
      },
    },
    screens: {
      xs: "var(--breakpoint-xs)",
      sm: "var(--breakpoint-sm)",
      md: "var(--breakpoint-md)",
      lg: "var(--breakpoint-lg)",
      xl: "var(--breakpoint-xl)",
      "2xl": "var(--breakpoint-2xl)",
    },
    extend: {
      colors: {
        // Design System Brand Colors
        brand: {
          primary: "var(--color-brand-primary)",
          "on-primary": "var(--color-brand-on-primary)",
          secondary: "var(--color-brand-secondary)",
          "on-secondary": "var(--color-brand-on-secondary)",
          tertiary: "var(--color-brand-tertiary)",
          "on-tertiary": "var(--color-brand-on-tertiary)",
          error: "var(--color-brand-error)",
          "on-error": "var(--color-brand-on-error)",
        },
        // Neutral Color Scale
        neutral: {
          0: "var(--color-neutral-0)",
          10: "var(--color-neutral-10)",
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          400: "var(--color-neutral-400)",
          500: "var(--color-neutral-500)",
          600: "var(--color-neutral-600)",
          700: "var(--color-neutral-700)",
          800: "var(--color-neutral-800)",
          900: "var(--color-neutral-900)",
        },
        // Surface Colors
        surface: {
          bg: "var(--color-surface-bg)",
          "bg-variant": "var(--color-surface-bg-variant)",
          "on-surface": "var(--color-surface-on-surface)",
          "on-variant": "var(--color-surface-on-variant)",
          border: "var(--color-surface-border)",
          "border-variant": "var(--color-surface-border-variant)",
        },
        // State Colors
        state: {
          success: "var(--color-state-success)",
          "on-success": "var(--color-state-on-success)",
          warning: "var(--color-state-warning)",
          "on-warning": "var(--color-state-on-warning)",
          info: "var(--color-state-info)",
          "on-info": "var(--color-state-on-info)",
        },
        // Legacy compatibility (mapped to design tokens)
        border: "var(--color-surface-border)",
        input: "var(--color-surface-border)",
        ring: "var(--color-brand-primary)",
        background: "var(--color-surface-bg)",
        foreground: "var(--color-surface-on-surface)",
        primary: {
          DEFAULT: "var(--color-brand-primary)",
          foreground: "var(--color-brand-on-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-brand-secondary)",
          foreground: "var(--color-brand-on-secondary)",
        },
        destructive: {
          DEFAULT: "var(--color-brand-error)",
          foreground: "var(--color-brand-on-error)",
        },
        muted: {
          DEFAULT: "var(--color-neutral-100)",
          foreground: "var(--color-neutral-600)",
        },
        accent: {
          DEFAULT: "var(--color-brand-tertiary)",
          foreground: "var(--color-brand-on-tertiary)",
        },
        popover: {
          DEFAULT: "var(--color-surface-bg)",
          foreground: "var(--color-surface-on-surface)",
        },
        card: {
          DEFAULT: "var(--color-surface-bg)",
          foreground: "var(--color-surface-on-surface)",
        },
      },
      borderRadius: {
        none: "var(--radius-none)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      spacing: {
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
        "4xl": "var(--spacing-4xl)",
      },
      fontFamily: {
        primary: "var(--typography-font-family-primary)",
        sf: "var(--typography-font-family-sf)",
        roboto: "var(--typography-font-family-roboto)",
        mono: "var(--typography-font-family-mono)",
      },
      fontSize: {
        display: [
          "var(--typography-scale-display-size)",
          {
            lineHeight: "var(--typography-scale-display-line)",
            letterSpacing: "var(--typography-scale-display-letter)",
            fontWeight: "var(--typography-scale-display-weight)",
          },
        ],
        headline: [
          "var(--typography-scale-headline-size)",
          {
            lineHeight: "var(--typography-scale-headline-line)",
            letterSpacing: "var(--typography-scale-headline-letter)",
            fontWeight: "var(--typography-scale-headline-weight)",
          },
        ],
        title: [
          "var(--typography-scale-title-size)",
          {
            lineHeight: "var(--typography-scale-title-line)",
            letterSpacing: "var(--typography-scale-title-letter)",
            fontWeight: "var(--typography-scale-title-weight)",
          },
        ],
        subtitle: [
          "var(--typography-scale-subtitle-size)",
          {
            lineHeight: "var(--typography-scale-subtitle-line)",
            letterSpacing: "var(--typography-scale-subtitle-letter)",
            fontWeight: "var(--typography-scale-subtitle-weight)",
          },
        ],
        body: [
          "var(--typography-scale-body-size)",
          {
            lineHeight: "var(--typography-scale-body-line)",
            letterSpacing: "var(--typography-scale-body-letter)",
            fontWeight: "var(--typography-scale-body-weight)",
          },
        ],
        "body-large": [
          "var(--typography-scale-body-large-size)",
          {
            lineHeight: "var(--typography-scale-body-large-line)",
            letterSpacing: "var(--typography-scale-body-large-letter)",
            fontWeight: "var(--typography-scale-body-large-weight)",
          },
        ],
        "body-small": [
          "var(--typography-scale-body-small-size)",
          {
            lineHeight: "var(--typography-scale-body-small-line)",
            letterSpacing: "var(--typography-scale-body-small-letter)",
            fontWeight: "var(--typography-scale-body-small-weight)",
          },
        ],
        label: [
          "var(--typography-scale-label-size)",
          {
            lineHeight: "var(--typography-scale-label-line)",
            letterSpacing: "var(--typography-scale-label-letter)",
            fontWeight: "var(--typography-scale-label-weight)",
          },
        ],
        "label-small": [
          "var(--typography-scale-label-small-size)",
          {
            lineHeight: "var(--typography-scale-label-small-line)",
            letterSpacing: "var(--typography-scale-label-small-letter)",
            fontWeight: "var(--typography-scale-label-small-weight)",
          },
        ],
        caption: [
          "var(--typography-scale-caption-size)",
          {
            lineHeight: "var(--typography-scale-caption-line)",
            letterSpacing: "var(--typography-scale-caption-letter)",
            fontWeight: "var(--typography-scale-caption-weight)",
          },
        ],
      },
      boxShadow: {
        0: "var(--elevation-0)",
        1: "var(--elevation-1)",
        2: "var(--elevation-2)",
        3: "var(--elevation-3)",
        4: "var(--elevation-4)",
        5: "var(--elevation-5)",
      },
      opacity: {
        0: "var(--opacity-0)",
        25: "var(--opacity-25)",
        50: "var(--opacity-50)",
        75: "var(--opacity-75)",
        100: "var(--opacity-100)",
      },
      transitionDuration: {
        fast: "var(--motion-duration-fast)",
        normal: "var(--motion-duration-normal)",
        slow: "var(--motion-duration-slow)",
        slower: "var(--motion-duration-slower)",
      },
      transitionTimingFunction: {
        linear: "var(--motion-easing-linear)",
        "ease-in": "var(--motion-easing-ease-in)",
        "ease-out": "var(--motion-easing-ease-out)",
        "ease-in-out": "var(--motion-easing-ease-in-out)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
