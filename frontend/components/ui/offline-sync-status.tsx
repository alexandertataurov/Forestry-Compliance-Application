import * as React from 'react';
import { useState, useEffect } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Upload,
  Download,
  Pause,
  Play,
  Settings,
  Info,
  XCircle
} from 'lucide-react';
import { StatusBadge } from './status-badge';

export interface SyncItem {
  id: string;
  type: 'calculation' | 'measurement' | 'location' | 'document';
  data: any;
  timestamp: number;
  retryCount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  error?: string;
}

export interface OfflineSyncStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof offlineSyncStatusVariants> {
  isOnline: boolean;
  pendingSync: number;
  syncing: boolean;
  syncProgress?: number;
  lastSyncTime?: number;
  syncItems?: SyncItem[];
  onSyncNow?: () => void;
  onPauseSync?: () => void;
  onRetryFailed?: () => void;
  onClearFailed?: () => void;
  showDetails?: boolean;
  compact?: boolean;
  forestry?: boolean;
}

const offlineSyncStatusVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "bg-surface-bg border border-surface-border rounded-lg",
        field: "bg-white/95 dark:bg-gray-900/95 border-2 border-surface-border rounded-lg",
        compact: "bg-surface-card border border-surface-border rounded-md",
      },
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
      },
      state: {
        online: "border-status-success/20",
        offline: "border-status-error/20",
        syncing: "border-status-info/20",
        error: "border-status-error/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "online",
    },
  }
);

export const OfflineSyncStatus = React.forwardRef<HTMLDivElement, OfflineSyncStatusProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    isOnline,
    pendingSync,
    syncing,
    syncProgress = 0,
    lastSyncTime,
    syncItems = [],
    onSyncNow,
    onPauseSync,
    onRetryFailed,
    onClearFailed,
    showDetails = false,
    compact = false,
    forestry = false,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    const [showQueue, setShowQueue] = useState(false);
    const [autoSync, setAutoSync] = useState(true);

    // Calculate sync statistics
    const pendingItems = syncItems.filter(item => item.status === 'pending');
    const syncingItems = syncItems.filter(item => item.status === 'syncing');
    const completedItems = syncItems.filter(item => item.status === 'completed');
    const failedItems = syncItems.filter(item => item.status === 'failed');

    // Get priority counts
    const criticalItems = pendingItems.filter(item => item.priority === 'critical');
    const highPriorityItems = pendingItems.filter(item => item.priority === 'high');

    // Determine current state
    const getCurrentState = () => {
      if (!isOnline) return 'offline';
      if (syncing) return 'syncing';
      if (failedItems.length > 0) return 'error';
      return 'online';
    };

    const currentState = getCurrentState();

    // Format last sync time
    const formatLastSync = (timestamp: number) => {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (days > 0) return forestry ? `${days} дн. назад` : `${days}d ago`;
      if (hours > 0) return forestry ? `${hours} ч. назад` : `${hours}h ago`;
      if (minutes > 0) return forestry ? `${minutes} мин. назад` : `${minutes}m ago`;
      return forestry ? 'Только что' : 'Just now';
    };

    // Get status text
    const getStatusText = () => {
      if (!isOnline) return forestry ? 'Нет подключения' : 'Offline';
      if (syncing) return forestry ? 'Синхронизация...' : 'Syncing...';
      if (pendingSync > 0) return forestry ? `${pendingSync} ожидают` : `${pendingSync} pending`;
      return forestry ? 'Синхронизировано' : 'Synced';
    };

    // Get status icon
    const getStatusIcon = () => {
      if (!isOnline) return WifiOff;
      if (syncing) return RefreshCw;
      if (pendingSync > 0) return Database;
      return CheckCircle;
    };

    const StatusIcon = getStatusIcon();

    return (
      <div
        ref={ref}
        className={cn(
          offlineSyncStatusVariants({ 
            variant: fieldOps.shouldUseHighContrast ? "field" : variant, 
            size: fieldOps.shouldUseLargeButtons ? "lg" : size, 
            state: currentState 
          }),
          fieldOps.shouldUseCompactLayout && "p-2",
          className
        )}
        {...props}
      >
        {/* Main Status Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2",
              fieldOps.shouldUseLargeButtons && "gap-3"
            )}>
              <div className={cn(
                "relative",
                fieldOps.shouldUseLargeButtons && "scale-110"
              )}>
                <StatusIcon className={cn(
                  currentState === 'offline' ? "text-status-error" :
                  currentState === 'syncing' ? "text-status-info" :
                  currentState === 'error' ? "text-status-error" : "text-status-success",
                  fieldOps.shouldUseLargeButtons ? "w-6 h-6" : "w-5 h-5",
                  syncing && "animate-spin"
                )} />
                
                {criticalItems.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-error rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {criticalItems.length > 9 ? '9+' : criticalItems.length}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <div className={cn(
                  "font-medium text-surface-on-surface",
                  fieldOps.shouldUseLargerText && "text-field-lg"
                )}>
                  {getStatusText()}
                </div>
                
                {lastSyncTime && (
                  <div className={cn(
                    "text-field-xs text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-sm"
                  )}>
                    {forestry ? 'Последняя синхронизация' : 'Last sync'}: {formatLastSync(lastSyncTime)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Priority Indicators */}
            {criticalItems.length > 0 && (
              <StatusBadge
                status="error"
                count={criticalItems.length}
                showText={false}
                fieldMode={fieldOps.shouldUseHighContrast}
                compact={fieldOps.shouldUseCompactLayout}
              />
            )}
            
            {highPriorityItems.length > 0 && (
              <StatusBadge
                status="warning"
                count={highPriorityItems.length}
                showText={false}
                fieldMode={fieldOps.shouldUseHighContrast}
                compact={fieldOps.shouldUseCompactLayout}
              />
            )}

            {/* Action Buttons */}
            {isOnline && pendingSync > 0 && (
              <button
                onClick={onSyncNow}
                disabled={syncing}
                className={cn(
                  "ios-button ios-button-primary touch-target",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                {syncing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>
                  {syncing 
                    ? (forestry ? 'Синхронизация...' : 'Syncing...')
                    : (forestry ? 'Синхронизировать' : 'Sync Now')
                  }
                </span>
              </button>
            )}

            {syncing && onPauseSync && (
              <button
                onClick={onPauseSync}
                className={cn(
                  "ios-button ios-button-secondary touch-target",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                <Pause className="w-4 h-4" />
                <span>{forestry ? 'Пауза' : 'Pause'}</span>
              </button>
            )}

            {showDetails && (
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={cn(
                  "ios-button ios-button-secondary touch-target",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                <Info className="w-4 h-4" />
                <span>{forestry ? 'Детали' : 'Details'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {syncing && syncProgress > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-field-xs text-surface-on-variant",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {forestry ? 'Прогресс синхронизации' : 'Sync Progress'}
              </span>
              <span className={cn(
                "text-field-xs font-medium",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {Math.round(syncProgress)}%
              </span>
            </div>
            <div className="w-full bg-surface-border rounded-full h-2">
              <div 
                className="bg-status-info h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Sync Queue Details */}
        {showQueue && showDetails && (
          <div className="mt-4 pt-4 border-t border-surface-border">
            <div className={cn(
              "text-field-sm font-medium mb-3",
              fieldOps.shouldUseLargerText && "text-field-base"
            )}>
              {forestry ? 'Очередь синхронизации' : 'Sync Queue'}
            </div>
            
            <div className="space-y-2">
              {/* Pending Items */}
              {pendingItems.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-status-warning/10 rounded-md">
                  <div className="flex items-center gap-2">
                    <Clock className={cn(
                      "text-status-warning",
                      fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Ожидают' : 'Pending'}
                    </span>
                  </div>
                  <span className={cn(
                    "font-medium text-status-warning",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {pendingItems.length}
                  </span>
                </div>
              )}

              {/* Syncing Items */}
              {syncingItems.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-status-info/10 rounded-md">
                  <div className="flex items-center gap-2">
                    <RefreshCw className={cn(
                      "text-status-info animate-spin",
                      fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Синхронизация' : 'Syncing'}
                    </span>
                  </div>
                  <span className={cn(
                    "font-medium text-status-info",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {syncingItems.length}
                  </span>
                </div>
              )}

              {/* Completed Items */}
              {completedItems.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-status-success/10 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={cn(
                      "text-status-success",
                      fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Завершено' : 'Completed'}
                    </span>
                  </div>
                  <span className={cn(
                    "font-medium text-status-success",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {completedItems.length}
                  </span>
                </div>
              )}

              {/* Failed Items */}
              {failedItems.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-status-error/10 rounded-md">
                  <div className="flex items-center gap-2">
                    <XCircle className={cn(
                      "text-status-error",
                      fieldOps.shouldUseLargeButtons ? "w-4 h-4" : "w-3 h-3"
                    )} />
                    <span className={cn(
                      "text-field-sm",
                      fieldOps.shouldUseLargerText && "text-field-base"
                    )}>
                      {forestry ? 'Ошибки' : 'Failed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium text-status-error",
                      fieldOps.shouldUseLargerText && "text-field-lg"
                    )}>
                      {failedItems.length}
                    </span>
                    {onRetryFailed && (
                      <button
                        onClick={onRetryFailed}
                        className={cn(
                          "text-status-error hover:text-status-error/80 touch-target p-1",
                          fieldOps.shouldUseLargeButtons && "p-2"
                        )}
                      >
                        <RefreshCw className={cn(
                          "w-3 h-3",
                          fieldOps.shouldUseLargeButtons && "w-4 h-4"
                        )} />
                      </button>
                    )}
                    {onClearFailed && (
                      <button
                        onClick={onClearFailed}
                        className={cn(
                          "text-status-error hover:text-status-error/80 touch-target p-1",
                          fieldOps.shouldUseLargeButtons && "p-2"
                        )}
                      >
                        <XCircle className={cn(
                          "w-3 h-3",
                          fieldOps.shouldUseLargeButtons && "w-4 h-4"
                        )} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auto-sync Toggle */}
            <div className="mt-3 pt-3 border-t border-surface-border">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className={cn(
                    "w-4 h-4 text-brand-primary border-surface-border rounded focus:ring-brand-primary/20",
                    fieldOps.shouldUseLargeButtons && "w-5 h-5"
                  )}
                />
                <span className={cn(
                  "text-field-sm",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Автоматическая синхронизация' : 'Auto-sync'}
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Offline Warning */}
        {!isOnline && (
          <div className="mt-3 p-3 bg-status-error/10 border border-status-error/20 rounded-lg">
            <div className="flex items-center gap-2">
              <WifiOff className={cn(
                "text-status-error",
                fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
              )} />
              <span className={cn(
                "text-status-error text-field-sm",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                {forestry 
                  ? 'Работа в автономном режиме. Данные будут синхронизированы при подключении.'
                  : 'Working offline. Data will sync when connection is restored.'
                }
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OfflineSyncStatus.displayName = 'OfflineSyncStatus';
