# Accessibility Guidelines

This document outlines the accessibility features and guidelines implemented in the Forestry Compliance Application design system.

## Overview

Our design system follows **WCAG 2.1 AA** standards and implements comprehensive accessibility features to ensure the application is usable by people with disabilities.

## Core Accessibility Features

### 1. Focus Management

#### Focus Trap Component
```tsx
import { FocusTrap } from '../components/ui/accessibility';

<FocusTrap active={true} onEscape={handleClose}>
  <div>Modal content</div>
</FocusTrap>
```

#### Focus Restoration
```tsx
import { useFocusRestoration } from '../utils/accessibility';

const { saveFocus, restoreFocus } = useFocusRestoration();
```

### 2. Keyboard Navigation

#### Keyboard Navigation List
```tsx
import { KeyboardNavList, KeyboardNavItem } from '../components/ui/accessibility';

<KeyboardNavList 
  orientation="vertical"
  onNavigate={setCurrentIndex}
  currentIndex={currentIndex}
  totalItems={items.length}
>
  {items.map((item, index) => (
    <KeyboardNavItem
      key={index}
      index={index}
      isActive={index === currentIndex}
      onActivate={() => handleSelect(item)}
    >
      {item.label}
    </KeyboardNavItem>
  ))}
</KeyboardNavList>
```

### 3. Screen Reader Support

#### Skip Links
```tsx
import { SkipLink } from '../components/ui/accessibility';

<SkipLink href="#main-content">
  Skip to main content
</SkipLink>
```

#### Live Regions
```tsx
import { LiveRegion, Announcement } from '../components/ui/accessibility';

<LiveRegion priority="polite">
  Status updates will be announced here
</LiveRegion>

<Announcement 
  message="Form submitted successfully" 
  priority="assertive"
/>
```

#### Visually Hidden Content
```tsx
import { VisuallyHidden } from '../components/ui/accessibility';

<button>
  <VisuallyHidden>Close dialog</VisuallyHidden>
  <XIcon />
</button>
```

### 4. Touch Targets

All interactive elements meet the minimum 44px touch target requirement:

```tsx
import { TouchTarget } from '../components/ui/accessibility';

<TouchTarget size="md">
  <button>Small button</button>
</TouchTarget>
```

### 5. High Contrast Support

```tsx
import { HighContrastBorder } from '../components/ui/accessibility';

<HighContrastBorder variant="focus">
  <button>High contrast button</button>
</HighContrastBorder>
```

## Motion and Animation

### Reduced Motion Support

Our motion system respects user preferences for reduced motion:

```css
/* Automatically disabled when user prefers reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Motion Classes

```css
/* Transition utilities */
.transition-fast    /* 150ms */
.transition-normal  /* 250ms */
.transition-slow    /* 350ms */
.transition-slower  /* 500ms */

/* Animation utilities */
.animate-fade-in
.animate-slide-in-from-top
.animate-scale-in
.animate-bounce-in

/* Hover animations */
.hover-lift
.hover-scale
.hover-glow
```

## Color Contrast

### WCAG Compliance

All color combinations meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).

#### Color Contrast Validation

```tsx
import { validateColorPair, getAccessibleTextColor } from '../utils/color-contrast';

// Validate a color pair
const result = validateColorPair('#000000', '#FFFFFF');
console.log(result);
// { contrastRatio: 21, meetsAA: true, meetsAAA: true, level: 'AAA' }

// Get accessible text color for a background
const textColor = getAccessibleTextColor('#335CFF');
```

### Design Token Validation

Our design tokens are automatically validated for accessibility:

```tsx
import { validateDesignTokens, generateAccessibilityReport } from '../utils/color-contrast';

const validation = validateDesignTokens();
const report = generateAccessibilityReport();
```

## ARIA Support

### Common ARIA Roles

```tsx
import { aria } from '../utils/accessibility';

// Available roles
aria.roles.button
aria.roles.link
aria.roles.tab
aria.roles.dialog
aria.roles.alert
aria.roles.navigation
```

### ARIA States

```tsx
// Common states
aria.states.expanded
aria.states.selected
aria.states.checked
aria.states.pressed
aria.states.hidden
aria.states.disabled
aria.states.required
aria.states.invalid
```

### ARIA Labels

```tsx
// Common labels
aria.labels.close
aria.labels.open
aria.labels.menu
aria.labels.navigation
aria.labels.search
aria.labels.submit
aria.labels.cancel
aria.labels.loading
aria.labels.error
aria.labels.success
```

## Component Accessibility

### Button Component

- ✅ Minimum 44px touch target
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ ARIA labels and roles
- ✅ High contrast support

### Input Component

- ✅ Associated labels
- ✅ Error states with ARIA
- ✅ Required field indicators
- ✅ Autocomplete support
- ✅ Clear button accessibility

### Select Component

- ✅ Keyboard navigation
- ✅ ARIA expanded state
- ✅ Option selection feedback
- ✅ Clear selection option

### Card Component

- ✅ Semantic structure
- ✅ Focus management
- ✅ Screen reader announcements

## Testing Accessibility

### Automated Testing

1. **Color Contrast Testing**
   ```bash
   # Validate design tokens
   npm run validate-accessibility
   ```

2. **Component Testing**
   ```bash
   # Test components with accessibility tools
   npm run test:accessibility
   ```

### Manual Testing

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Use arrow keys for navigation
   - Test Enter/Space activation
   - Verify Escape key functionality

2. **Screen Reader Testing**
   - Test with NVDA (Windows)
   - Test with VoiceOver (macOS)
   - Test with JAWS (Windows)
   - Verify announcements and labels

3. **Visual Testing**
   - Test with high contrast mode
   - Test with reduced motion
   - Test with different zoom levels
   - Test with color blindness simulators

## Accessibility Checklist

### Content
- [ ] All images have alt text
- [ ] Form fields have associated labels
- [ ] Error messages are clear and accessible
- [ ] Status updates are announced to screen readers

### Navigation
- [ ] Skip links are available
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works for all features

### Visual Design
- [ ] Color contrast meets WCAG AA standards
- [ ] Text is resizable up to 200%
- [ ] Touch targets are at least 44px
- [ ] High contrast mode is supported

### Motion
- [ ] Reduced motion preferences are respected
- [ ] Animations don't cause seizures
- [ ] Motion is not essential for functionality
- [ ] Pause/stop controls are available

### Technical
- [ ] ARIA attributes are used correctly
- [ ] Semantic HTML is used
- [ ] Live regions are implemented
- [ ] Focus management is handled properly

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

## Support

For accessibility questions or issues, please refer to our accessibility guidelines or contact the development team.
