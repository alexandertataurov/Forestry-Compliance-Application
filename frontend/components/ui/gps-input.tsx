import * as React from "react";
import { cn } from "./utils";
import { MapPin, Navigation, RotateCcw, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "./button";

interface GPSCoordinates {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

interface GPSInputProps {
  value?: GPSCoordinates | null;
  onChange: (coordinates: GPSCoordinates | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
  showValidation?: boolean;
  showAccuracy?: boolean;
  showTimestamp?: boolean;
  allowManualEntry?: boolean;
  precision?: number;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

const GPSInput = React.forwardRef<HTMLDivElement, GPSInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder = "Click to get current location",
      error,
      success,
      required = false,
      disabled = false,
      readOnly = false,
      size = "default",
      variant = "default",
      showValidation = true,
      showAccuracy = true,
      showTimestamp = false,
      allowManualEntry = true,
      precision = 6,
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      successClassName,
    },
    ref
  ) => {
    const [isGettingLocation, setIsGettingLocation] = React.useState(false);
    const [manualEntry, setManualEntry] = React.useState(false);
    const [latInput, setLatInput] = React.useState("");
    const [lngInput, setLngInput] = React.useState("");

    // Update manual inputs when value changes
    React.useEffect(() => {
      if (value) {
        setLatInput(value.lat.toFixed(precision));
        setLngInput(value.lng.toFixed(precision));
      } else {
        setLatInput("");
        setLngInput("");
      }
    }, [value, precision]);

    const getCurrentLocation = async () => {
      if (!navigator.geolocation) {
        return;
      }

      setIsGettingLocation(true);

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });

        const coordinates: GPSCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        onChange(coordinates);
      } catch (error) {
        console.error("Error getting location:", error);
      } finally {
        setIsGettingLocation(false);
      }
    };

    const clearLocation = () => {
      onChange(null);
      setLatInput("");
      setLngInput("");
    };

    const formatCoordinate = (coord: number, type: "lat" | "lng"): string => {
      const direction = type === "lat" ? (coord >= 0 ? "N" : "S") : (coord >= 0 ? "E" : "W");
      return `${Math.abs(coord).toFixed(precision)}° ${direction}`;
    };

    const validateCoordinate = (lat: string, lng: string): { isValid: boolean; error?: string } => {
      if (!lat && !lng) {
        if (required) {
          return { isValid: false, error: "GPS coordinates are required" };
        }
        return { isValid: true };
      }

      if (!lat || !lng) {
        return { isValid: false, error: "Both latitude and longitude are required" };
      }

      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);

      if (isNaN(latNum) || isNaN(lngNum)) {
        return { isValid: false, error: "Please enter valid coordinates" };
      }

      if (latNum < -90 || latNum > 90) {
        return { isValid: false, error: "Latitude must be between -90 and 90" };
      }

      if (lngNum < -180 || lngNum > 180) {
        return { isValid: false, error: "Longitude must be between -180 and 180" };
      }

      return { isValid: true };
    };

    const handleManualUpdate = () => {
      const validation = validateCoordinate(latInput, lngInput);
      if (validation.isValid && latInput && lngInput) {
        const coordinates: GPSCoordinates = {
          lat: parseFloat(latInput),
          lng: parseFloat(lngInput),
          timestamp: Date.now(),
        };
        onChange(coordinates);
        setManualEntry(false);
      }
    };

    const validation = validateCoordinate(latInput, lngInput);
    const hasError = showValidation && (error || validation.error);
    const hasSuccess = showValidation && success && !hasError;

    const sizeClasses = {
      sm: "text-sm p-2",
      default: "text-base p-3",
      lg: "text-lg p-4"
    };

    const variantClasses = {
      default: "border-surface-border bg-surface-bg",
      outline: "border-2 border-surface-border bg-transparent",
      filled: "border-transparent bg-surface-bg-variant"
    };

    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        {label && (
          <label
            className={cn(
              "text-label font-label text-surface-on-surface",
              size === "sm" && "text-sm",
              size === "lg" && "text-base",
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-brand-error ml-1">*</span>}
          </label>
        )}

        <div
          className={cn(
            "relative rounded-md border transition-all",
            "min-touch-target",
            sizeClasses[size],
            variantClasses[variant],
            hasError && "border-brand-error",
            hasSuccess && "border-state-success",
            disabled && "opacity-50 cursor-not-allowed",
            inputClassName
          )}
        >
          {!manualEntry && !value && (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-3">
                <MapPin className="h-8 w-8 text-surface-on-variant mx-auto" />
                <p className="text-surface-on-variant text-body-small">
                  {placeholder}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    type="button"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={disabled || isGettingLocation}
                    className="gap-2"
                  >
                    <Navigation className="h-4 w-4" />
                    {isGettingLocation ? "Getting Location..." : "Get Current Location"}
                  </Button>
                  {allowManualEntry && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setManualEntry(true)}
                      disabled={disabled}
                    >
                      Enter Manually
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!manualEntry && value && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-brand-primary" />
                <div className="flex-1">
                  <div className="text-surface-on-surface font-medium">
                    {formatCoordinate(value.lat, "lat")}, {formatCoordinate(value.lng, "lng")}
                  </div>
                  <div className="text-surface-on-variant text-caption">
                    Lat: {value.lat.toFixed(precision)}, Lng: {value.lng.toFixed(precision)}
                  </div>
                </div>
              </div>

              {showAccuracy && value.accuracy && (
                <div className="text-surface-on-variant text-caption">
                  Accuracy: ±{Math.round(value.accuracy)}m
                </div>
              )}

              {showTimestamp && value.timestamp && (
                <div className="text-surface-on-variant text-caption">
                  Captured: {new Date(value.timestamp).toLocaleString()}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={disabled || isGettingLocation}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  {isGettingLocation ? "Updating..." : "Update"}
                </Button>
                {allowManualEntry && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setManualEntry(true)}
                    disabled={disabled}
                  >
                    Edit Manually
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearLocation}
                  disabled={disabled}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {manualEntry && (
            <div className="space-y-3">
              <div className="text-surface-on-surface font-medium text-body-small">
                Enter GPS Coordinates
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-label-small font-label-small text-surface-on-variant">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 40.7128"
                    value={latInput}
                    onChange={(e) => setLatInput(e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-sm border border-surface-border rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                    disabled={disabled}
                  />
                </div>
                <div>
                  <label className="text-label-small font-label-small text-surface-on-variant">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. -74.0060"
                    value={lngInput}
                    onChange={(e) => setLngInput(e.target.value)}
                    className="w-full mt-1 px-2 py-1 text-sm border border-surface-border rounded focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleManualUpdate}
                  disabled={disabled || !validation.isValid}
                >
                  Save Coordinates
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setManualEntry(false)}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {hasError && (
            <div className="absolute -right-1 -top-1">
              <AlertCircle className="h-4 w-4 text-brand-error" />
            </div>
          )}

          {hasSuccess && (
            <div className="absolute -right-1 -top-1">
              <CheckCircle className="h-4 w-4 text-state-success" />
            </div>
          )}
        </div>

        {hasError && (
          <p
            className={cn(
              "text-brand-error text-caption flex items-center gap-1",
              errorClassName
            )}
          >
            <AlertCircle className="h-3 w-3" />
            {error || validation.error}
          </p>
        )}

        {hasSuccess && (
          <p
            className={cn(
              "text-state-success text-caption flex items-center gap-1",
              successClassName
            )}
          >
            <CheckCircle className="h-3 w-3" />
            {success}
          </p>
        )}
      </div>
    );
  }
);

GPSInput.displayName = "GPSInput";

export { GPSInput };
export type { GPSInputProps, GPSCoordinates };