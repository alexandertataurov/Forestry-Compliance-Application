import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { 
  MapPin, 
  Gps, 
  GpsOff, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Wifi,
  WifiOff,
  Save,
  Loader2,
  Navigation,
  Compass
} from 'lucide-react';
import { GPSBadge } from './status-badge';

export interface GPSCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
}

export interface GPSInputProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gpsInputVariants> {
  value?: GPSCoordinates | null;
  onChange?: (coordinates: GPSCoordinates | null) => void;
  placeholder?: string;
  showAccuracy?: boolean;
  showTimestamp?: boolean;
  allowManualEntry?: boolean;
  precision?: number;
  required?: boolean;
  disabled?: boolean;
  autoCapture?: boolean;
  showMap?: boolean;
  showCompass?: boolean;
  showSpeed?: boolean;
  showAltitude?: boolean;
  forestry?: boolean;
  fieldMode?: boolean;
}

const gpsInputVariants = cva(
  "relative w-full",
  {
    variants: {
      variant: {
        default: "",
        field: "border-2 border-surface-border rounded-lg",
        compact: "border border-surface-border rounded-md",
      },
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
      },
      state: {
        default: "",
        capturing: "ring-2 ring-status-info/20",
        success: "ring-2 ring-status-success/20",
        error: "ring-2 ring-status-error/20",
        offline: "ring-2 ring-status-warning/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "default",
    },
  }
);

export const GPSInput = React.forwardRef<HTMLDivElement, GPSInputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    value,
    onChange,
    placeholder = "Определить GPS координаты",
    showAccuracy = true,
    showTimestamp = true,
    allowManualEntry = true,
    precision = 6,
    required = false,
    disabled = false,
    autoCapture = false,
    showMap = false,
    showCompass = false,
    showSpeed = false,
    showAltitude = false,
    forestry = false,
    fieldMode = false,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastKnownLocation, setLastKnownLocation] = useState<GPSCoordinates | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);
    const [manualLat, setManualLat] = useState('');
    const [manualLng, setManualLng] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);

    // Check GPS availability
    const isGPSAvailable = 'geolocation' in navigator;
    const isOnline = navigator.onLine;

    // Format coordinates for display
    const formatCoordinate = (coord: number, precision: number = 6) => {
      return coord.toFixed(precision);
    };

    // Format accuracy for display
    const formatAccuracy = (accuracy: number) => {
      if (accuracy < 1) return '< 1м';
      if (accuracy < 10) return `${accuracy.toFixed(1)}м`;
      return `${Math.round(accuracy)}м`;
    };

    // Format timestamp for display
    const formatTimestamp = (timestamp: number) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    };

    // Handle GPS success
    const handleGPSSuccess = useCallback((position: GeolocationPosition) => {
      const coordinates: GPSCoordinates = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
        altitude: position.coords.altitude || undefined,
        heading: position.coords.heading || undefined,
        speed: position.coords.speed || undefined,
      };

      setLastKnownLocation(coordinates);
      setError(null);
      setIsCapturing(false);
      
      if (onChange) {
        onChange(coordinates);
      }
    }, [onChange]);

    // Handle GPS error
    const handleGPSError = useCallback((error: GeolocationPositionError) => {
      setIsCapturing(false);
      setError(getErrorMessage(error.code));
    }, []);

    // Get error message
    const getErrorMessage = (code: number): string => {
      switch (code) {
        case 1:
          return forestry ? 'Доступ к GPS запрещён' : 'Permission denied';
        case 2:
          return forestry ? 'GPS недоступен' : 'Position unavailable';
        case 3:
          return forestry ? 'Превышено время ожидания GPS' : 'Timeout';
        default:
          return forestry ? 'Ошибка GPS' : 'GPS error';
      }
    };

    // Start GPS capture
    const startCapture = useCallback(() => {
      if (!isGPSAvailable) {
        setError(forestry ? 'GPS не поддерживается' : 'GPS not supported');
        return;
      }

      setIsCapturing(true);
      setError(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000,
      };

      if (autoCapture) {
        // Continuous tracking
        const id = navigator.geolocation.watchPosition(
          handleGPSSuccess,
          handleGPSError,
          options
        );
        setWatchId(id);
      } else {
        // Single capture
        navigator.geolocation.getCurrentPosition(
          handleGPSSuccess,
          handleGPSError,
          options
        );
      }
    }, [isGPSAvailable, autoCapture, handleGPSSuccess, handleGPSError, forestry]);

    // Stop GPS capture
    const stopCapture = useCallback(() => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setIsCapturing(false);
    }, [watchId]);

    // Handle manual coordinate entry
    const handleManualSubmit = () => {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);

      if (isNaN(lat) || isNaN(lng)) {
        setError(forestry ? 'Неверные координаты' : 'Invalid coordinates');
        return;
      }

      if (lat < -90 || lat > 90) {
        setError(forestry ? 'Широта должна быть от -90 до 90' : 'Latitude must be between -90 and 90');
        return;
      }

      if (lng < -180 || lng > 180) {
        setError(forestry ? 'Долгота должна быть от -180 до 180' : 'Longitude must be between -180 and 180');
        return;
      }

      const coordinates: GPSCoordinates = {
        lat,
        lng,
        timestamp: Date.now(),
      };

      setError(null);
      setShowManualInput(false);
      
      if (onChange) {
        onChange(coordinates);
      }
    };

    // Use last known location
    const useLastKnown = () => {
      if (lastKnownLocation && onChange) {
        onChange(lastKnownLocation);
      }
    };

    // Clear coordinates
    const clearCoordinates = () => {
      if (onChange) {
        onChange(null);
      }
      setError(null);
    };

    // Auto-capture on mount if enabled
    useEffect(() => {
      if (autoCapture && isGPSAvailable && !value) {
        startCapture();
      }

      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }, [autoCapture, isGPSAvailable, value, startCapture, watchId]);

    // Determine current state
    const getCurrentState = () => {
      if (error) return 'error';
      if (isCapturing) return 'capturing';
      if (value) return 'success';
      if (!isOnline) return 'offline';
      return 'default';
    };

    const currentState = getCurrentState();

    return (
      <div
        ref={ref}
        className={cn(
          gpsInputVariants({ variant, size, state: currentState }),
          fieldOps.shouldUseLargeButtons && "p-4",
          fieldOps.shouldUseLargerText && "p-4",
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gps className={cn(
              "text-status-info",
              fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
            )} />
            <span className={cn(
              "font-medium text-surface-on-surface",
              fieldOps.shouldUseLargerText && "text-field-lg"
            )}>
              {forestry ? 'Местоположение' : 'Location'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <GPSBadge 
              active={isGPSAvailable && isOnline} 
              fieldMode={fieldMode}
              compact={fieldOps.shouldUseCompactLayout}
            />
            {!isOnline && (
              <WifiOff className={cn(
                "text-status-warning",
                fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
              )} />
            )}
          </div>
        </div>

        {/* Current Coordinates Display */}
        {value && (
          <div className="ios-card p-3 mb-3">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-field-sm text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Широта' : 'Latitude'}:
                </span>
                <span className={cn(
                  "font-mono font-medium",
                  fieldOps.shouldUseLargerText && "text-field-lg"
                )}>
                  {formatCoordinate(value.lat, precision)}°
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-field-sm text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Долгота' : 'Longitude'}:
                </span>
                <span className={cn(
                  "font-mono font-medium",
                  fieldOps.shouldUseLargerText && "text-field-lg"
                )}>
                  {formatCoordinate(value.lng, precision)}°
                </span>
              </div>

              {showAccuracy && value.accuracy && (
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {forestry ? 'Точность' : 'Accuracy'}:
                  </span>
                  <span className={cn(
                    "font-medium",
                    value.accuracy < 5 ? "text-status-success" : 
                    value.accuracy < 20 ? "text-status-warning" : "text-status-error",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {formatAccuracy(value.accuracy)}
                  </span>
                </div>
              )}

              {showTimestamp && value.timestamp && (
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {forestry ? 'Время' : 'Time'}:
                  </span>
                  <span className={cn(
                    "font-medium",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {formatTimestamp(value.timestamp)}
                  </span>
                </div>
              )}

              {showAltitude && value.altitude && (
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {forestry ? 'Высота' : 'Altitude'}:
                  </span>
                  <span className={cn(
                    "font-medium",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {value.altitude.toFixed(1)}м
                  </span>
                </div>
              )}

              {showSpeed && value.speed && (
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-field-sm text-surface-on-variant",
                    fieldOps.shouldUseLargerText && "text-field-base"
                  )}>
                    {forestry ? 'Скорость' : 'Speed'}:
                  </span>
                  <span className={cn(
                    "font-medium",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}>
                    {(value.speed * 3.6).toFixed(1)} км/ч
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-3 bg-status-error/10 border border-status-error/20 rounded-lg">
            <AlertTriangle className={cn(
              "text-status-error",
              fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
            )} />
            <span className={cn(
              "text-status-error text-field-sm",
              fieldOps.shouldUseLargerText && "text-field-base"
            )}>
              {error}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className={cn(
          "grid gap-2",
          fieldOps.isMobile ? "grid-cols-1" : "grid-cols-2",
          fieldOps.isLandscape && "grid-cols-3 gap-1"
        )}>
          {!value && (
            <button
              onClick={startCapture}
              disabled={disabled || !isGPSAvailable || isCapturing}
              className={cn(
                "ios-button ios-button-primary touch-target",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              {isCapturing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Gps className="w-4 h-4" />
              )}
              <span>
                {isCapturing 
                  ? (forestry ? 'Определение...' : 'Capturing...')
                  : (forestry ? 'Определить GPS' : 'Capture GPS')
                }
              </span>
            </button>
          )}

          {value && (
            <button
              onClick={startCapture}
              disabled={disabled || !isGPSAvailable || isCapturing}
              className={cn(
                "ios-button ios-button-secondary touch-target",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              <RefreshCw className="w-4 h-4" />
              <span>{forestry ? 'Обновить' : 'Update'}</span>
            </button>
          )}

          {allowManualEntry && (
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              disabled={disabled}
              className={cn(
                "ios-button ios-button-secondary touch-target",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              <MapPin className="w-4 h-4" />
              <span>{forestry ? 'Ввести вручную' : 'Manual Entry'}</span>
            </button>
          )}

          {lastKnownLocation && !value && (
            <button
              onClick={useLastKnown}
              disabled={disabled}
              className={cn(
                "ios-button ios-button-secondary touch-target",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              <Clock className="w-4 h-4" />
              <span>{forestry ? 'Последнее местоположение' : 'Last Known'}</span>
            </button>
          )}

          {value && (
            <button
              onClick={clearCoordinates}
              disabled={disabled}
              className={cn(
                "ios-button ios-button-secondary touch-target",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              <GpsOff className="w-4 h-4" />
              <span>{forestry ? 'Очистить' : 'Clear'}</span>
            </button>
          )}
        </div>

        {/* Manual Input Form */}
        {showManualInput && (
          <div className="ios-card p-3 mt-3">
            <div className={cn(
              "text-field-sm font-medium mb-3",
              fieldOps.shouldUseLargerText && "text-field-base"
            )}>
              {forestry ? 'Введите координаты вручную' : 'Enter coordinates manually'}
            </div>
            
            <div className="grid gap-3">
              <div>
                <label className={cn(
                  "block text-field-sm font-medium mb-1",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Широта' : 'Latitude'} (-90 до 90)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="55.7558"
                  className={cn(
                    "w-full p-3 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface placeholder-surface-on-variant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
                    fieldOps.shouldUseLargeButtons && "py-4 text-field-base",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}
                />
              </div>
              
              <div>
                <label className={cn(
                  "block text-field-sm font-medium mb-1",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Долгота' : 'Longitude'} (-180 до 180)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLng}
                  onChange={(e) => setManualLng(e.target.value)}
                  placeholder="37.6176"
                  className={cn(
                    "w-full p-3 border border-surface-border rounded-lg bg-surface-bg text-surface-on-surface placeholder-surface-on-variant focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary",
                    fieldOps.shouldUseLargeButtons && "py-4 text-field-base",
                    fieldOps.shouldUseLargerText && "text-field-lg"
                  )}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualLat || !manualLng}
                  className={cn(
                    "ios-button ios-button-primary touch-target flex-1",
                    fieldOps.shouldUseLargeButtons && "ios-button-lg"
                  )}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{forestry ? 'Сохранить' : 'Save'}</span>
                </button>
                
                <button
                  onClick={() => setShowManualInput(false)}
                  className={cn(
                    "ios-button ios-button-secondary touch-target",
                    fieldOps.shouldUseLargeButtons && "ios-button-lg"
                  )}
                >
                  <span>{forestry ? 'Отмена' : 'Cancel'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Required Field Indicator */}
        {required && !value && (
          <div className="mt-2 text-status-error text-field-xs">
            {forestry ? 'Местоположение обязательно' : 'Location is required'}
          </div>
        )}
      </div>
    );
  }
);

GPSInput.displayName = 'GPSInput';