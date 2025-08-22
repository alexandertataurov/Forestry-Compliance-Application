import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { useFieldOperations } from './use-mobile';
import { 
  MapPin, 
  Gps, 
  GpsOff, 
  Navigation, 
  Compass,
  Target,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { GPSBadge } from './status-badge';

export interface MapLocation {
  id: string;
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
  label?: string;
  type: 'current' | 'saved' | 'waypoint' | 'boundary' | 'measurement';
  color?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LocationMapProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof locationMapVariants> {
  locations: MapLocation[];
  currentLocation?: MapLocation;
  center?: { lat: number; lng: number };
  zoom?: number;
  showAccuracy?: boolean;
  showCompass?: boolean;
  showGrid?: boolean;
  showBoundaries?: boolean;
  allowOffline?: boolean;
  onLocationSelect?: (location: MapLocation) => void;
  onLocationAdd?: (location: MapLocation) => void;
  onLocationUpdate?: (location: MapLocation) => void;
  onLocationDelete?: (locationId: string) => void;
  forestry?: boolean;
  fieldMode?: boolean;
}

const locationMapVariants = cva(
  "relative w-full bg-surface-card border border-surface-border rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-surface-bg",
        field: "bg-white/95 dark:bg-gray-900/95 border-2 border-surface-border",
        compact: "bg-surface-card",
        offline: "bg-surface-card/50 border-status-warning/20",
      },
      size: {
        sm: "h-48",
        default: "h-64",
        lg: "h-80",
        xl: "h-96",
      },
      state: {
        loading: "animate-pulse",
        error: "border-status-error/20",
        offline: "border-status-warning/20",
        online: "border-status-success/20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      state: "online",
    },
  }
);

export const LocationMap = React.forwardRef<HTMLDivElement, LocationMapProps>(
  ({ 
    className, 
    variant, 
    size, 
    state,
    locations = [],
    currentLocation,
    center,
    zoom = 15,
    showAccuracy = true,
    showCompass = true,
    showGrid = false,
    showBoundaries = false,
    allowOffline = true,
    onLocationSelect,
    onLocationAdd,
    onLocationUpdate,
    onLocationDelete,
    forestry = false,
    fieldMode = false,
    ...props 
  }, ref) => {
    const fieldOps = useFieldOperations();
    const [mapState, setMapState] = useState<'loading' | 'error' | 'offline' | 'online'>('loading');
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [mapCenter, setMapCenter] = useState(center);
    const [showControls, setShowControls] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [compassHeading, setCompassHeading] = useState(0);
    const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

    // Check GPS and network availability
    const isGPSAvailable = 'geolocation' in navigator;
    const isOnline = navigator.onLine;

    // Initialize map state
    useEffect(() => {
      if (!isGPSAvailable) {
        setMapState('error');
      } else if (!isOnline && !allowOffline) {
        setMapState('offline');
      } else {
        setMapState('online');
      }
    }, [isGPSAvailable, isOnline, allowOffline]);

    // Update map center when current location changes
    useEffect(() => {
      if (currentLocation) {
        setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      }
    }, [currentLocation]);

    // Handle compass heading
    useEffect(() => {
      if (showCompass && 'DeviceOrientationEvent' in window) {
        const handleOrientation = (event: DeviceOrientationEvent) => {
          if (event.alpha !== null) {
            setCompassHeading(event.alpha);
          }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        return () => window.removeEventListener('deviceorientation', handleOrientation);
      }
    }, [showCompass]);

    // Format coordinates for display
    const formatCoordinate = (coord: number, precision: number = 6) => {
      return coord.toFixed(precision);
    };

    // Calculate distance between two points
    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    // Handle location selection
    const handleLocationClick = (location: MapLocation) => {
      setSelectedLocation(location);
      if (onLocationSelect) {
        onLocationSelect(location);
      }
    };

    // Handle zoom controls
    const handleZoomIn = () => {
      setCurrentZoom(prev => Math.min(prev + 1, 20));
    };

    const handleZoomOut = () => {
      setCurrentZoom(prev => Math.max(prev - 1, 1));
    };

    const handleResetView = () => {
      setCurrentZoom(zoom);
      if (currentLocation) {
        setMapCenter({ lat: currentLocation.lat, lng: currentLocation.lng });
      }
    };

    // Handle location tracking
    const handleStartTracking = () => {
      if (!isGPSAvailable) return;
      
      setIsTracking(true);
      // Start GPS tracking logic here
    };

    const handleStopTracking = () => {
      setIsTracking(false);
      // Stop GPS tracking logic here
    };

    // Get location icon
    const getLocationIcon = (location: MapLocation) => {
      switch (location.type) {
        case 'current':
          return <Gps className="w-4 h-4" />;
        case 'saved':
          return <MapPin className="w-4 h-4" />;
        case 'waypoint':
          return <Target className="w-4 h-4" />;
        case 'boundary':
          return <Navigation className="w-4 h-4" />;
        case 'measurement':
          return <Compass className="w-4 h-4" />;
        default:
          return <MapPin className="w-4 h-4" />;
      }
    };

    // Get location color
    const getLocationColor = (location: MapLocation) => {
      if (location.color) return location.color;
      
      switch (location.type) {
        case 'current':
          return '#007AFF';
        case 'saved':
          return '#34C759';
        case 'waypoint':
          return '#FF9500';
        case 'boundary':
          return '#AF52DE';
        case 'measurement':
          return '#FF3B30';
        default:
          return '#6B7280';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          locationMapVariants({ 
            variant: fieldOps.shouldUseHighContrast ? "field" : variant, 
            size: fieldOps.shouldUseLargeButtons ? "lg" : size, 
            state: mapState 
          }),
          fieldOps.shouldUseCompactLayout && "h-48",
          className
        )}
        {...props}
      >
        {/* Map Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-surface-bg/95 backdrop-blur-sm border-b border-surface-border p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className={cn(
                "text-brand-primary",
                fieldOps.shouldUseLargeButtons ? "w-5 h-5" : "w-4 h-4"
              )} />
              <span className={cn(
                "font-medium text-surface-on-surface",
                fieldOps.shouldUseLargerText && "text-field-lg"
              )}>
                {forestry ? 'Карта местоположений' : 'Location Map'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <GPSBadge 
                active={isGPSAvailable && isOnline} 
                fieldMode={fieldMode}
                compact={fieldOps.shouldUseCompactLayout}
              />
              
              <button
                onClick={() => setShowControls(!showControls)}
                className={cn(
                  "touch-target p-1",
                  fieldOps.shouldUseLargeButtons && "p-2"
                )}
              >
                <Settings className={cn(
                  "w-4 h-4 text-surface-on-variant",
                  fieldOps.shouldUseLargeButtons && "w-5 h-5"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Map Content */}
        <div className="relative w-full h-full">
          {/* Map Placeholder - In a real implementation, this would be a map library */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <div className={cn(
                "text-field-lg font-medium text-surface-on-variant mb-2",
                fieldOps.shouldUseLargerText && "text-field-xl"
              )}>
                {mapState === 'loading' && (forestry ? 'Загрузка карты...' : 'Loading map...')}
                {mapState === 'error' && (forestry ? 'Ошибка GPS' : 'GPS Error')}
                {mapState === 'offline' && (forestry ? 'Офлайн режим' : 'Offline Mode')}
                {mapState === 'online' && (forestry ? 'Карта готова' : 'Map Ready')}
              </div>
              
              {mapCenter && (
                <div className={cn(
                  "text-field-sm text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {formatCoordinate(mapCenter.lat)}, {formatCoordinate(mapCenter.lng)}
                </div>
              )}
            </div>
          </div>

          {/* Location Markers */}
          {locations.map(location => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${((location.lng + 180) / 360) * 100}%`,
                top: `${((90 - location.lat) / 180) * 100}%`,
              }}
              onClick={() => handleLocationClick(location)}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full border-2 border-white shadow-lg",
                  selectedLocation?.id === location.id && "ring-2 ring-brand-primary"
                )}
                style={{
                  backgroundColor: getLocationColor(location),
                  width: location.type === 'current' ? '24px' : '20px',
                  height: location.type === 'current' ? '24px' : '20px',
                }}
              >
                {getLocationIcon(location)}
              </div>
              
              {showAccuracy && location.accuracy && (
                <div
                  className="absolute inset-0 border border-current rounded-full opacity-20"
                  style={{
                    width: `${Math.max(location.accuracy * 2, 20)}px`,
                    height: `${Math.max(location.accuracy * 2, 20)}px`,
                    marginLeft: `-${Math.max(location.accuracy, 10)}px`,
                    marginTop: `-${Math.max(location.accuracy, 10)}px`,
                  }}
                />
              )}
            </div>
          ))}

          {/* Compass */}
          {showCompass && compassHeading !== 0 && (
            <div className="absolute top-16 right-4 bg-surface-bg/95 backdrop-blur-sm rounded-lg p-2 border border-surface-border">
              <div className="flex items-center gap-2">
                <Compass 
                  className="w-4 h-4 text-surface-on-variant"
                  style={{ transform: `rotate(${compassHeading}deg)` }}
                />
                <span className={cn(
                  "text-field-xs font-mono",
                  fieldOps.shouldUseLargerText && "text-field-sm"
                )}>
                  {Math.round(compassHeading)}°
                </span>
              </div>
            </div>
          )}

          {/* Map Controls */}
          {showControls && (
            <div className="absolute bottom-4 right-4 bg-surface-bg/95 backdrop-blur-sm rounded-lg p-2 border border-surface-border">
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleZoomIn}
                  className={cn(
                    "touch-target p-2 rounded",
                    fieldOps.shouldUseLargeButtons && "p-3"
                  )}
                >
                  <ZoomIn className={cn(
                    "w-4 h-4 text-surface-on-variant",
                    fieldOps.shouldUseLargeButtons && "w-5 h-5"
                  )} />
                </button>
                
                <button
                  onClick={handleZoomOut}
                  className={cn(
                    "touch-target p-2 rounded",
                    fieldOps.shouldUseLargeButtons && "p-3"
                  )}
                >
                  <ZoomOut className={cn(
                    "w-4 h-4 text-surface-on-variant",
                    fieldOps.shouldUseLargeButtons && "w-5 h-5"
                  )} />
                </button>
                
                <button
                  onClick={handleResetView}
                  className={cn(
                    "touch-target p-2 rounded",
                    fieldOps.shouldUseLargeButtons && "p-3"
                  )}
                >
                  <RotateCcw className={cn(
                    "w-4 h-4 text-surface-on-variant",
                    fieldOps.shouldUseLargeButtons && "w-5 h-5"
                  )} />
                </button>
              </div>
            </div>
          )}

          {/* Tracking Controls */}
          <div className="absolute bottom-4 left-4">
            <button
              onClick={isTracking ? handleStopTracking : handleStartTracking}
              disabled={!isGPSAvailable}
              className={cn(
                "ios-button touch-target",
                isTracking ? "ios-button-secondary" : "ios-button-primary",
                fieldOps.shouldUseLargeButtons && "ios-button-lg"
              )}
            >
              {isTracking ? (
                <Target className="w-4 h-4" />
              ) : (
                <Gps className="w-4 h-4" />
              )}
              <span>
                {isTracking 
                  ? (forestry ? 'Остановить' : 'Stop')
                  : (forestry ? 'Отслеживать' : 'Track')
                }
              </span>
            </button>
          </div>
        </div>

        {/* Location Details Panel */}
        {selectedLocation && (
          <div className="absolute top-16 left-4 right-4 bg-surface-bg/95 backdrop-blur-sm rounded-lg p-3 border border-surface-border">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getLocationColor(selectedLocation) }}
                />
                <span className={cn(
                  "font-medium text-surface-on-surface",
                  fieldOps.shouldUseLargerText && "text-field-lg"
                )}>
                  {selectedLocation.label || `${forestry ? 'Местоположение' : 'Location'} ${selectedLocation.id}`}
                </span>
              </div>
              
              <button
                onClick={() => setSelectedLocation(null)}
                className="touch-target p-1"
              >
                <XCircle className="w-4 h-4 text-surface-on-variant" />
              </button>
            </div>
            
            <div className="space-y-1">
              <div className={cn(
                "text-field-sm text-surface-on-variant",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                {forestry ? 'Координаты' : 'Coordinates'}: {formatCoordinate(selectedLocation.lat)}, {formatCoordinate(selectedLocation.lng)}
              </div>
              
              {selectedLocation.accuracy && (
                <div className={cn(
                  "text-field-sm text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Точность' : 'Accuracy'}: {selectedLocation.accuracy.toFixed(1)}м
                </div>
              )}
              
              <div className={cn(
                "text-field-sm text-surface-on-variant",
                fieldOps.shouldUseLargerText && "text-field-base"
              )}>
                {forestry ? 'Время' : 'Time'}: {new Date(selectedLocation.timestamp).toLocaleString('ru-RU')}
              </div>
              
              {currentLocation && (
                <div className={cn(
                  "text-field-sm text-surface-on-variant",
                  fieldOps.shouldUseLargerText && "text-field-base"
                )}>
                  {forestry ? 'Расстояние' : 'Distance'}: {calculateDistance(
                    currentLocation.lat, currentLocation.lng,
                    selectedLocation.lat, selectedLocation.lng
                  ).toFixed(2)} км
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => onLocationUpdate?.(selectedLocation)}
                className={cn(
                  "ios-button ios-button-secondary touch-target flex-1",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                <span>{forestry ? 'Изменить' : 'Edit'}</span>
              </button>
              
              <button
                onClick={() => onLocationDelete?.(selectedLocation.id)}
                className={cn(
                  "ios-button ios-button-secondary touch-target",
                  fieldOps.shouldUseLargeButtons && "ios-button-lg"
                )}
              >
                <span>{forestry ? 'Удалить' : 'Delete'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Status Indicators */}
        <div className="absolute top-16 left-4 flex flex-col gap-2">
          {mapState === 'offline' && (
            <div className="flex items-center gap-2 bg-status-warning/10 border border-status-warning/20 rounded-lg px-2 py-1">
              <AlertTriangle className="w-3 h-3 text-status-warning" />
              <span className={cn(
                "text-field-xs text-status-warning",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {forestry ? 'Офлайн' : 'Offline'}
              </span>
            </div>
          )}
          
          {mapState === 'error' && (
            <div className="flex items-center gap-2 bg-status-error/10 border border-status-error/20 rounded-lg px-2 py-1">
              <GpsOff className="w-3 h-3 text-status-error" />
              <span className={cn(
                "text-field-xs text-status-error",
                fieldOps.shouldUseLargerText && "text-field-sm"
              )}>
                {forestry ? 'GPS недоступен' : 'GPS Unavailable'}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

LocationMap.displayName = 'LocationMap';
