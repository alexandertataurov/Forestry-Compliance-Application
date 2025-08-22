import React from 'react';
import { CheckCircle, AlertTriangle, Clock, XCircle, Info, Star } from 'lucide-react';

interface StatusBadgeProps {
  status: 'valid' | 'invalid' | 'pending' | 'warning' | 'info' | 'success' | 'error';
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  size = 'md',
  variant = 'default',
  showIcon = true,
  className = '',
}: StatusBadgeProps) {
  const statusConfig = {
    valid: {
      icon: CheckCircle,
      colors: {
        default: 'bg-state-success/10 text-state-success border-state-success/20',
        outline: 'border-state-success text-state-success bg-transparent',
        solid: 'bg-state-success text-white border-state-success',
      },
    },
    invalid: {
      icon: XCircle,
      colors: {
        default: 'bg-state-error/10 text-state-error border-state-error/20',
        outline: 'border-state-error text-state-error bg-transparent',
        solid: 'bg-state-error text-white border-state-error',
      },
    },
    pending: {
      icon: Clock,
      colors: {
        default: 'bg-state-warning/10 text-state-warning border-state-warning/20',
        outline: 'border-state-warning text-state-warning bg-transparent',
        solid: 'bg-state-warning text-white border-state-warning',
      },
    },
    warning: {
      icon: AlertTriangle,
      colors: {
        default: 'bg-state-warning/10 text-state-warning border-state-warning/20',
        outline: 'border-state-warning text-state-warning bg-transparent',
        solid: 'bg-state-warning text-white border-state-warning',
      },
    },
    info: {
      icon: Info,
      colors: {
        default: 'bg-state-info/10 text-state-info border-state-info/20',
        outline: 'border-state-info text-state-info bg-transparent',
        solid: 'bg-state-info text-white border-state-info',
      },
    },
    success: {
      icon: CheckCircle,
      colors: {
        default: 'bg-state-success/10 text-state-success border-state-success/20',
        outline: 'border-state-success text-state-success bg-transparent',
        solid: 'bg-state-success text-white border-state-success',
      },
    },
    error: {
      icon: XCircle,
      colors: {
        default: 'bg-state-error/10 text-state-error border-state-error/20',
        outline: 'border-state-error text-state-error bg-transparent',
        solid: 'bg-state-error text-white border-state-error',
      },
    },
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-bodySmall',
    md: 'px-3 py-1.5 text-bodySmall',
    lg: 'px-4 py-2 text-body',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border font-medium
        ${sizeClasses[size]}
        ${config.colors[variant]}
        ${className}
      `}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </div>
  );
}

// Data Validation Status Component
interface DataValidationStatusProps {
  validations: Array<{
    field: string;
    status: 'valid' | 'invalid' | 'pending' | 'warning';
    message?: string;
  }>;
  className?: string;
}

export function DataValidationStatus({ validations, className = '' }: DataValidationStatusProps) {
  const statusCounts = validations.reduce(
    (acc, validation) => {
      acc[validation.status]++;
      return acc;
    },
    { valid: 0, invalid: 0, pending: 0, warning: 0 }
  );

  const overallStatus = 
    statusCounts.invalid > 0 ? 'invalid' :
    statusCounts.warning > 0 ? 'warning' :
    statusCounts.pending > 0 ? 'pending' : 'valid';

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-surface-border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-title font-semibold text-surface-onSurface">
          Data Validation
        </h3>
        <StatusBadge status={overallStatus} label={overallStatus.toUpperCase()} />
      </div>

      <div className="space-y-3">
        {validations.map((validation, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-bgVariant">
            <div className="flex items-center gap-3">
              <StatusBadge 
                status={validation.status} 
                label={validation.field} 
                size="sm" 
                showIcon={false}
              />
              {validation.message && (
                <span className="text-bodySmall text-surface-onVariant">
                  {validation.message}
                </span>
              )}
            </div>
            <StatusBadge status={validation.status} label="" size="sm" />
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-surface-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-headline font-bold text-state-success">{statusCounts.valid}</div>
            <div className="text-bodySmall text-surface-onVariant">Valid</div>
          </div>
          <div>
            <div className="text-headline font-bold text-state-error">{statusCounts.invalid}</div>
            <div className="text-bodySmall text-surface-onVariant">Invalid</div>
          </div>
          <div>
            <div className="text-headline font-bold text-state-warning">{statusCounts.warning}</div>
            <div className="text-bodySmall text-surface-onVariant">Warning</div>
          </div>
          <div>
            <div className="text-headline font-bold text-surface-onVariant">{statusCounts.pending}</div>
            <div className="text-bodySmall text-surface-onVariant">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quality Rating Badge Component
interface QualityRatingBadgeProps {
  rating: number;
  maxRating?: number;
  showStars?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QualityRatingBadge({
  rating,
  maxRating = 5,
  showStars = true,
  size = 'md',
  className = '',
}: QualityRatingBadgeProps) {
  const percentage = (rating / maxRating) * 100;
  
  const getRatingStatus = () => {
    if (percentage >= 90) return { status: 'success' as const, label: 'Excellent' };
    if (percentage >= 80) return { status: 'success' as const, label: 'Good' };
    if (percentage >= 70) return { status: 'warning' as const, label: 'Fair' };
    if (percentage >= 60) return { status: 'warning' as const, label: 'Poor' };
    return { status: 'error' as const, label: 'Very Poor' };
  };

  const { status, label } = getRatingStatus();

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showStars && (
        <div className="flex items-center gap-1">
          {Array.from({ length: maxRating }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'text-state-warning fill-current' : 'text-surface-border'
              }`}
            />
          ))}
        </div>
      )}
      <StatusBadge status={status} label={`${label} (${rating}/${maxRating})`} size={size} showIcon={false} />
    </div>
  );
}

// Connection Status Badge Component
interface ConnectionStatusBadgeProps {
  isOnline: boolean;
  lastSeen?: string;
  className?: string;
}

export function ConnectionStatusBadge({ isOnline, lastSeen, className = '' }: ConnectionStatusBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-state-success' : 'bg-state-error'}`} />
      <StatusBadge
        status={isOnline ? 'success' : 'error'}
        label={isOnline ? 'Online' : 'Offline'}
        size="sm"
        showIcon={false}
      />
      {lastSeen && !isOnline && (
        <span className="text-bodySmall text-surface-onVariant">
          Last seen: {new Date(lastSeen).toLocaleString()}
        </span>
      )}
    </div>
  );
}
