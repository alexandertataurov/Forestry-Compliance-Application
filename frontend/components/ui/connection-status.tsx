import * as React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const connectionStatusVariants = cva(
  "inline-flex items-center gap-xs",
  {
    variants: {
      variant: {
        default: "",
        compact: "gap-1",
        detailed: "gap-sm",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const statusIndicatorVariants = cva(
  "rounded-full transition-all duration-200",
  {
    variants: {
      status: {
        online: "bg-state-success",
        offline: "bg-state-error",
        pending: "bg-state-warning",
      },
      size: {
        sm: "size-2",
        default: "size-3",
        lg: "size-4",
      },
    },
    defaultVariants: {
      status: "online",
      size: "default",
    },
  }
);

export interface ConnectionStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof connectionStatusVariants> {
  isOnline: boolean;
  pendingSync?: number;
  showSyncIndicator?: boolean;
  showIcon?: boolean;
  showText?: boolean;
  statusText?: {
    online?: string;
    offline?: string;
  };
  syncIndicatorColor?: string;
}

const ConnectionStatus = React.forwardRef<HTMLDivElement, ConnectionStatusProps>(
  ({ 
    className, 
    variant, 
    size,
    isOnline, 
    pendingSync = 0, 
    showSyncIndicator = true,
    showIcon = true,
    showText = false,
    statusText,
    syncIndicatorColor,
    ...props 
  }, ref) => {
    const defaultStatusText = {
      online: "Онлайн",
      offline: "Офлайн",
    };

    const currentStatusText = {
      ...defaultStatusText,
      ...statusText,
    };

    return (
      <div
        ref={ref}
        className={cn(connectionStatusVariants({ variant, size, className }))}
        role="status"
        aria-live="polite"
        aria-label={`Статус соединения: ${isOnline ? currentStatusText.online : currentStatusText.offline}`}
        {...props}
      >
        {showIcon && (
          <>
            {isOnline ? (
              <Wifi className="size-4 text-state-success" />
            ) : (
              <WifiOff className="size-4 text-state-error" />
            )}
          </>
        )}
        
        {showText && (
          <span className="text-label-small font-label-small">
            {isOnline ? currentStatusText.online : currentStatusText.offline}
          </span>
        )}
        
        {showSyncIndicator && pendingSync > 0 && (
          <div
            className={cn(
              statusIndicatorVariants({ 
                status: "pending", 
                size: "sm" 
              })
            )}
            style={syncIndicatorColor ? { backgroundColor: syncIndicatorColor } : undefined}
            aria-label={`${pendingSync} элементов ожидают синхронизации`}
          />
        )}
      </div>
    );
  }
);

ConnectionStatus.displayName = 'ConnectionStatus';

export { ConnectionStatus, connectionStatusVariants, statusIndicatorVariants };
