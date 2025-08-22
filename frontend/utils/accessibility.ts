/**
 * Accessibility utilities for the design system
 * Implements WCAG 2.1 AA standards and best practices
 */

// Focus management utilities
export const focusManagement = {
  // Trap focus within a container
  trapFocus: (container: HTMLElement, event: KeyboardEvent) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  },

  // Move focus to first focusable element
  focusFirst: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) {
      firstElement.focus();
    }
  },

  // Move focus to last focusable element
  focusLast: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    if (lastElement) {
      lastElement.focus();
    }
  },
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle arrow key navigation in lists/grids
  handleArrowKeys: (
    event: KeyboardEvent,
    currentIndex: number,
    totalItems: number,
    onNavigate: (index: number) => void,
    orientation: 'horizontal' | 'vertical' = 'vertical'
  ) => {
    const isHorizontal = orientation === 'horizontal';
    const isVertical = orientation === 'vertical';

    switch (event.key) {
      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % totalItems;
          onNavigate(nextIndex);
        }
        break;
      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
          onNavigate(prevIndex);
        }
        break;
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % totalItems;
          onNavigate(nextIndex);
        }
        break;
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
          onNavigate(prevIndex);
        }
        break;
      case 'Home':
        event.preventDefault();
        onNavigate(0);
        break;
      case 'End':
        event.preventDefault();
        onNavigate(totalItems - 1);
        break;
    }
  },

  // Handle Enter and Space key activation
  handleActivation: (
    event: KeyboardEvent,
    onActivate: () => void,
    preventDefault = true
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (preventDefault) {
        event.preventDefault();
      }
      onActivate();
    }
  },
};

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Hide element visually but keep it accessible to screen readers
  srOnly: 'sr-only',
  
  // Show element only to screen readers
  srOnlyFocusable: 'sr-only focusable:not-sr-only',
};

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (l1: number, l2: number): number => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG AA standards
  meetsWCAGAA: (contrastRatio: number, isLargeText = false): boolean => {
    return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
  },
};

// Touch target utilities
export const touchTargets = {
  // Minimum touch target size (44px = 48dp)
  minSize: '44px',
  
  // CSS class for minimum touch target
  minTouchTarget: 'min-h-[44px] min-w-[44px]',
  
  // Check if element meets minimum touch target size
  meetsMinimumSize: (element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  },
};

// Reduced motion utilities
export const reducedMotion = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get motion duration based on user preference
  getMotionDuration: (duration: string): string => {
    return reducedMotion.prefersReducedMotion() ? '0ms' : duration;
  },

  // CSS class for reduced motion
  reducedMotionClass: 'motion-reduce:transition-none motion-reduce:animate-none',
};

// ARIA utilities
export const aria = {
  // Common ARIA roles
  roles: {
    button: 'button',
    link: 'link',
    tab: 'tab',
    tabpanel: 'tabpanel',
    listbox: 'listbox',
    option: 'option',
    combobox: 'combobox',
    dialog: 'dialog',
    alert: 'alert',
    alertdialog: 'alertdialog',
    banner: 'banner',
    complementary: 'complementary',
    contentinfo: 'contentinfo',
    form: 'form',
    main: 'main',
    navigation: 'navigation',
    region: 'region',
    search: 'search',
    section: 'section',
  },

  // Common ARIA states
  states: {
    expanded: 'aria-expanded',
    selected: 'aria-selected',
    checked: 'aria-checked',
    pressed: 'aria-pressed',
    hidden: 'aria-hidden',
    disabled: 'aria-disabled',
    required: 'aria-required',
    invalid: 'aria-invalid',
    busy: 'aria-busy',
    live: 'aria-live',
  },

  // Common ARIA labels
  labels: {
    close: 'Close',
    open: 'Open',
    menu: 'Menu',
    navigation: 'Navigation',
    search: 'Search',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading',
    error: 'Error',
    success: 'Success',
  },
};

// Utility function to generate unique IDs
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Hook for managing focus restoration
export const useFocusRestoration = () => {
  let previousActiveElement: HTMLElement | null = null;

  const saveFocus = () => {
    previousActiveElement = document.activeElement as HTMLElement;
  };

  const restoreFocus = () => {
    if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  };

  return { saveFocus, restoreFocus };
};
