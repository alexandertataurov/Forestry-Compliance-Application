# Design Tokens

This directory contains the design tokens foundation for the Forestry Compliance Application design system.

## Overview

Design tokens are the foundational design decisions that define our visual language. They are the single source of truth for colors, typography, spacing, and other design elements used across the application.

## Structure

- `design-tokens.json` - Source design tokens in JSON format
- `style-dictionary.config.json` - Style Dictionary build configuration
- `tailwind-tokens.json` - Generated tokens for Tailwind CSS integration
- `README.md` - This documentation

## Generated Files

The build process generates:
- `styles/design-tokens.css` - CSS custom properties for use in components
- `tokens/tailwind-tokens.json` - JSON format for Tailwind CSS integration

## Usage

### Building Tokens

```bash
npm run build-tokens
```

This command will:
1. Read the source tokens from `design-tokens.json`
2. Generate CSS custom properties in `styles/design-tokens.css`
3. Create Tailwind-compatible JSON in `tokens/tailwind-tokens.json`

### Using in CSS

```css
/* Import the generated CSS variables */
@import './styles/design-tokens.css';

/* Use the variables in your components */
.my-component {
  background-color: var(--color-brand-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}
```

### Using in Tailwind CSS

The generated `tailwind-tokens.json` can be imported into your Tailwind configuration to extend the theme with design tokens.

## Token Categories

### Colors
- **Brand Colors**: Primary, secondary, tertiary, and error colors
- **Neutral Colors**: Grayscale palette from 0-900
- **Surface Colors**: Background and surface colors
- **State Colors**: Success, warning, and info states

### Typography
- **Font Families**: Primary, SF, Roboto, and monospace fonts
- **Typography Scale**: Display, headline, title, subtitle, body, label, and caption styles

### Spacing
- **Spacing Scale**: XS to 4XL spacing values (4px to 96px)

### Border Radius
- **Radius Scale**: None to full radius values

### Elevation
- **Shadow Scale**: 0-5 elevation levels with Material Design shadows

### Motion
- **Duration**: Fast, normal, slow, and slower timing values
- **Easing**: Linear, ease-in, ease-out, and ease-in-out curves

### Opacity
- **Opacity Scale**: 0-100 opacity values

### Breakpoints
- **Responsive Breakpoints**: XS to 2XL screen sizes

## Design System Compliance

This token system follows:
- **Apple iOS 26+ (Liquid Glass)** design principles
- **Material Design 3** guidelines
- **WCAG 2.1 AA** accessibility standards
- **Cross-platform** compatibility (Web, iOS, Android)

## Maintenance

- **Never edit generated files directly** - they are auto-generated
- **Update source tokens** in `design-tokens.json`
- **Run build command** to regenerate outputs
- **Test changes** across all platforms and components

## Integration

The design tokens integrate with:
- **Tailwind CSS** for utility-first styling
- **Radix UI** components for consistent theming
- **CSS Custom Properties** for dynamic theming
- **Storybook** for component documentation
