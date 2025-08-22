import * as React from "react";
import { cn } from "./utils";
import { AlertCircle, CheckCircle, ArrowRightLeft } from "lucide-react";
import { Button } from "./button";

// Common measurement units for forestry
interface MeasurementUnit {
  id: string;
  name: string;
  symbol: string;
  category: "length" | "area" | "volume" | "weight" | "temperature";
  baseMultiplier: number; // Multiplier to convert to base unit
  precision: number;
}

interface MeasurementValue {
  value: number;
  unit: string;
}

interface MeasurementInputProps {
  value?: MeasurementValue | null;
  onChange: (measurement: MeasurementValue | null) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
  category: "length" | "area" | "volume" | "weight" | "temperature";
  defaultUnit?: string;
  availableUnits?: string[];
  showValidation?: boolean;
  showConversion?: boolean;
  allowUnitChange?: boolean;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

// Forestry measurement units
const MEASUREMENT_UNITS: MeasurementUnit[] = [
  // Length units
  { id: "mm", name: "Millimeter", symbol: "mm", category: "length", baseMultiplier: 0.001, precision: 1 },
  { id: "cm", name: "Centimeter", symbol: "cm", category: "length", baseMultiplier: 0.01, precision: 1 },
  { id: "m", name: "Meter", symbol: "m", category: "length", baseMultiplier: 1, precision: 2 },
  { id: "km", name: "Kilometer", symbol: "km", category: "length", baseMultiplier: 1000, precision: 3 },
  { id: "in", name: "Inch", symbol: "in", category: "length", baseMultiplier: 0.0254, precision: 2 },
  { id: "ft", name: "Foot", symbol: "ft", category: "length", baseMultiplier: 0.3048, precision: 2 },
  
  // Area units
  { id: "sqm", name: "Square Meter", symbol: "m²", category: "area", baseMultiplier: 1, precision: 2 },
  { id: "sqkm", name: "Square Kilometer", symbol: "km²", category: "area", baseMultiplier: 1000000, precision: 4 },
  { id: "ha", name: "Hectare", symbol: "ha", category: "area", baseMultiplier: 10000, precision: 2 },
  { id: "acre", name: "Acre", symbol: "ac", category: "area", baseMultiplier: 4046.86, precision: 2 },
  
  // Volume units
  { id: "cubic_m", name: "Cubic Meter", symbol: "m³", category: "volume", baseMultiplier: 1, precision: 3 },
  { id: "cubic_cm", name: "Cubic Centimeter", symbol: "cm³", category: "volume", baseMultiplier: 0.000001, precision: 1 },
  { id: "liter", name: "Liter", symbol: "L", category: "volume", baseMultiplier: 0.001, precision: 2 },
  { id: "cubic_ft", name: "Cubic Foot", symbol: "ft³", category: "volume", baseMultiplier: 0.0283168, precision: 3 },
  
  // Weight units
  { id: "g", name: "Gram", symbol: "g", category: "weight", baseMultiplier: 0.001, precision: 1 },
  { id: "kg", name: "Kilogram", symbol: "kg", category: "weight", baseMultiplier: 1, precision: 2 },
  { id: "t", name: "Metric Ton", symbol: "t", category: "weight", baseMultiplier: 1000, precision: 3 },
  { id: "lb", name: "Pound", symbol: "lb", category: "weight", baseMultiplier: 0.453592, precision: 2 },
  
  // Temperature units
  { id: "celsius", name: "Celsius", symbol: "°C", category: "temperature", baseMultiplier: 1, precision: 1 },
  { id: "fahrenheit", name: "Fahrenheit", symbol: "°F", category: "temperature", baseMultiplier: 1, precision: 1 },
  { id: "kelvin", name: "Kelvin", symbol: "K", category: "temperature", baseMultiplier: 1, precision: 1 },
];

const MeasurementInput = React.forwardRef<HTMLDivElement, MeasurementInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder,
      error,
      success,
      required = false,
      disabled = false,
      readOnly = false,
      size = "default",
      variant = "default",
      category,
      defaultUnit,
      availableUnits,
      showValidation = true,
      showConversion = true,
      allowUnitChange = true,
      min,
      max,
      step = 0.01,
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      successClassName,
    },
    ref
  ) => {
    const categoryUnits = MEASUREMENT_UNITS.filter(unit => unit.category === category);
    const units = availableUnits 
      ? categoryUnits.filter(unit => availableUnits.includes(unit.id))
      : categoryUnits;
    
    const currentUnit = value?.unit || defaultUnit || units[0]?.id || "";
    const currentUnitData = units.find(unit => unit.id === currentUnit);
    
    const [inputValue, setInputValue] = React.useState(value?.value?.toString() || "");
    const [showUnitPicker, setShowUnitPicker] = React.useState(false);

    // Update input value when external value changes
    React.useEffect(() => {
      if (value) {
        setInputValue(value.value.toString());
      } else {
        setInputValue("");
      }
    }, [value]);

    const formatNumber = (val: string): string => {
      if (!val) return "";
      
      // Remove all non-numeric characters except decimal point and minus
      let cleaned = val.replace(/[^\d.-]/g, "");
      
      // Ensure only one decimal point
      const parts = cleaned.split(".");
      if (parts.length > 2) {
        cleaned = parts[0] + "." + parts.slice(1).join("");
      }
      
      // Limit decimal places based on unit precision
      if (parts.length === 2 && currentUnitData && parts[1].length > currentUnitData.precision) {
        cleaned = parts[0] + "." + parts[1].slice(0, currentUnitData.precision);
      }
      
      return cleaned;
    };

    const validateValue = (val: string): { isValid: boolean; error?: string } => {
      if (!val) {
        if (required) {
          return { isValid: false, error: "This field is required" };
        }
        return { isValid: true };
      }

      const num = parseFloat(val);
      if (isNaN(num)) {
        return { isValid: false, error: "Please enter a valid number" };
      }

      if (min !== undefined && num < min) {
        return { isValid: false, error: `Value must be at least ${min}` };
      }

      if (max !== undefined && num > max) {
        return { isValid: false, error: `Value must be no more than ${max}` };
      }

      return { isValid: true };
    };

    const convertToUnit = (fromValue: number, fromUnit: string, toUnit: string): number => {
      if (fromUnit === toUnit) return fromValue;
      
      const fromUnitData = units.find(unit => unit.id === fromUnit);
      const toUnitData = units.find(unit => unit.id === toUnit);
      
      if (!fromUnitData || !toUnitData) return fromValue;
      
      // Special handling for temperature conversions
      if (category === "temperature") {
        if (fromUnit === "celsius" && toUnit === "fahrenheit") {
          return (fromValue * 9/5) + 32;
        }
        if (fromUnit === "fahrenheit" && toUnit === "celsius") {
          return (fromValue - 32) * 5/9;
        }
        if (fromUnit === "celsius" && toUnit === "kelvin") {
          return fromValue + 273.15;
        }
        if (fromUnit === "kelvin" && toUnit === "celsius") {
          return fromValue - 273.15;
        }
        if (fromUnit === "fahrenheit" && toUnit === "kelvin") {
          return ((fromValue - 32) * 5/9) + 273.15;
        }
        if (fromUnit === "kelvin" && toUnit === "fahrenheit") {
          return ((fromValue - 273.15) * 9/5) + 32;
        }
      }
      
      // Standard unit conversion through base unit
      const baseValue = fromValue * fromUnitData.baseMultiplier;
      return baseValue / toUnitData.baseMultiplier;
    };

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatNumber(e.target.value);
      setInputValue(formatted);
      
      if (formatted && !isNaN(parseFloat(formatted))) {
        onChange({
          value: parseFloat(formatted),
          unit: currentUnit
        });
      } else if (!formatted) {
        onChange(null);
      }
    };

    const handleUnitChange = (newUnit: string) => {
      if (value && currentUnit !== newUnit) {
        const convertedValue = convertToUnit(value.value, currentUnit, newUnit);
        onChange({
          value: convertedValue,
          unit: newUnit
        });
      } else if (!value) {
        onChange({
          value: 0,
          unit: newUnit
        });
      }
      setShowUnitPicker(false);
    };

    const getConversions = (): { unit: MeasurementUnit; convertedValue: number }[] => {
      if (!value || !showConversion) return [];
      
      return units
        .filter(unit => unit.id !== currentUnit)
        .slice(0, 3) // Show max 3 conversions
        .map(unit => ({
          unit,
          convertedValue: convertToUnit(value.value, currentUnit, unit.id)
        }));
    };

    const validation = validateValue(inputValue);
    const hasError = showValidation && (error || validation.error);
    const hasSuccess = showValidation && success && !hasError;

    const sizeClasses = {
      sm: "h-8 text-sm",
      default: "h-10 text-base",
      lg: "h-12 text-lg"
    };

    const variantClasses = {
      default: "border-surface-border bg-surface-bg",
      outline: "border-2 border-surface-border bg-transparent",
      filled: "border-transparent bg-surface-bg-variant"
    };

    const conversions = getConversions();

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

        <div className="relative">
          <div className="flex">
            <input
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleValueChange}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              min={min}
              max={max}
              step={step}
              required={required}
              aria-invalid={hasError ? "true" : "false"}
              className={cn(
                "flex-1 rounded-l-md border border-r-0 px-3 transition-all outline-none",
                "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "min-touch-target",
                sizeClasses[size],
                variantClasses[variant],
                hasError && "border-brand-error focus-visible:border-brand-error focus-visible:ring-brand-error/20",
                hasSuccess && "border-state-success focus-visible:border-state-success focus-visible:ring-state-success/20",
                inputClassName
              )}
            />
            
            {allowUnitChange ? (
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size={size}
                  onClick={() => setShowUnitPicker(!showUnitPicker)}
                  disabled={disabled}
                  className="rounded-l-none border-l-0 min-w-[60px] justify-center"
                >
                  {currentUnitData?.symbol || currentUnit}
                </Button>
                
                {showUnitPicker && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-bg border border-surface-border rounded-md shadow-2 z-10 max-h-48 overflow-y-auto">
                    {units.map((unit) => (
                      <button
                        key={unit.id}
                        type="button"
                        onClick={() => handleUnitChange(unit.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 text-sm hover:bg-surface-bg-variant transition-colors",
                          unit.id === currentUnit && "bg-brand-primary/10 text-brand-primary"
                        )}
                      >
                        <div className="font-medium">{unit.symbol}</div>
                        <div className="text-surface-on-variant text-xs">{unit.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={cn(
                "flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-surface-bg-variant text-surface-on-variant min-w-[60px]",
                sizeClasses[size],
                variantClasses[variant]
              )}>
                {currentUnitData?.symbol || currentUnit}
              </div>
            )}
          </div>

          {hasError && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-brand-error" />
            </div>
          )}

          {hasSuccess && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-state-success" />
            </div>
          )}
        </div>

        {conversions.length > 0 && (
          <div className="flex items-center gap-2 text-surface-on-variant text-caption">
            <ArrowRightLeft className="h-3 w-3" />
            <div className="flex gap-4">
              {conversions.map(({ unit, convertedValue }) => (
                <span key={unit.id}>
                  {convertedValue.toFixed(unit.precision)} {unit.symbol}
                </span>
              ))}
            </div>
          </div>
        )}

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

MeasurementInput.displayName = "MeasurementInput";

export { MeasurementInput, MEASUREMENT_UNITS };
export type { MeasurementInputProps, MeasurementValue, MeasurementUnit };