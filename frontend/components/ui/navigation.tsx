import * as React from 'react';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const navigationBarVariants = cva(
  "fixed top-0 left-0 right-0 z-50 bg-surface-bg border-b border-surface-border backdrop-blur-md",
  {
    variants: {
      variant: {
        default: "bg-surface-bg/95",
        transparent: "bg-transparent",
        solid: "bg-surface-bg",
      },
      size: {
        sm: "h-12",
        default: "h-16",
        lg: "h-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NavigationBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof navigationBarVariants> {
  title?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonLabel?: string;
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
  centerContent?: React.ReactNode;
}

const NavigationBar = React.forwardRef<HTMLDivElement, NavigationBarProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    showBackButton = false, 
    onBack, 
    backButtonLabel = "Назад",
    rightContent,
    leftContent,
    centerContent,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(navigationBarVariants({ variant, size, className }))}
        {...props}
      >
        <div className="flex items-center justify-between h-full px-md">
          {/* Left Section */}
          <div className="flex items-center min-w-0 flex-1">
            {leftContent || (showBackButton && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-xs text-label font-label text-surface-on-surface hover:text-surface-on-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md px-sm py-xs"
                aria-label={backButtonLabel}
              >
                <ChevronLeft className="size-4" />
                <span>{backButtonLabel}</span>
              </button>
            ))}
          </div>

          {/* Center Section */}
          <div className="flex items-center justify-center flex-1 min-w-0">
            {centerContent || (title && (
              <h1 className="text-title font-title text-surface-on-surface truncate">
                {title}
              </h1>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end min-w-0 flex-1">
            {rightContent || (
              <button
                type="button"
                className="inline-flex items-center justify-center size-8 text-surface-on-variant hover:text-surface-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md"
                aria-label="Меню"
              >
                <MoreHorizontal className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

NavigationBar.displayName = 'NavigationBar';

export { NavigationBar, navigationBarVariants };
