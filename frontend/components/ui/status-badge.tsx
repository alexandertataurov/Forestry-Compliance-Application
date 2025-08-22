import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Clock,
  Wifi,
  WifiOff,
  Database,
  Gps,
  GpsOff,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react';

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        success: "bg-status-success/10 text-status-success border border-status-success/20",
        warning: "bg-status-warning/10 text-status-warning border border-status-warning/20",
        error: "bg-status-error/10 text-status-error border border-status-error/20",
        info: "bg-status-info/10 text-status-info border border-status-info/20",
        pending: "bg-status-warning/10 text-status-warning border border-status-warning/20",
        offline: "bg-status-error/10 text-status-error border border-status-error/20",
        online: "bg-status-success/10 text-status-success border border-status-success/20",
        syncing: "bg-status-info/10 text-status-info border border-status-info/20",
        gps: "bg-status-success/10 text-status-success border border-status-success/20",
        gpsOff: "bg-status-warning/10 text-status-warning border border-status-warning/20",
        compliance: "bg-status-success/10 text-status-success border border-status-success/20",
        violation: "bg-status-error/10 text-status-error border border-status-error/20",
        audit: "bg-status-info/10 text-status-info border border-status-info/20",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        default: "text-xs px-2.5 py-1",
        lg: "text-sm px-3 py-1.5",
        xl: "text-base px-4 py-2",
      },
      fieldMode: {
        true: "border-2 font-semibold",
        false: "border",
      },
      compact: {
        true: "gap-1 px-2 py-0.5",
        false: "gap-1.5 px-2.5 py-1",
      },
      animated: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
      fieldMode: false,
      compact: false,
      animated: false,
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  status?: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'offline' | 'online' | 'syncing' | 'gps' | 'gpsOff' | 'compliance' | 'violation' | 'audit';
  icon?: React.ComponentType<{ className?: string }>;
  showIcon?: boolean;
  showText?: boolean;
  count?: number;
  pulse?: boolean;
  forestry?: boolean;
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    fieldMode,
    compact,
    animated,
    status,
    icon: CustomIcon,
    showIcon = true,
    showText = true,
    count,
    pulse = false,
    forestry = false,
    children,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    
    // Determine variant based on status
    const getVariant = () => {
      if (variant) return variant;
      if (status) return status;
      return 'info';
    };
    
    // Get appropriate icon based on status
    const getIcon = () => {
      if (CustomIcon) return CustomIcon;
      
      switch (status) {
        case 'success':
        case 'compliance':
          return CheckCircle;
        case 'warning':
        case 'pending':
          return AlertTriangle;
        case 'error':
        case 'violation':
          return XCircle;
        case 'info':
        case 'audit':
          return Info;
        case 'offline':
          return WifiOff;
        case 'online':
          return Wifi;
        case 'syncing':
          return Database;
        case 'gps':
          return Gps;
        case 'gpsOff':
          return GpsOff;
        default:
          return Info;
      }
    };
    
    // Get status text
    const getStatusText = () => {
      if (children) return children;
      
      switch (status) {
        case 'success':
          return forestry ? 'Соответствует' : 'Успешно';
        case 'warning':
          return forestry ? 'Требует внимания' : 'Предупреждение';
        case 'error':
          return forestry ? 'Нарушение' : 'Ошибка';
        case 'info':
          return forestry ? 'Информация' : 'Информация';
        case 'pending':
          return forestry ? 'Ожидает' : 'В ожидании';
        case 'offline':
          return forestry ? 'Офлайн' : 'Нет связи';
        case 'online':
          return forestry ? 'Онлайн' : 'Подключено';
        case 'syncing':
          return forestry ? 'Синхронизация' : 'Синхронизация';
        case 'gps':
          return forestry ? 'GPS активен' : 'GPS';
        case 'gpsOff':
          return forestry ? 'GPS неактивен' : 'GPS выкл';
        case 'compliance':
          return 'Соответствие';
        case 'violation':
          return 'Нарушение';
        case 'audit':
          return 'Аудит';
        default:
          return 'Статус';
      }
    };
    
    const Icon = getIcon();
    const currentVariant = getVariant();
    const statusText = getStatusText();
    
    return (
      <div
        ref={ref}
        className={cn(
          statusBadgeVariants({
            variant: currentVariant,
            size: fieldOps.shouldUseLargeButtons ? "lg" : size,
            fieldMode: fieldMode || fieldOps.shouldUseHighContrast,
            compact: fieldOps.shouldUseCompactLayout,
            animated: animated || pulse,
            className
          })
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        {showIcon && (
          <Icon className={cn(
            fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3",
            fieldOps.shouldUseLargerText && "w-4 h-4"
          )} />
        )}
        
        {showText && (
          <span className={cn(
            "font-medium",
            fieldOps.shouldUseLargerText && "text-sm"
          )}>
            {statusText}
          </span>
        )}
        
        {count !== undefined && (
          <span className={cn(
            "ml-1 rounded-full bg-current/20 px-1.5 py-0.5 text-xs font-bold",
            fieldOps.shouldUseLargerText && "text-sm"
          )}>
            {count > 99 ? '99+' : count}
          </span>
        )}
      </div>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';

// Forestry-specific status badge components
export const ComplianceBadge = React.forwardRef<HTMLDivElement, Omit<StatusBadgeProps, 'status'>>(
  (props, ref) => <StatusBadge ref={ref} status="compliance" forestry={true} {...props} />
);

export const ViolationBadge = React.forwardRef<HTMLDivElement, Omit<StatusBadgeProps, 'status'>>(
  (props, ref) => <StatusBadge ref={ref} status="violation" forestry={true} {...props} />
);

export const AuditBadge = React.forwardRef<HTMLDivElement, Omit<StatusBadgeProps, 'status'>>(
  (props, ref) => <StatusBadge ref={ref} status="audit" forestry={true} {...props} />
);

export const GPSBadge = React.forwardRef<HTMLDivElement, Omit<StatusBadgeProps, 'status'> & { active?: boolean }>(
  ({ active = true, ...props }, ref) => (
    <StatusBadge 
      ref={ref} 
      status={active ? "gps" : "gpsOff"} 
      forestry={true} 
      {...props} 
    />
  )
);

export const SyncBadge = React.forwardRef<HTMLDivElement, Omit<StatusBadgeProps, 'status'> & { syncing?: boolean }>(
  ({ syncing = false, ...props }, ref) => (
    <StatusBadge 
      ref={ref} 
      status={syncing ? "syncing" : "online"} 
      forestry={true} 
      animated={syncing}
      {...props} 
    />
  )
);

export { StatusBadge, statusBadgeVariants };
