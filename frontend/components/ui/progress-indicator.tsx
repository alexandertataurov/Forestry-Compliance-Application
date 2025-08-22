import React from 'react';
import { CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface ProgressIndicatorProps {
  value: number;
  max?: number;
  status?: 'idle' | 'loading' | 'success' | 'error' | 'warning';
  label?: string;
  description?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sync' | 'upload' | 'download';
  className?: string;
}

export function ProgressIndicator({
  value,
  max = 100,
  status = 'idle',
  label,
  description,
  showPercentage = true,
  size = 'md',
  variant = 'default',
  className = '',
}: ProgressIndicatorProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const statusColors = {
    idle: 'bg-surface-borderVariant',
    loading: 'bg-brand-primary',
    success: 'bg-state-success',
    error: 'bg-state-error',
    warning: 'bg-state-warning',
  };

  const statusIcons = {
    idle: Clock,
    loading: RefreshCw,
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
  };

  const StatusIcon = statusIcons[status];

  const getVariantStyles = () => {
    switch (variant) {
      case 'sync':
        return {
          container: 'bg-surface-bgVariant border border-surface-border',
          progress: status === 'loading' ? 'animate-pulse' : '',
        };
      case 'upload':
        return {
          container: 'bg-state-info/10 border border-state-info/20',
          progress: 'bg-state-info',
        };
      case 'download':
        return {
          container: 'bg-state-success/10 border border-state-success/20',
          progress: 'bg-state-success',
        };
      default:
        return {
          container: 'bg-surface-bgVariant',
          progress: statusColors[status],
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <div className={`rounded-lg p-4 ${variantStyles.container} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {StatusIcon && (
            <StatusIcon 
              className={`w-4 h-4 ${
                status === 'loading' ? 'animate-spin text-brand-primary' :
                status === 'success' ? 'text-state-success' :
                status === 'error' ? 'text-state-error' :
                status === 'warning' ? 'text-state-warning' :
                'text-surface-onVariant'
              }`} 
            />
          )}
          {label && (
            <span className="text-label font-semibold text-surface-onSurface">
              {label}
            </span>
          )}
        </div>
        {showPercentage && (
          <span className="text-bodySmall font-medium text-surface-onVariant">
            {Math.round(percentage)}%
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`w-full rounded-full bg-surface-border ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${variantStyles.progress}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Description */}
      {description && (
        <div className="mt-2 text-bodySmall text-surface-onVariant">
          {description}
        </div>
      )}
    </div>
  );
}

// Sync Status Component
interface SyncStatusProps {
  status: 'synced' | 'syncing' | 'failed' | 'pending';
  lastSync?: string;
  itemsCount?: number;
  className?: string;
}

export function SyncStatus({ status, lastSync, itemsCount, className = '' }: SyncStatusProps) {
  const statusConfig = {
    synced: {
      icon: CheckCircle,
      color: 'text-state-success',
      bgColor: 'bg-state-success/10',
      borderColor: 'border-state-success/20',
      label: 'Synced',
    },
    syncing: {
      icon: RefreshCw,
      color: 'text-brand-primary',
      bgColor: 'bg-brand-primary/10',
      borderColor: 'border-brand-primary/20',
      label: 'Syncing...',
    },
    failed: {
      icon: AlertTriangle,
      color: 'text-state-error',
      bgColor: 'bg-state-error/10',
      borderColor: 'border-state-error/20',
      label: 'Sync Failed',
    },
    pending: {
      icon: Clock,
      color: 'text-state-warning',
      bgColor: 'bg-state-warning/10',
      borderColor: 'border-state-warning/20',
      label: 'Pending',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${config.bgColor} ${config.borderColor} ${className}`}>
      <Icon className={`w-5 h-5 ${config.color} ${status === 'syncing' ? 'animate-spin' : ''}`} />
      <div className="flex-1">
        <div className={`text-label font-semibold ${config.color}`}>
          {config.label}
        </div>
        {lastSync && (
          <div className="text-bodySmall text-surface-onVariant">
            Last sync: {new Date(lastSync).toLocaleString()}
          </div>
        )}
        {itemsCount !== undefined && (
          <div className="text-bodySmall text-surface-onVariant">
            {itemsCount} items
          </div>
        )}
      </div>
    </div>
  );
}

// Data Processing Progress Component
interface DataProcessingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  currentStepLabel?: string;
  className?: string;
}

export function DataProcessingProgress({
  currentStep,
  totalSteps,
  stepLabels,
  currentStepLabel,
  className = '',
}: DataProcessingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-surface-border ${className}`}>
      <div className="mb-4">
        <h3 className="text-title font-semibold text-surface-onSurface mb-2">
          Processing Data
        </h3>
        {currentStepLabel && (
          <p className="text-body text-surface-onVariant">{currentStepLabel}</p>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 rounded-full bg-surface-border overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-brand-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-bodySmall text-surface-onVariant">
        {stepLabels.map((label, index) => (
          <div
            key={index}
            className={`flex-1 text-center ${
              index < currentStep ? 'text-brand-primary font-medium' : ''
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Progress Text */}
      <div className="mt-3 text-center">
        <span className="text-bodySmall text-surface-onVariant">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
}
