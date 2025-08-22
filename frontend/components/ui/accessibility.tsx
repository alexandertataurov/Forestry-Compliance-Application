import * as React from "react";
import { cn } from "./utils";
import { 
  focusManagement, 
  keyboardNavigation, 
  screenReader, 
  aria, 
  generateId,
  useFocusRestoration 
} from "../../utils/accessibility";

// Focus Trap Component
interface FocusTrapProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

const FocusTrap = React.forwardRef<HTMLDivElement, FocusTrapProps>(
  ({ children, active = true, onEscape, className, ...props }, ref) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { saveFocus, restoreFocus } = useFocusRestoration();

    React.useEffect(() => {
      if (active && containerRef.current) {
        saveFocus();
        focusManagement.focusFirst(containerRef.current);
      }
    }, [active, saveFocus]);

    React.useEffect(() => {
      return () => {
        if (active) {
          restoreFocus();
        }
      };
    }, [active, restoreFocus]);

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
      if (!active || !containerRef.current) return;

      if (event.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      focusManagement.trapFocus(containerRef.current, event);
    }, [active, onEscape]);

    React.useEffect(() => {
      if (active) {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
      }
    }, [active, handleKeyDown]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusTrap.displayName = "FocusTrap";

// Skip Link Component
interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children = "Skip to main content", className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          screenReader.srOnly,
          "focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
          "bg-brand-primary text-brand-on-primary px-md py-sm rounded-md",
          "z-50 shadow-2",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

SkipLink.displayName = "SkipLink";

// Live Region Component
interface LiveRegionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}

const LiveRegion = React.forwardRef<HTMLDivElement, LiveRegionProps>(
  ({ 
    children, 
    priority = 'polite', 
    atomic = true, 
    className,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        aria-live={priority}
        aria-atomic={atomic}
        className={cn(screenReader.srOnly, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiveRegion.displayName = "LiveRegion";

// Keyboard Navigation List Component
interface KeyboardNavListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: (index: number) => void;
  currentIndex?: number;
  totalItems?: number;
}

const KeyboardNavList = React.forwardRef<HTMLDivElement, KeyboardNavListProps>(
  ({ 
    children, 
    orientation = 'vertical',
    onNavigate,
    currentIndex = 0,
    totalItems = 0,
    className,
    ...props 
  }, ref) => {
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (!onNavigate || totalItems === 0) return;

      keyboardNavigation.handleArrowKeys(
        event.nativeEvent,
        currentIndex,
        totalItems,
        onNavigate,
        orientation
      );
    }, [onNavigate, currentIndex, totalItems, orientation]);

    return (
      <div
        ref={ref}
        role="list"
        onKeyDown={handleKeyDown}
        className={cn(className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KeyboardNavList.displayName = "KeyboardNavList";

// Keyboard Navigation Item Component
interface KeyboardNavItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  index: number;
  isActive?: boolean;
  onActivate?: () => void;
}

const KeyboardNavItem = React.forwardRef<HTMLDivElement, KeyboardNavItemProps>(
  ({ 
    children, 
    index,
    isActive = false,
    onActivate,
    className,
    ...props 
  }, ref) => {
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
      if (!onActivate) return;

      keyboardNavigation.handleActivation(
        event.nativeEvent,
        onActivate
      );
    }, [onActivate]);

    return (
      <div
        ref={ref}
        role="listitem"
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        onKeyDown={handleKeyDown}
        className={cn(
          "focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KeyboardNavItem.displayName = "KeyboardNavItem";

// Visually Hidden Component
interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  focusable?: boolean;
}

const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, focusable = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          focusable ? screenReader.srOnlyFocusable : screenReader.srOnly,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

VisuallyHidden.displayName = "VisuallyHidden";

// High Contrast Border Component
interface HighContrastBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'focus';
}

const HighContrastBorder = React.forwardRef<HTMLDivElement, HighContrastBorderProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variant === 'focus' ? 'high-contrast-focus' : 'high-contrast-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HighContrastBorder.displayName = "HighContrastBorder";

// Touch Target Wrapper Component
interface TouchTargetProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const TouchTarget = React.forwardRef<HTMLDivElement, TouchTargetProps>(
  ({ children, size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'min-h-[32px] min-w-[32px]',
      md: 'min-h-[44px] min-w-[44px]',
      lg: 'min-h-[48px] min-w-[48px]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size],
          "flex items-center justify-center",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TouchTarget.displayName = "TouchTarget";

// Announcement Component
interface AnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  id?: string;
}

const Announcement: React.FC<AnnouncementProps> = ({ 
  message, 
  priority = 'polite',
  id 
}) => {
  const announcementId = id || generateId('announcement');

  React.useEffect(() => {
    screenReader.announce(message, priority);
  }, [message, priority]);

  return (
    <LiveRegion priority={priority} id={announcementId}>
      {message}
    </LiveRegion>
  );
};

// Accessibility Provider Component
interface AccessibilityProviderProps {
  children: React.ReactNode;
  skipLinkHref?: string;
  skipLinkText?: string;
}

const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
  skipLinkHref = '#main',
  skipLinkText = 'Skip to main content'
}) => {
  return (
    <>
      <SkipLink href={skipLinkHref}>
        {skipLinkText}
      </SkipLink>
      {children}
    </>
  );
};

export {
  FocusTrap,
  SkipLink,
  LiveRegion,
  KeyboardNavList,
  KeyboardNavItem,
  VisuallyHidden,
  HighContrastBorder,
  TouchTarget,
  Announcement,
  AccessibilityProvider,
};
