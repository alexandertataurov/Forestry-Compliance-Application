# React Component Library Setup Guide

## Overview

This document outlines the complete setup and architecture of the Forestry Compliance Application's React component library.

## 🏗️ Architecture

### Technology Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Radix UI** - Accessible, unstyled UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority (CVA)** - Component variant management
- **Storybook** - Component documentation and testing

### Project Structure
```
frontend/
├── components/
│   ├── ui/                    # Core UI components
│   │   ├── index.ts          # Main export file
│   │   ├── README.md         # Component documentation
│   │   ├── utils.ts          # Utility functions
│   │   ├── button.tsx        # Button component
│   │   ├── input.tsx         # Input component
│   │   └── ...               # Other components
│   ├── calculator/           # Forestry-specific components
│   └── figma/               # Design system components
├── stories/                  # Storybook stories
├── styles/                   # Global styles
└── utils/                    # Utility functions
```

## 🚀 Setup Instructions

### 1. Dependencies Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Storybook
```bash
npm run storybook
```

### 4. Type Checking
```bash
npm run type-check
```

### 5. Linting
```bash
npm run lint
```

## 📦 Component Categories

### Core UI Components
Essential building blocks for any interface:
- **Button** - Interactive elements
- **Input** - Form inputs
- **Card** - Content containers
- **Badge** - Status indicators

### Layout Components
Structure and navigation:
- **Sidebar** - Navigation sidebar
- **Navigation** - Main navigation
- **Breadcrumb** - Page navigation
- **Sheet/Drawer** - Slide-out panels

### Data Display
Information presentation:
- **DataTable** - Tabular data
- **Chart** - Data visualization
- **StatusBadge** - Status indicators
- **ProgressIndicator** - Progress tracking

### Forestry-Specific
Domain-specific components:
- **SpeciesSelector** - Tree species selection
- **MeasurementInput** - Forestry measurements
- **GPSInput** - GPS coordinates
- **VolumeCalculator** - Volume calculations

### Form Components
Data entry and validation:
- **Form** - Form wrapper
- **FormValidation** - Validation utilities
- **Label** - Form labels
- **RadioGroup** - Radio buttons

### Feedback Components
User communication:
- **Toast** - Notifications
- **Alert** - Important messages
- **Tooltip** - Helpful hints
- **Dialog** - Modal interactions

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: 222.2 84% 4.9%;
--primary-foreground: 210 40% 98%;

/* Secondary Colors */
--secondary: 210 40% 96%;
--secondary-foreground: 222.2 84% 4.9%;

/* Accent Colors */
--accent: 210 40% 96%;
--accent-foreground: 222.2 84% 4.9%;

/* Destructive Colors */
--destructive: 0 84.2% 60.2%;
--destructive-foreground: 210 40% 98%;
```

### Typography Scale
```css
/* Font Sizes */
text-xs: 0.75rem
text-sm: 0.875rem
text-base: 1rem
text-lg: 1.125rem
text-xl: 1.25rem
text-2xl: 1.5rem
```

### Spacing Scale
```css
/* Spacing */
space-1: 0.25rem
space-2: 0.5rem
space-3: 0.75rem
space-4: 1rem
space-6: 1.5rem
space-8: 2rem
```

## 🔧 Component Development

### Creating New Components

1. **File Structure**
```tsx
// components/ui/my-component.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const myComponentVariants = cva(
  "base-styles",
  {
    variants: {
      variant: {
        default: "default-styles",
        secondary: "secondary-styles",
      },
      size: {
        default: "default-size",
        sm: "small-size",
        lg: "large-size",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(myComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";

export { MyComponent, myComponentVariants };
```

2. **Export in index.ts**
```tsx
// components/ui/index.ts
export { MyComponent, myComponentVariants } from './my-component';
```

3. **Create Storybook Story**
```tsx
// stories/ui/MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from '@/components/ui';

const meta: Meta<typeof MyComponent> = {
  title: 'UI/MyComponent',
  component: MyComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
```

### Component Guidelines

1. **Accessibility**
   - Use semantic HTML
   - Include ARIA labels
   - Support keyboard navigation
   - Ensure color contrast

2. **TypeScript**
   - Define proper interfaces
   - Use generic types where appropriate
   - Export type definitions

3. **Styling**
   - Use Tailwind CSS classes
   - Follow design system tokens
   - Support dark mode
   - Be responsive

4. **Testing**
   - Write unit tests
   - Include integration tests
   - Test accessibility features

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Optimization
- Touch-friendly targets (min 44px)
- Simplified navigation
- Optimized forms
- Reduced animations

## ♿ Accessibility Features

### ARIA Support
- Proper roles and labels
- Live regions for updates
- Focus management
- Screen reader compatibility

### Keyboard Navigation
- Tab order
- Enter/Space activation
- Escape key handling
- Arrow key navigation

### Color and Contrast
- WCAG AA compliance
- High contrast support
- Color-blind friendly
- Dark mode support

## 🧪 Testing Strategy

### Unit Tests
```tsx
// __tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/ui';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent>Test</MyComponent>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Integration Tests
- Component interactions
- Form submissions
- Navigation flows
- Data flow

### Accessibility Tests
- Screen reader testing
- Keyboard navigation
- Color contrast
- Focus management

## 📚 Documentation

### Storybook
- Interactive examples
- Props documentation
- Usage guidelines
- Accessibility notes

### README Files
- Component overview
- Usage examples
- API reference
- Best practices

### Code Comments
- Complex logic explanation
- API documentation
- Usage examples
- Deprecation notices

## 🔄 Maintenance

### Version Control
- Semantic versioning
- Changelog maintenance
- Breaking change documentation
- Migration guides

### Dependency Updates
- Regular security updates
- Performance improvements
- Bug fixes
- Feature additions

### Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Automated testing

## 🚀 Performance Optimization

### Bundle Size
- Tree shaking
- Code splitting
- Dynamic imports
- Bundle analysis

### Runtime Performance
- Memoization
- Lazy loading
- Virtual scrolling
- Optimized re-renders

### Build Optimization
- Vite configuration
- TypeScript compilation
- CSS optimization
- Asset optimization

## 📈 Monitoring and Analytics

### Error Tracking
- Error boundaries
- Error logging
- Performance monitoring
- User feedback

### Usage Analytics
- Component usage
- Performance metrics
- User interactions
- Accessibility compliance

This setup provides a robust foundation for building scalable, maintainable, and accessible React applications with a comprehensive component library.
