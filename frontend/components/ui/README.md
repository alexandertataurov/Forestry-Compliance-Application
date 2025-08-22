# Forestry Compliance UI Component Library

A comprehensive React component library built with TypeScript, Radix UI, and Tailwind CSS for forestry compliance applications.

## 🚀 Quick Start

```tsx
import { Button, Card, Input } from '@/components/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Enter data..." />
      <Button variant="default">Submit</Button>
    </Card>
  );
}
```

## 📦 Available Components

### Core UI Components
- **Button** - Versatile button with multiple variants and sizes
- **Input** - Form input with validation support
- **Card** - Container component for content organization
- **Badge** - Status and label indicators
- **Select** - Dropdown selection component
- **Checkbox** - Form checkbox with validation
- **Switch** - Toggle switch component
- **Slider** - Range slider component
- **Progress** - Progress indicator
- **Tabs** - Tabbed interface component

### Layout Components
- **Sidebar** - Navigation sidebar with collapsible sections
- **Navigation** - Main navigation component
- **Breadcrumb** - Navigation breadcrumbs
- **Separator** - Visual separator component
- **Sheet** - Slide-out panel component
- **Drawer** - Drawer component for mobile
- **Dialog** - Modal dialog component
- **Alert Dialog** - Confirmation dialog

### Data Display
- **DataTable** - Advanced data table with sorting/filtering
- **Table** - Basic table component
- **Chart** - Data visualization components
- **StatusBadge** - Status indicators for compliance
- **ProgressIndicator** - Progress tracking components

### Forestry-Specific Components
- **SpeciesSelector** - Tree species selection
- **MeasurementInput** - Forestry measurement inputs
- **GPSInput** - GPS coordinate input
- **NumericInput** - Numeric input with validation
- **VolumeCalculator** - Volume calculation components

### Form Components
- **Form** - Form wrapper with validation
- **FormValidation** - Form validation utilities
- **Label** - Form labels
- **Textarea** - Multi-line text input
- **RadioGroup** - Radio button groups
- **ToggleGroup** - Toggle button groups

### Feedback Components
- **Toast** - Notification system
- **Alert** - Alert messages
- **Tooltip** - Tooltip component
- **HoverCard** - Hover information card
- **Popover** - Popover component

## 🎨 Design System

### Color Palette
- **Primary** - Main brand colors
- **Secondary** - Supporting colors
- **Accent** - Highlight colors
- **Destructive** - Error/warning colors
- **Muted** - Subtle background colors

### Typography
- **Font Family** - System fonts with fallbacks
- **Font Sizes** - Consistent scale (xs, sm, base, lg, xl, 2xl, etc.)
- **Font Weights** - Light, normal, medium, semibold, bold

### Spacing
- **Consistent spacing scale** using Tailwind's spacing system
- **Responsive breakpoints** for mobile-first design

## 🔧 Component Variants

### Button Variants
```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon Only</Button>
```

## 📱 Responsive Design

All components are built with mobile-first responsive design:
- **Mobile** - Optimized for touch interactions
- **Tablet** - Adaptive layouts
- **Desktop** - Full feature set

## ♿ Accessibility

- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Focus management** for modals and dialogs
- **Color contrast** compliance

## 🧪 Testing

Components include comprehensive test coverage:
```bash
npm run test
```

## 📚 Storybook

Interactive component documentation:
```bash
npm run storybook
```

## 🎯 Usage Guidelines

### Component Composition
```tsx
// ✅ Good - Use composition
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// ❌ Avoid - Don't override internal styles
<Card className="p-0">
  <div className="custom-padding">Content</div>
</Card>
```

### Props Pattern
```tsx
// ✅ Good - Use variant props
<Button variant="outline" size="lg">Action</Button>

// ❌ Avoid - Don't use className for variants
<Button className="border bg-transparent text-foreground">Action</Button>
```

## 🔄 Updates and Maintenance

- **Version Control** - All changes tracked in Git
- **Breaking Changes** - Documented in CHANGELOG
- **Deprecation** - Graceful deprecation with warnings
- **Migration** - Migration guides for major updates

## 🤝 Contributing

1. Follow the existing component patterns
2. Add TypeScript types for all props
3. Include accessibility features
4. Write comprehensive tests
5. Update documentation
6. Add Storybook stories

## 📄 License

Proprietary - All rights reserved.
