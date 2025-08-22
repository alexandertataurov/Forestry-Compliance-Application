# Storybook Documentation

This document provides comprehensive information about the Storybook setup for the Forestry Compliance Application design system.

## Overview

Storybook serves as our design system documentation and component playground, showcasing all design tokens, components, and accessibility features in an interactive environment.

## Getting Started

### Installation

Storybook is already configured and ready to use. To start the development server:

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`.

### Building for Production

To build a static version of Storybook:

```bash
npm run build-storybook
```

The built files will be available in the `storybook-static` directory.

## Storybook Structure

### Design System Overview (`DesignSystem.stories.tsx`)

The main design system showcase with three main sections:

1. **Design Tokens** - Complete documentation of colors, typography, spacing, and motion
2. **Components** - Interactive showcase of all UI components
3. **Playground** - Interactive component customization

#### Design Tokens Section

- **Colors**: Brand, neutral, surface, and state colors with usage guidelines
- **Typography**: Complete typography scale with font families and specifications
- **Spacing**: Consistent spacing system using 4px base unit
- **Motion**: Animation and transition utilities with examples

#### Components Section

- **Buttons**: All button variants, sizes, and accessibility features
- **Forms**: Input fields, labels, and form elements
- **Layout**: Container and grid system examples
- **Accessibility**: WCAG 2.1 AA compliant features

### Individual Component Stories

Each component has its own dedicated story file with comprehensive documentation:

#### Button Component (`Button.stories.tsx`)

- **Variants**: All button variants with use cases
- **Sizes**: Different button sizes for various contexts
- **Interactive**: Loading states, icons, and hover effects
- **Accessibility**: ARIA labels, touch targets, and keyboard navigation
- **Usage Examples**: Common button patterns and use cases

#### Design Tokens (`DesignTokens.stories.tsx`)

- **Color System**: Complete color documentation with accessibility validation
- **Typography System**: Font families, scales, and usage guidelines

## Storybook Configuration

### Main Configuration (`.storybook/main.ts`)

```typescript
const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(ts|tsx)',
    '../components/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    '@storybook/addon-viewport',
  ],
  // ... other configuration
};
```

### Preview Configuration (`.storybook/preview.ts`)

- **Accessibility**: WCAG 2.1 AA compliance testing
- **Viewports**: Mobile, tablet, desktop, and wide desktop
- **Backgrounds**: Design token-based background colors
- **Documentation**: Auto-generated documentation with source code

## Addons

### Accessibility Addon (`@storybook/addon-a11y`)

Automatically tests components for accessibility issues:

- Color contrast validation
- ARIA attribute checking
- Keyboard navigation testing
- Screen reader compatibility

### Viewport Addon (`@storybook/addon-viewport`)

Test components across different screen sizes:

- **Mobile**: 375px × 667px
- **Tablet**: 768px × 1024px
- **Desktop**: 1200px × 800px
- **Wide Desktop**: 1920px × 1080px

### Backgrounds Addon

Test components on different backgrounds:

- Surface backgrounds (white, light gray)
- Brand colors (primary, secondary)
- Neutral colors (white, dark)

## Design System Integration

### Design Tokens

All design tokens are automatically available in Storybook through CSS custom properties:

```css
/* Colors */
--color-brand-primary: #335CFF;
--color-brand-secondary: #6B8AFF;
--color-brand-tertiary: #00BFA5;

/* Typography */
--typography-scale-display-size: 48px;
--typography-scale-headline-size: 32px;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
```

### Component Documentation

Each component story includes:

- **Description**: Component purpose and usage
- **Props**: All available props with descriptions
- **Examples**: Interactive examples with different configurations
- **Accessibility**: WCAG compliance information
- **Best Practices**: Usage guidelines and recommendations

## Accessibility Testing

### Automated Testing

Storybook automatically runs accessibility tests on all components:

1. **Color Contrast**: Ensures 4.5:1 minimum ratio for normal text
2. **ARIA Attributes**: Validates proper ARIA usage
3. **Keyboard Navigation**: Tests tab order and focus management
4. **Screen Reader**: Checks for proper labeling and announcements

### Manual Testing

Use the accessibility addon to:

- View accessibility violations
- Test with different color vision types
- Validate keyboard navigation
- Check screen reader compatibility

## Component Development Workflow

### Creating New Stories

1. **Create Story File**: Add `ComponentName.stories.tsx` in the stories directory
2. **Define Meta**: Set up component metadata and controls
3. **Add Stories**: Create different story variants
4. **Document**: Add descriptions and usage examples
5. **Test**: Verify accessibility and responsiveness

### Example Story Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Component } from '../components/ui/component';

const meta: Meta<typeof Component> = {
  title: 'Components/ComponentName',
  component: Component,
  parameters: {
    docs: {
      description: {
        component: 'Component description and usage guidelines.',
      },
    },
  },
  argTypes: {
    // Define controls for interactive testing
  },
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    // Default props
  },
};

export const Variants: Story = {
  render: () => (
    // Show all variants
  ),
};
```

## Best Practices

### Story Organization

- Group related components under meaningful categories
- Use descriptive story names
- Include both simple and complex examples
- Document accessibility features

### Documentation

- Provide clear component descriptions
- Include usage guidelines and best practices
- Show common use cases and patterns
- Document accessibility requirements

### Testing

- Test all component variants
- Verify accessibility compliance
- Test responsive behavior
- Validate design token integration

## Troubleshooting

### Common Issues

1. **Design Tokens Not Loading**
   - Ensure `globals.css` is imported in preview
   - Check that design tokens are built correctly
   - Verify CSS custom properties are available

2. **Component Not Rendering**
   - Check component imports
   - Verify TypeScript types
   - Ensure all dependencies are installed

3. **Accessibility Violations**
   - Review ARIA attributes
   - Check color contrast ratios
   - Validate keyboard navigation

### Debugging

- Use Storybook's built-in debugging tools
- Check browser console for errors
- Verify component props and types
- Test in different viewports and backgrounds

## Contributing

### Adding New Components

1. Create the component in `components/ui/`
2. Add comprehensive stories
3. Include accessibility features
4. Document usage guidelines
5. Test across different scenarios

### Updating Documentation

1. Update component stories
2. Add new examples and use cases
3. Update design token documentation
4. Verify accessibility compliance
5. Test in different environments

## Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Accessibility Addon](https://github.com/storybookjs/storybook/tree/main/addons/a11y)
- [Design System Best Practices](https://www.designsystem.digital.gov/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For Storybook-related issues or questions:

1. Check the troubleshooting section
2. Review component documentation
3. Test in different environments
4. Consult the development team

---

This documentation is maintained by the development team and should be updated as the design system evolves.


