import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const tabBarVariants = cva(
  "fixed bottom-0 left-0 right-0 z-50 bg-surface-bg border-t border-surface-border backdrop-blur-md transition-transform duration-300 ease-out",
  {
    variants: {
      variant: {
        default: "bg-surface-bg/95",
        solid: "bg-surface-bg",
        transparent: "bg-transparent",
      },
      size: {
        sm: "h-16",
        default: "h-20",
        lg: "h-24",
      },
      visibility: {
        visible: "translate-y-0",
        hidden: "translate-y-full",
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
  "flex flex-col items-center justify-center gap-xs flex-1 min-w-0 relative transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2 rounded-md",
  {
    variants: {
      active: {
        true: "text-brand-primary",
        false: "text-surface-on-variant hover:text-surface-on-surface",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
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
    ...props 
  }, ref) => {
    const currentVisibility = visible ? "visible" : "hidden";

    return (
      <div
        ref={ref}
        className={cn(tabBarVariants({ variant, size, visibility: currentVisibility, className }))}
        role="tablist"
        aria-label={ariaLabel}
        {...props}
      >
        <div className="flex items-center justify-around h-full px-sm">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => !item.disabled && onTabChange(item.id)}
                type="button"
                role="tab"
                aria-current={isActive ? 'page' : undefined}
                aria-selected={isActive}
                aria-label={item.label}
                disabled={item.disabled}
                className={cn(
                  tabItemVariants({ active: isActive }),
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon className="size-5" />
                <span className="text-label-small font-label-small truncate max-w-full">
                  {item.label}
                </span>
                {isActive && showIndicator && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full" />
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
