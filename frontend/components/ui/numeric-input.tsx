import * as React from "react";
import { cn } from "./utils";
import { AlertCircle, CheckCircle } from "lucide-react";

interface NumericInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  unit?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
  showValidation?: boolean;
  formatOnBlur?: boolean;
  allowNegative?: boolean;
  allowDecimal?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  successClassName?: string;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      label,
      placeholder,
      value,
      onChange,
      onBlur,
      min,
      max,
      step = 1,
      precision = 2,
      unit,
      error,
      success,
      required = false,
      disabled = false,
      readOnly = false,
      size = "default",
      variant = "default",
      showValidation = true,
      formatOnBlur = true,
      allowNegative = false,
      allowDecimal = true,
      autoFocus = false,
      className,
      inputClassName,
      labelClassName,
      errorClassName,
      successClassName,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState(value.toString());

    // Update internal value when external value changes
    React.useEffect(() => {
      setInternalValue(value.toString());
    }, [value]);

    const formatNumber = (val: string): string => {
      if (!val) return "";
      
      // Remove all non-numeric characters except decimal point and minus
      let cleaned = val.replace(/[^\d.-]/g, "");
      
      // Handle negative numbers
      if (!allowNegative) {
        cleaned = cleaned.replace(/-/g, "");
      } else {
        // Ensure only one minus sign at the beginning
        const minusCount = (cleaned.match(/-/g) || []).length;
        if (minusCount > 1) {
          cleaned = cleaned.replace(/-/g, "");
          cleaned = "-" + cleaned;
        }
      }
      
      // Handle decimal numbers
      if (!allowDecimal) {
        cleaned = cleaned.replace(/\./g, "");
      } else {
        // Ensure only one decimal point
        const parts = cleaned.split(".");
        if (parts.length > 2) {
          cleaned = parts[0] + "." + parts.slice(1).join("");
        }
        // Limit decimal places
        if (parts.length === 2 && parts[1].length > precision) {
          cleaned = parts[0] + "." + parts[1].slice(0, precision);
        }
      }
      
      return cleaned;
    };

    const validateNumber = (val: string): { isValid: boolean; error?: string } => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatNumber(e.target.value);
      setInternalValue(formatted);
      onChange(formatted);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      
      if (formatOnBlur && internalValue) {
        const num = parseFloat(internalValue);
        if (!isNaN(num)) {
          const formatted = num.toFixed(precision);
          setInternalValue(formatted);
          onChange(formatted);
        }
      }
      
      onBlur?.(internalValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, arrow keys
      if ([8, 9, 27, 13, 37, 38, 39, 40].includes(e.keyCode)) {
        return;
      }
      
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) {
        return;
      }
      
      // Allow: numbers, decimal point, minus sign
      const allowedChars = /[\d.-]/;
      if (!allowedChars.test(e.key)) {
        e.preventDefault();
      }
      
      // Prevent multiple decimal points
      if (e.key === "." && internalValue.includes(".")) {
        e.preventDefault();
      }
      
      // Prevent multiple minus signs
      if (e.key === "-" && internalValue.includes("-")) {
        e.preventDefault();
      }
    };

    const validation = validateNumber(internalValue);
    const hasError = showValidation && validation.error;
    const hasSuccess = showValidation && success && !hasError;

    const sizeClasses = {
      sm: "h-8 text-sm px-2",
      default: "h-10 text-base px-3",
      lg: "h-12 text-lg px-4"
    };

    const variantClasses = {
      default: "border-surface-border bg-surface-bg",
      outline: "border-2 border-surface-border bg-transparent",
      filled: "border-transparent bg-surface-bg-variant"
    };

    return (
      <div className={cn("space-y-1", className)}>
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
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoFocus={autoFocus}
            min={min}
            max={max}
            step={step}
            required={required}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={
              hasError ? "error-message" : hasSuccess ? "success-message" : undefined
            }
            className={cn(
              "w-full rounded-md border transition-all outline-none",
              "focus-visible:border-brand-primary focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
              "min-touch-target",
              sizeClasses[size],
              variantClasses[variant],
              hasError && "border-brand-error focus-visible:border-brand-error focus-visible:ring-brand-error/20",
              hasSuccess && "border-state-success focus-visible:border-state-success focus-visible:ring-state-success/20",
              inputClassName
            )}
            {...props}
          />
          
          {unit && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-surface-on-variant text-sm font-medium">
                {unit}
              </span>
            </div>
          )}
          
          {hasError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <AlertCircle className="h-4 w-4 text-brand-error" />
            </div>
          )}
          
          {hasSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle className="h-4 w-4 text-state-success" />
            </div>
          )}
        </div>
        
        {hasError && (
          <p
            id="error-message"
            className={cn(
              "text-brand-error text-caption flex items-center gap-1",
              errorClassName
            )}
          >
            <AlertCircle className="h-3 w-3" />
            {validation.error}
          </p>
        )}
        
        {hasSuccess && (
          <p
            id="success-message"
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

NumericInput.displayName = "NumericInput";

export { NumericInput };
export type { NumericInputProps };
