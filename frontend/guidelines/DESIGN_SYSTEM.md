# Forestry Compliance Design System

## Overview
A comprehensive design system optimized for forestry field operations with mobile-first responsive design, touch-friendly interfaces, and accessibility features.

## Design Principles

### 1. Mobile-First Field Operations
- **Touch-Optimized**: All interactive elements meet minimum 44px touch targets
- **Glove-Friendly**: Large buttons and clear visual hierarchy for outdoor use
- **Offline-Capable**: Seamless offline/online transitions with clear status indicators
- **Battery-Efficient**: Optimized animations and reduced motion options

### 2. Accessibility & Inclusivity
- **High Contrast**: Enhanced contrast ratios for outdoor visibility
- **Large Text**: Scalable typography for various viewing conditions
- **Screen Reader**: Comprehensive ARIA labels and semantic HTML
- **Color Blind**: Non-color-dependent status indicators

### 3. Forestry-Specific UX
- **GPS Integration**: Clear location and mapping interfaces
- **Data Validation**: Real-time validation for forestry measurements
- **Compliance Focus**: Regulatory requirements prominently displayed
- **Multi-Operator**: Team coordination and data sharing features

## Color System

### Primary Colors
```css
--brand-primary: #007AFF;      /* iOS Blue - Primary actions */
--brand-secondary: #34C759;    /* Success Green - Forestry operations */
--brand-accent: #FF9500;       /* Warning Orange - Alerts and notifications */
```

### Surface Colors
```css
--surface-bg: #FFFFFF;         /* Primary background */
--surface-card: #F8F9FA;       /* Card backgrounds */
--surface-border: #E5E7EB;     /* Borders and dividers */
--surface-on-surface: #1F2937; /* Primary text */
--surface-on-variant: #6B7280; /* Secondary text */
```

### Status Colors
```css
--status-success: #34C759;     /* Completed operations */
--status-warning: #FF9500;     /* Pending sync, alerts */
--status-error: #FF3B30;       /* Errors, offline status */
--status-info: #007AFF;        /* Information, GPS status */
```

## Typography

### Font Scale
```css
--text-field-xs: 0.75rem;      /* 12px - Small labels */
--text-field-sm: 0.875rem;     /* 14px - Body text */
--text-field-base: 1rem;       /* 16px - Default text */
--text-field-lg: 1.125rem;     /* 18px - Large text */
--text-field-xl: 1.25rem;      /* 20px - Headers */
--text-field-2xl: 1.5rem;      /* 24px - Large headers */
```

### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

## Component Library

### Navigation Components

#### NavigationBar
- **Purpose**: Main app navigation with back button and status indicators
- **Variants**: Default, Field Mode, Compact
- **Features**: Connection status, pending sync indicators, responsive sizing

#### TabBar
- **Purpose**: Bottom navigation for main app sections
- **Variants**: Default, Field Mode, Compact, Landscape
- **Features**: Badge support, alert indicators, touch optimization

### Form Components

#### NumericInput
- **Purpose**: Forestry measurement inputs with validation
- **Features**: GPS integration, species selection, real-time validation

#### MeasurementInput
- **Purpose**: Length, diameter, and volume calculations
- **Features**: Unit conversion, precision control, offline validation

#### GPSInput
- **Purpose**: Location capture and mapping
- **Features**: Real-time coordinates, accuracy indicators, offline caching

### Data Components

#### DataTable
- **Purpose**: Forestry records display and management
- **Features**: Sorting, filtering, bulk operations, offline sync

#### StatusBadge
- **Purpose**: Operation status and compliance indicators
- **Variants**: Success, Warning, Error, Info, Pending

#### ProgressIndicator
- **Purpose**: Sync progress and operation status
- **Features**: Real-time updates, offline queue management

## Responsive Breakpoints

### Mobile-First Approach
```css
/* Base styles for mobile */
@media (min-width: 0px) {
  /* Mobile optimizations */
}

/* Tablet */
@media (min-width: 768px) {
  /* Enhanced layouts */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full desktop experience */
}

/* Large screens */
@media (min-width: 1440px) {
  /* Ultra-wide optimizations */
}
```

### Field Operation Modes

#### Compact Mode
- **Trigger**: Small screens, landscape orientation
- **Features**: Reduced spacing, smaller touch targets, condensed layouts

#### Large Button Mode
- **Trigger**: Accessibility settings, outdoor use
- **Features**: 48px+ touch targets, larger text, enhanced contrast

#### High Contrast Mode
- **Trigger**: Accessibility settings, bright sunlight
- **Features**: Maximum contrast ratios, border indicators

## Spacing System

### Base Units
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### Component Spacing
```css
--ios-section-header: 1.5rem;  /* Section headers */
--ios-list-item: 0.75rem;      /* List item spacing */
--ios-card-padding: 1rem;      /* Card padding */
--touch-target: 2.75rem;       /* Minimum touch target */
```

## Animation & Motion

### Duration Scale
```css
--duration-fast: 150ms;    /* Quick feedback */
--duration-normal: 250ms;  /* Standard transitions */
--duration-slow: 350ms;    /* Complex animations */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0.0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable animations for accessibility */
}
```

## Icon System

### Lucide React Icons
- **Consistency**: Unified icon library
- **Scalability**: Vector-based, crisp at all sizes
- **Semantic**: Meaningful icons for forestry operations

### Icon Sizes
```css
--icon-xs: 0.75rem;    /* 12px - Small indicators */
--icon-sm: 1rem;       /* 16px - Default icons */
--icon-md: 1.25rem;    /* 20px - Medium icons */
--icon-lg: 1.5rem;     /* 24px - Large icons */
--icon-xl: 2rem;       /* 32px - Feature icons */
```

## Accessibility Features

### ARIA Labels
- **Navigation**: Clear section and action descriptions
- **Forms**: Field validation and error messages
- **Status**: Connection and sync status announcements

### Keyboard Navigation
- **Tab Order**: Logical navigation flow
- **Focus Indicators**: Clear focus states
- **Shortcuts**: Power user keyboard shortcuts

### Screen Reader Support
- **Semantic HTML**: Proper heading hierarchy
- **Live Regions**: Dynamic content updates
- **Landmarks**: Navigation and content regions

## Performance Guidelines

### Bundle Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Tree Shaking**: Remove unused code and dependencies
- **Lazy Loading**: On-demand component loading

### Runtime Performance
- **Virtual Scrolling**: Large data sets
- **Memoization**: Expensive calculations
- **Debouncing**: User input handling

## Implementation Examples

### Basic Card Component
```tsx
<div className="ios-card touch-target p-4">
  <div className="ios-list-item-icon mb-3" style={{ backgroundColor: '#34C759' }}>
    <TreePine className="w-5 h-5" />
  </div>
  <div className="text-field-base font-semibold text-surface-on-surface">
    Card Title
  </div>
  <div className="text-field-sm text-surface-on-variant">
    Card description
  </div>
</div>
```

### Responsive Grid Layout
```tsx
<div className={cn(
  "grid grid-cols-2 gap-3",
  fieldOps.shouldUseCompactLayout && "gap-2",
  fieldOps.isLandscape && "grid-cols-4 gap-2"
)}>
  {/* Grid items */}
</div>
```

### Touch-Optimized Button
```tsx
<button className={cn(
  "ios-button ios-button-primary touch-target",
  fieldOps.shouldUseLargeButtons && "ios-button-lg"
)}>
  <span>Button Text</span>
</button>
```

## Testing Guidelines

### Visual Testing
- **Cross-Device**: Test on various screen sizes
- **Orientation**: Portrait and landscape modes
- **Accessibility**: High contrast and large text modes

### Interaction Testing
- **Touch Targets**: Verify minimum 44px touch areas
- **Gesture Support**: Swipe, pinch, and tap interactions
- **Offline Mode**: Disconnect testing and sync behavior

### Performance Testing
- **Load Times**: Initial load and navigation performance
- **Memory Usage**: Monitor for memory leaks
- **Battery Impact**: Optimize for field device battery life

## Future Enhancements

### Planned Features
- **Dark Mode**: Automatic and manual dark theme support
- **Custom Themes**: Organization-specific branding
- **Advanced Animations**: Micro-interactions and feedback
- **Voice Commands**: Hands-free operation support

### Accessibility Improvements
- **Voice Navigation**: Screen reader optimization
- **Gesture Controls**: Custom gesture recognition
- **Haptic Feedback**: Tactile response for actions

---

*This design system is continuously updated based on user feedback and field testing with forestry professionals.*
