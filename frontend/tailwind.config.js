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
        "2xl": "1400px",
      },
    },
    screens: {
      // Forestry field operation breakpoints
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Device-specific breakpoints
      'mobile': '320px',
      'mobile-lg': '375px',
      'mobile-xl': '414px',
      'tablet': '768px',
      'tablet-lg': '1024px',
      'desktop': '1280px',
      'desktop-lg': '1536px',
      // Orientation breakpoints
      'portrait': { 'raw': '(orientation: portrait)' },
      'landscape': { 'raw': '(orientation: landscape)' },
      // Touch device breakpoints
      'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
      'no-touch': { 'raw': '(hover: hover) and (pointer: fine)' },
      // High DPI displays
      'retina': { 'raw': '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)' },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Forestry-specific colors
        forestry: {
          green: '#2D5016',
          'green-light': '#4A7C59',
          'green-dark': '#1A3D0F',
          brown: '#8B4513',
          'brown-light': '#A0522D',
          'brown-dark': '#654321',
          earth: '#D2B48C',
          'earth-light': '#F5DEB3',
          'earth-dark': '#BC8F8F',
        },
        // Field operation status colors
        status: {
          success: '#34C759',
          warning: '#FF9500',
          error: '#FF3B30',
          info: '#007AFF',
          offline: '#8E8E93',
        },
      },
      spacing: {
        // Enhanced spacing for touch interfaces
        'touch-xs': '8px',
        'touch-sm': '12px',
        'touch-md': '16px',
        'touch-lg': '24px',
        'touch-xl': '32px',
        'touch-2xl': '48px',
        // Safe area spacing
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontSize: {
        // Enhanced typography for field operations
        'field-xs': ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
        'field-sm': ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        'field-base': ['16px', { lineHeight: '24px', letterSpacing: '0.01em' }],
        'field-lg': ['18px', { lineHeight: '28px', letterSpacing: '0.01em' }],
        'field-xl': ['20px', { lineHeight: '28px', letterSpacing: '0.01em' }],
        'field-2xl': ['24px', { lineHeight: '32px', letterSpacing: '0.01em' }],
        'field-3xl': ['30px', { lineHeight: '36px', letterSpacing: '0.01em' }],
        // High contrast text for rugged devices
        'rugged-sm': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'rugged-base': ['18px', { lineHeight: '28px', fontWeight: '600' }],
        'rugged-lg': ['20px', { lineHeight: '32px', fontWeight: '600' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Touch-friendly border radius
        'touch': '12px',
        'touch-lg': '16px',
        'touch-xl': '20px',
      },
      minHeight: {
        // Touch-friendly minimum heights
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '56px',
        'touch-2xl': '64px',
      },
      minWidth: {
        // Touch-friendly minimum widths
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '56px',
        'touch-2xl': '64px',
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
        // Field operation animations
        "pulse-gps": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        "slide-up-field": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in-field": {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-gps": "pulse-gps 2s ease-in-out infinite",
        "slide-up-field": "slide-up-field 0.3s ease-out",
        "fade-in-field": "fade-in-field 0.2s ease-out",
      },
      // Enhanced shadows for field operations
      boxShadow: {
        'field': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'field-lg': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'field-xl': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'field-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      // Z-index scale for field operations
      zIndex: {
        'field-base': 10,
        'field-overlay': 20,
        'field-modal': 30,
        'field-tooltip': 40,
        'field-dropdown': 50,
        'field-sticky': 60,
        'field-fixed': 70,
        'field-popover': 80,
        'field-tooltip': 90,
        'field-modal': 100,
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for field operation utilities
    function({ addUtilities, theme }) {
      const fieldUtilities = {
        '.touch-target': {
          minHeight: theme('minHeight.touch'),
          minWidth: theme('minWidth.touch'),
        },
        '.touch-target-lg': {
          minHeight: theme('minHeight.touch-lg'),
          minWidth: theme('minWidth.touch-lg'),
        },
        '.safe-area-padding': {
          paddingTop: theme('spacing.safe-top'),
          paddingBottom: theme('spacing.safe-bottom'),
          paddingLeft: theme('spacing.safe-left'),
          paddingRight: theme('spacing.safe-right'),
        },
        '.field-focus': {
          outline: '2px solid',
          outlineColor: theme('colors.primary.DEFAULT'),
          outlineOffset: '2px',
        },
        '.field-disabled': {
          opacity: '0.5',
          pointerEvents: 'none',
        },
      };
      addUtilities(fieldUtilities);
    },
  ],
}
