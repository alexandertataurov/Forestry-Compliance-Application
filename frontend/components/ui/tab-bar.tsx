import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';

const tabBarVariants = cva(
  "fixed bottom-0 left-0 right-0 z-field-fixed bg-surface-bg border-t border-surface-border backdrop-blur-md transition-transform duration-300 ease-out safe-area-padding",
  {
    variants: {
      variant: {
        default: "bg-surface-bg/95",
        solid: "bg-surface-bg",
        transparent: "bg-transparent",
        field: "bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-700",
      },
      size: {
        sm: "h-16",
        default: "h-20",
        lg: "h-24",
        field: "h-20 md:h-24", // Responsive height for field operations
        compact: "h-16", // Compact mode for small screens
      },
      visibility: {
        visible: "translate-y-0",
        hidden: "translate-y-full",
      },
      orientation: {
        portrait: "h-20",
        landscape: "h-16", // Compact in landscape
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      visibility: "visible",
    },
  }
);

const tabItemVariants = cva(
  "flex flex-col items-center justify-center gap-xs flex-1 min-w-0 relative transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md touch-target",
  {
    variants: {
      active: {
        true: "text-brand-primary",
        false: "text-surface-on-variant hover:text-surface-on-surface",
      },
      touchOptimized: {
        true: "touch-target-lg p-2",
        false: "p-1",
      },
      fieldMode: {
        true: "touch-target-lg rounded-touch",
        false: "rounded-md",
      },
      compact: {
        true: "gap-1 p-1",
        false: "gap-xs p-2",
      },
    },
    defaultVariants: {
      active: false,
      touchOptimized: false,
      fieldMode: false,
      compact: false,
    },
  }
);

const tabIconVariants = cva(
  "transition-all duration-200",
  {
    variants: {
      active: {
        true: "scale-110",
        false: "scale-100",
      },
      size: {
        sm: "w-4 h-4",
        default: "w-5 h-5",
        lg: "w-6 h-6",
        field: "w-5 h-5 md:w-6 md:h-6",
      },
    },
    defaultVariants: {
      active: false,
      size: "default",
    },
  }
);

const tabLabelVariants = cva(
  "font-medium transition-all duration-200",
  {
    variants: {
      active: {
        true: "font-semibold",
        false: "font-medium",
      },
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        field: "text-sm md:text-base",
      },
      compact: {
        true: "text-xs",
        false: "text-sm",
      },
    },
    defaultVariants: {
      active: false,
      size: "default",
      compact: false,
    },
  }
);

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: number;
  alert?: boolean;
  description?: string;
}

export interface TabBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabBarVariants> {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  visible?: boolean;
  showIndicator?: boolean;
  ariaLabel?: string;
  fieldMode?: boolean;
  compact?: boolean;
  showLabels?: boolean;
}

const TabBar = React.forwardRef<HTMLDivElement, TabBarProps>(
  ({ 
    className, 
    variant, 
    size, 
    visibility,
    items, 
    activeTab, 
    onTabChange, 
    visible = true,
    showIndicator = true,
    ariaLabel = "Основные разделы",
    fieldMode = false,
    compact = false,
    showLabels = true,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    
    const getTabBarSize = () => {
      if (fieldOps.shouldUseCompactLayout) return "compact";
      if (fieldOps.isLandscape) return "sm";
      if (fieldMode) return "field";
      return size || "default";
    };

    const getTabItemSize = () => {
      if (fieldOps.shouldUseCompactLayout) return "sm";
      if (fieldOps.shouldUseLargeButtons) return "lg";
      if (fieldMode) return "field";
      return "default";
    };

    return (
      <div
        ref={ref}
        className={cn(
          tabBarVariants({ 
            variant: fieldMode ? "field" : variant, 
            size: getTabBarSize(),
            visibility: visible ? "visible" : "hidden",
            className 
          })
        )}
        role="tablist"
        aria-label={ariaLabel}
        {...props}
      >
        <div className={cn(
          "flex items-center justify-around h-full",
          fieldOps.shouldUseLargeButtons ? "px-2" : "px-1"
        )}>
          {items.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && onTabChange(item.id)}
                disabled={item.disabled}
                className={cn(
                  tabItemVariants({
                    active: isActive,
                    touchOptimized: fieldOps.shouldUseLargeButtons,
                    fieldMode: fieldMode,
                    compact: fieldOps.shouldUseCompactLayout,
                  }),
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                role="tab"
                aria-selected={isActive}
                aria-label={item.description || item.label}
              >
                {/* Badge */}
                {item.badge && (
                  <div className={cn(
                    "absolute -top-1 -right-1 bg-status-error text-white rounded-full min-w-4 h-4 flex items-center justify-center text-xs font-bold",
                    fieldOps.shouldUseLargeButtons && "min-w-5 h-5 text-sm"
                  )}>
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}
                
                {/* Alert indicator */}
                {item.alert && !item.badge && (
                  <div className={cn(
                    "absolute -top-1 -right-1 bg-status-warning rounded-full w-2 h-2",
                    fieldOps.shouldUseLargeButtons && "w-3 h-3"
                  )} />
                )}
                
                {/* Icon */}
                <Icon 
                  className={cn(
                    tabIconVariants({
                      active: isActive,
                      size: getTabItemSize(),
                    })
                  )}
                />
                
                {/* Label */}
                {showLabels && (
                  <span className={cn(
                    tabLabelVariants({
                      active: isActive,
                      size: getTabItemSize(),
                      compact: fieldOps.shouldUseCompactLayout,
                    }),
                    "text-center leading-tight"
                  )}>
                    {item.label}
                  </span>
                )}
                
                {/* Active indicator */}
                {showIndicator && isActive && (
                  <div className={cn(
                    "absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full",
                    fieldOps.shouldUseLargeButtons && "w-1.5 h-1.5"
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

TabBar.displayName = 'TabBar';

export { TabBar, tabBarVariants, tabItemVariants };
