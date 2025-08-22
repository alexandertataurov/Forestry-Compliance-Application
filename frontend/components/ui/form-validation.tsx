import * as React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "./utils";

// Validation rule types
type ValidationRule = 
  | { type: "required"; message?: string }
  | { type: "min"; value: number; message?: string }
  | { type: "max"; value: number; message?: string }
  | { type: "minLength"; value: number; message?: string }
  | { type: "maxLength"; value: number; message?: string }
  | { type: "pattern"; value: RegExp; message?: string }
  | { type: "email"; message?: string }
  | { type: "url"; message?: string }
  | { type: "custom"; validator: (value: any) => boolean | string; message?: string }
  | { type: "forestry_coordinates"; message?: string }
  | { type: "forestry_species"; message?: string }
  | { type: "forestry_measurement"; min?: number; max?: number; unit?: string; message?: string }
  | { type: "forestry_batch_number"; message?: string }
  | { type: "forestry_plate_number"; message?: string };

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  info: string[];
}

interface FormValidationProps {
  value: any;
  rules: ValidationRule[];
  label?: string;
  showValidation?: boolean;
  showWarnings?: boolean;
  showInfo?: boolean;
  className?: string;
  labelClassName?: string;
  errorClassName?: string;
  warningClassName?: string;
  infoClassName?: string;
  successClassName?: string;
}

// Forestry-specific validation patterns
const FORESTRY_PATTERNS = {
  coordinates: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?),\s*-?((1[0-7][0-9]|[1-9]?[0-9])(\.[0-9]+)?|180(\.0+)?)$/,
  batchNumber: /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-[A-Z0-9]{6}$/,
  plateNumber: /^[A-Z]{2}\d{3}[A-Z]{2}$|^[A-Z]{1,2}\d{2,3}[A-Z]{1,2}$/,
  speciesCode: /^[A-Z]{2,3}-\w+$/,
  measurement: /^\d+(\.\d+)?\s*(m|cm|mm|ft|in|m²|ha|km²|ft²|ac|m³|cm³|ft³|yd³|L|kg|g|t|lb|oz|kg\/m³|g\/cm³|lb\/ft³)$/i
};

const FormValidation = React.forwardRef<HTMLDivElement, FormValidationProps>(
  (
    {
      value,
      rules,
      label,
      showValidation = true,
      showWarnings = true,
      showInfo = true,
      className,
      labelClassName,
      errorClassName,
      warningClassName,
      infoClassName,
      successClassName,
    },
    ref
  ) => {
    const validateField = (value: any, rules: ValidationRule[]): ValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const info: string[] = [];

      for (const rule of rules) {
        switch (rule.type) {
          case "required":
            if (value === null || value === undefined || value === "") {
              errors.push(rule.message || "This field is required");
            }
            break;

          case "min":
            if (typeof value === "number" && value < rule.value) {
              errors.push(rule.message || `Value must be at least ${rule.value}`);
            }
            break;

          case "max":
            if (typeof value === "number" && value > rule.value) {
              errors.push(rule.message || `Value must be no more than ${rule.value}`);
            }
            break;

          case "minLength":
            if (typeof value === "string" && value.length < rule.value) {
              errors.push(rule.message || `Must be at least ${rule.value} characters`);
            }
            break;

          case "maxLength":
            if (typeof value === "string" && value.length > rule.value) {
              errors.push(rule.message || `Must be no more than ${rule.value} characters`);
            }
            break;

          case "pattern":
            if (typeof value === "string" && !rule.value.test(value)) {
              errors.push(rule.message || "Invalid format");
            }
            break;

          case "email":
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (typeof value === "string" && value && !emailPattern.test(value)) {
              errors.push(rule.message || "Please enter a valid email address");
            }
            break;

          case "url":
            try {
              new URL(value);
            } catch {
              if (value) {
                errors.push(rule.message || "Please enter a valid URL");
              }
            }
            break;

          case "custom":
            const result = rule.validator(value);
            if (result === false) {
              errors.push(rule.message || "Invalid value");
            } else if (typeof result === "string") {
              errors.push(result);
            }
            break;

          case "forestry_coordinates":
            if (typeof value === "string" && value && !FORESTRY_PATTERNS.coordinates.test(value)) {
              errors.push(rule.message || "Please enter valid coordinates (e.g., 41.7151, 44.8271)");
            } else if (typeof value === "object" && value) {
              const { lat, lng } = value;
              if (typeof lat !== "number" || typeof lng !== "number" ||
                  lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                errors.push(rule.message || "Invalid GPS coordinates");
              }
            }
            break;

          case "forestry_species":
            if (typeof value === "string" && value && !FORESTRY_PATTERNS.speciesCode.test(value)) {
              warnings.push(rule.message || "Species code should follow format: XX-commonname");
            }
            break;

          case "forestry_measurement":
            if (typeof value === "string" && value && !FORESTRY_PATTERNS.measurement.test(value)) {
              errors.push(rule.message || "Invalid measurement format");
            } else if (typeof value === "number") {
              if (rule.min !== undefined && value < rule.min) {
                errors.push(rule.message || `Value must be at least ${rule.min}${rule.unit || ""}`);
              }
              if (rule.max !== undefined && value > rule.max) {
                errors.push(rule.message || `Value must be no more than ${rule.max}${rule.unit || ""}`);
              }
            }
            break;

          case "forestry_batch_number":
            if (typeof value === "string" && value && !FORESTRY_PATTERNS.batchNumber.test(value)) {
              errors.push(rule.message || "Batch number should follow format: YYYYMMDD-XXXXXX");
            }
            break;

          case "forestry_plate_number":
            if (typeof value === "string" && value && !FORESTRY_PATTERNS.plateNumber.test(value)) {
              warnings.push(rule.message || "Plate number format may be invalid");
            }
            break;
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        info
      };
    };

    const validation = validateField(value, rules);
    const hasErrors = validation.errors.length > 0;
    const hasWarnings = validation.warnings.length > 0;
    const hasInfo = validation.info.length > 0;
    const isValid = validation.isValid && !hasErrors;

    if (!showValidation) {
      return null;
    }

    return (
      <div ref={ref} className={cn("space-y-1", className)}>
        {/* Error Messages */}
        {hasErrors && (
          <div className="space-y-1">
            {validation.errors.map((error, index) => (
              <p
                key={index}
                className={cn(
                  "text-brand-error text-caption flex items-center gap-1",
                  errorClassName
                )}
              >
                <AlertCircle className="h-3 w-3 flex-shrink-0" />
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Warning Messages */}
        {hasWarnings && showWarnings && (
          <div className="space-y-1">
            {validation.warnings.map((warning, index) => (
              <p
                key={index}
                className={cn(
                  "text-state-warning text-caption flex items-center gap-1",
                  warningClassName
                )}
              >
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* Info Messages */}
        {hasInfo && showInfo && (
          <div className="space-y-1">
            {validation.info.map((info, index) => (
              <p
                key={index}
                className={cn(
                  "text-state-info text-caption flex items-center gap-1",
                  infoClassName
                )}
              >
                <Info className="h-3 w-3 flex-shrink-0" />
                {info}
              </p>
            ))}
          </div>
        )}

        {/* Success Message */}
        {isValid && value !== null && value !== undefined && value !== "" && (
          <p
            className={cn(
              "text-state-success text-caption flex items-center gap-1",
              successClassName
            )}
          >
            <CheckCircle className="h-3 w-3 flex-shrink-0" />
            Valid
          </p>
        )}
      </div>
    );
  }
);

FormValidation.displayName = "FormValidation";

// Forestry-specific validation helpers
export const forestryValidationRules = {
  coordinates: (message?: string): ValidationRule => ({
    type: "forestry_coordinates",
    message: message || "Please enter valid GPS coordinates"
  }),
  
  species: (message?: string): ValidationRule => ({
    type: "forestry_species",
    message: message || "Please select a valid species"
  }),
  
  measurement: (min?: number, max?: number, unit?: string, message?: string): ValidationRule => ({
    type: "forestry_measurement",
    min,
    max,
    unit,
    message: message || `Please enter a valid measurement${unit ? ` in ${unit}` : ""}`
  }),
  
  batchNumber: (message?: string): ValidationRule => ({
    type: "forestry_batch_number",
    message: message || "Please enter a valid batch number"
  }),
  
  plateNumber: (message?: string): ValidationRule => ({
    type: "forestry_plate_number",
    message: message || "Please enter a valid plate number"
  }),
  
  required: (message?: string): ValidationRule => ({
    type: "required",
    message: message || "This field is required"
  }),
  
  min: (value: number, message?: string): ValidationRule => ({
    type: "min",
    value,
    message: message || `Value must be at least ${value}`
  }),
  
  max: (value: number, message?: string): ValidationRule => ({
    type: "max",
    value,
    message: message || `Value must be no more than ${value}`
  }),
  
  email: (message?: string): ValidationRule => ({
    type: "email",
    message: message || "Please enter a valid email address"
  }),
  
  custom: (validator: (value: any) => boolean | string, message?: string): ValidationRule => ({
    type: "custom",
    validator,
    message: message || "Invalid value"
  })
};

export { FormValidation };
export type { FormValidationProps, ValidationRule, ValidationResult };
export { FORESTRY_PATTERNS };
