import * as React from 'react';
import { ChevronLeft, MoreHorizontal, Wifi, WifiOff, Database } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';

const navigationBarVariants = cva(
  "fixed top-0 left-0 right-0 z-50 bg-surface-bg border-b border-surface-border backdrop-blur-md transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-surface-bg/95",
        transparent: "bg-transparent",
        solid: "bg-surface-bg",
        field: "bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-700",
      },
      size: {
        sm: "h-12",
        default: "h-16",
        lg: "h-20",
        field: "h-16 md:h-20", // Responsive height for field operations
      },
      compact: {
        true: "h-14",
        false: "h-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      compact: false,
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
  showConnectionStatus?: boolean;
  isOnline?: boolean;
  pendingSync?: number;
  fieldMode?: boolean;
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
    showConnectionStatus = false,
    isOnline = true,
    pendingSync = 0,
    fieldMode = false,
    compact = false,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    
    const renderConnectionStatus = () => {
      if (!showConnectionStatus) return null;
      
      return (
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            isOnline 
              ? "bg-status-success/10 text-status-success" 
              : "bg-status-error/10 text-status-error"
          )}>
            {isOnline ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            <span className={cn(
              fieldOps.shouldUseLargerText && "text-sm"
            )}>
              {isOnline ? 'Онлайн' : 'Офлайн'}
            </span>
          </div>
          
          {pendingSync > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-status-warning/10 text-status-warning text-xs font-medium">
              <Database className="w-3 h-3" />
              <span className={cn(
                fieldOps.shouldUseLargerText && "text-sm"
              )}>
                {pendingSync}
              </span>
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(
          navigationBarVariants({ 
            variant: fieldMode ? "field" : variant, 
            size: fieldOps.shouldUseCompactLayout ? "sm" : size, 
            compact: fieldOps.shouldUseCompactLayout,
            className 
          })
        )}
        {...props}
      >
        <div className={cn(
          "flex items-center justify-between h-full",
          fieldOps.shouldUseLargeButtons ? "px-4" : "px-md"
        )}>
          {/* Left Section */}
          <div className="flex items-center min-w-0 flex-1">
            {leftContent || (showBackButton && onBack && (
              <button
                type="button"
                onClick={onBack}
                className={cn(
                  "inline-flex items-center gap-xs text-label font-label text-surface-on-surface hover:text-surface-on-variant transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md px-sm py-xs touch-target",
                  fieldOps.shouldUseLargeButtons && "px-4 py-2 gap-2",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}
                aria-label={backButtonLabel}
              >
                <ChevronLeft className={cn(
                  "size-4",
                  fieldOps.shouldUseLargeButtons && "size-5"
                )} />
                <span>{backButtonLabel}</span>
              </button>
            ))}
          </div>

          {/* Center Section */}
          <div className="flex items-center justify-center flex-1 min-w-0">
            {centerContent || (title && (
              <h1 className={cn(
                "text-title font-title text-surface-on-surface truncate",
                fieldOps.shouldUseLargerText && "text-field-lg font-semibold",
                fieldOps.shouldUseCompactLayout && "text-field-base"
              )}>
                {title}
              </h1>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end min-w-0 flex-1">
            {rightContent || (
              <>
                {renderConnectionStatus()}
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-center text-surface-on-variant hover:text-surface-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md touch-target",
                    fieldOps.shouldUseLargeButtons ? "size-10" : "size-8",
                    fieldOps.shouldUseLargerText && "size-10"
                  )}
                  aria-label="Меню"
                >
                  <MoreHorizontal className={cn(
                    "size-4",
                    fieldOps.shouldUseLargeButtons && "size-5"
                  )} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);

NavigationBar.displayName = 'NavigationBar';

export { NavigationBar, navigationBarVariants };
