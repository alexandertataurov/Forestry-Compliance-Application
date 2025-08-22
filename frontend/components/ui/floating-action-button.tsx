import * as React from 'react';
import { Plus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const floatingActionButtonVariants = cva(
  "fixed z-50 rounded-full shadow-2 transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary text-brand-on-primary hover:bg-brand-primary/90 active:bg-brand-primary/95",
        secondary: "bg-brand-secondary text-brand-on-secondary hover:bg-brand-secondary/90 active:bg-brand-secondary/95",
        tertiary: "bg-brand-tertiary text-brand-on-tertiary hover:bg-brand-tertiary/90 active:bg-brand-tertiary/95",
        surface: "bg-surface-bg text-surface-on-surface border border-surface-border hover:bg-surface-bg-variant",
      },
      size: {
        sm: "size-12",
        default: "size-14",
        lg: "size-16",
      },
      position: {
        "bottom-right": "bottom-24 right-md",
        "bottom-left": "bottom-24 left-md",
        "bottom-center": "bottom-24 left-1/2 transform -translate-x-1/2",
        "top-right": "top-24 right-md",
        "top-left": "top-24 left-md",
        "top-center": "top-24 left-1/2 transform -translate-x-1/2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      position: "bottom-right",
    },
  }
);

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingActionButtonVariants> {
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
  showLabel?: boolean;
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    position,
    icon: Icon = Plus, 
    label = "Действие",
    showLabel = false,
    children,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(floatingActionButtonVariants({ variant, size, position, className }))}
        aria-label={label}
        {...props}
      >
        <div className="flex items-center justify-center h-full">
          {children || <Icon className="size-6" />}
        </div>
        {showLabel && (
          <span className="sr-only">{label}</span>
        )}
      </button>
    );
  }
);

FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton, floatingActionButtonVariants };
