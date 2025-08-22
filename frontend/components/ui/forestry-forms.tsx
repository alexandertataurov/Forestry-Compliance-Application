import * as React from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Checkbox } from './checkbox';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Switch } from './switch';
import { Slider } from './slider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card';
import { Badge } from './badge';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { FormValidation, forestryValidationRules } from './form-validation';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from './form';
import { 
  MapPin, 
  Tree, 
  Ruler, 
  Scale, 
  Calendar, 
  FileText, 
  Camera,
  Gps,
  Save,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

// Forestry form schemas using Zod
export const forestrySchemas = {
  // Basic tree measurement schema
  treeMeasurement: z.object({
    species: z.string().min(1, "Species is required"),
    diameter: z.number().min(0.1, "Diameter must be greater than 0.1 cm").max(500, "Diameter must be less than 500 cm"),
    height: z.number().min(0.1, "Height must be greater than 0.1 m").max(150, "Height must be less than 150 m"),
    age: z.number().optional(),
    health: z.enum(["excellent", "good", "fair", "poor"]),
    notes: z.string().optional(),
  }),

  // GPS coordinates schema
  gpsCoordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().min(0).max(100),
    timestamp: z.date(),
  }),

  // Batch processing schema
  batchProcessing: z.object({
    batchNumber: z.string().regex(/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])-[A-Z0-9]{6}$/, "Invalid batch number format"),
    date: z.date(),
    location: z.string().min(1, "Location is required"),
    operator: z.string().min(1, "Operator is required"),
    equipment: z.string().optional(),
    weather: z.enum(["sunny", "cloudy", "rainy", "snowy"]),
    temperature: z.number().min(-50).max(60),
    humidity: z.number().min(0).max(100),
  }),

  // Compliance documentation schema
  complianceDocument: z.object({
    documentType: z.enum(["permit", "license", "certificate", "report", "inspection"]),
    documentNumber: z.string().min(1, "Document number is required"),
    issueDate: z.date(),
    expiryDate: z.date().optional(),
    issuingAuthority: z.string().min(1, "Issuing authority is required"),
    status: z.enum(["active", "expired", "pending", "suspended"]),
    attachments: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),

  // Volume calculation schema
  volumeCalculation: z.object({
    species: z.string().min(1, "Species is required"),
    diameter: z.number().min(0.1),
    height: z.number().min(0.1),
    formFactor: z.number().min(0.1).max(1.0),
    volume: z.number().min(0),
    unit: z.enum(["m³", "ft³", "cm³"]),
    method: z.enum(["gost", "hsm", "custom"]),
    confidence: z.number().min(0).max(100),
  }),
};

// Forestry form variants
const forestryFormVariants = cva(
  "space-y-6",
  {
    variants: {
      variant: {
        default: "bg-background",
        card: "bg-card border rounded-lg p-6",
        compact: "space-y-4",
        expanded: "space-y-8",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Forestry form field types
export interface ForestryFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'switch' | 'slider' | 'gps' | 'file' | 'date' | 'time' | 'datetime-local';
  required?: boolean;
  placeholder?: string;
  description?: string;
  validation?: any[];
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  pattern?: string;
  multiple?: boolean;
  accept?: string;
  rows?: number;
  cols?: number;
}

// Forestry form props
export interface ForestryFormProps extends VariantProps<typeof forestryFormVariants> {
  fields: ForestryFormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  onSave?: (data: any) => void;
  defaultValues?: any;
  schema?: any;
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
  disabled?: boolean;
  showValidation?: boolean;
  className?: string;
}

// GPS Input Component
const GPSInput: React.FC<{
  value?: { lat: number; lng: number };
  onChange?: (value: { lat: number; lng: number }) => void;
  onCapture?: () => void;
  accuracy?: number;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}> = ({ value, onChange, onCapture, accuracy, disabled, required, label, description }) => {
  const [lat, setLat] = React.useState(value?.lat?.toString() || '');
  const [lng, setLng] = React.useState(value?.lng?.toString() || '');

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLat = e.target.value;
    setLat(newLat);
    if (onChange && newLat && lng) {
      onChange({ lat: parseFloat(newLat), lng: parseFloat(lng) });
    }
  };

  const handleLngChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLng = e.target.value;
    setLng(newLng);
    if (onChange && lat && newLng) {
      onChange({ lat: parseFloat(lat), lng: parseFloat(newLng) });
    }
  };

  const handleCapture = () => {
    if (navigator.geolocation && onCapture) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLat(latitude.toString());
          setLng(longitude.toString());
          if (onChange) {
            onChange({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error('GPS capture failed:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label className="flex items-center gap-2">
          <Gps className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="latitude" className="text-sm">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="41.7151"
            value={lat}
            onChange={handleLatChange}
            disabled={disabled}
            className="touch-target"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="longitude" className="text-sm">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="44.8271"
            value={lng}
            onChange={handleLngChange}
            disabled={disabled}
            className="touch-target"
          />
        </div>
      </div>
      
      {onCapture && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCapture}
          disabled={disabled}
          className="w-full touch-target"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Capture Current Location
        </Button>
      )}
      
      {accuracy && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          Accuracy: {accuracy}m
        </div>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// Measurement Input Component
const MeasurementInput: React.FC<{
  value?: number;
  onChange?: (value: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}> = ({ value, onChange, unit, min, max, step, precision, disabled, required, label, description }) => {
  const [inputValue, setInputValue] = React.useState(value?.toString() || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange && newValue) {
      const numValue = parseFloat(newValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label className="flex items-center gap-2">
          <Ruler className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          type="number"
          placeholder={`Enter ${label?.toLowerCase() || 'value'}`}
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step || 0.01}
          disabled={disabled}
          className="pr-12 touch-target"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
          {unit}
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// Species Selector Component
const SpeciesSelector: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}> = ({ value, onChange, disabled, required, label, description }) => {
  const speciesOptions = [
    { value: 'pine', label: 'Pine (Pinus)' },
    { value: 'oak', label: 'Oak (Quercus)' },
    { value: 'maple', label: 'Maple (Acer)' },
    { value: 'birch', label: 'Birch (Betula)' },
    { value: 'spruce', label: 'Spruce (Picea)' },
    { value: 'fir', label: 'Fir (Abies)' },
    { value: 'cedar', label: 'Cedar (Cedrus)' },
    { value: 'ash', label: 'Ash (Fraxinus)' },
    { value: 'elm', label: 'Elm (Ulmus)' },
    { value: 'beech', label: 'Beech (Fagus)' },
  ];

  return (
    <div className="space-y-3">
      {label && (
        <Label className="flex items-center gap-2">
          <Tree className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="touch-target">
          <SelectValue placeholder="Select species" />
        </SelectTrigger>
        <SelectContent>
          {speciesOptions.map((species) => (
            <SelectItem key={species.value} value={species.value}>
              {species.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// File Upload Component
const FileUpload: React.FC<{
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
}> = ({ value, onChange, accept, multiple, maxSize, disabled, required, label, description }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (onChange) {
      onChange(multiple ? files : files.slice(0, 1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (onChange) {
      onChange(multiple ? files : files.slice(0, 1));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      {label && (
        <Label className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-2">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to select
          </p>
          {accept && (
            <p className="text-xs text-muted-foreground">
              Accepted formats: {accept}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          )}
        </div>
      </div>
      
      {value && value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm truncate">{file.name}</span>
              <Badge variant="secondary">
                {(file.size / 1024).toFixed(1)}KB
              </Badge>
            </div>
          ))}
        </div>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

// Main Forestry Form Component
const ForestryForm = React.forwardRef<HTMLFormElement, ForestryFormProps>(
  ({ 
    fields,
    onSubmit,
    onCancel,
    onSave,
    defaultValues,
    schema,
    title,
    description,
    submitText = "Submit",
    cancelText = "Cancel",
    saveText = "Save Draft",
    loading = false,
    disabled = false,
    showValidation = true,
    variant,
    size,
    className,
    ...props 
  }, ref) => {
    const form = useForm({
      resolver: schema ? zodResolver(schema) : undefined,
      defaultValues,
    });

    const handleSubmit = form.handleSubmit((data) => {
      onSubmit(data);
    });

    const handleSave = () => {
      const data = form.getValues();
      onSave?.(data);
    };

    const renderField = (field: ForestryFormField) => {
      const { name, type, label, required, placeholder, description, validation, options, min, max, step, unit, disabled: fieldDisabled, ...fieldProps } = field;

      switch (type) {
        case 'gps':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <GPSInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={fieldDisabled || disabled}
                      required={required}
                      description={description}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        case 'select':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={placeholder} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options?.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        case 'textarea':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      className="touch-target"
                      {...field}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        case 'checkbox':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={fieldDisabled || disabled}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{label}</FormLabel>
                    <FormDescription>{description}</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          );

        case 'radio':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {options?.map((option) => (
                        <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">{option.label}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        case 'switch':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{label}</FormLabel>
                    <FormDescription>{description}</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={fieldDisabled || disabled}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          );

        case 'slider':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Slider
                      min={min}
                      max={max}
                      step={step}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                      disabled={fieldDisabled || disabled}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        case 'file':
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={field.onChange}
                      accept={fieldProps.accept}
                      multiple={fieldProps.multiple}
                      maxSize={fieldProps.maxSize}
                      disabled={fieldDisabled || disabled}
                      description={description}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );

        default:
          return (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input
                      type={type}
                      placeholder={placeholder}
                      className="touch-target"
                      {...field}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>{description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
      }
    };

    return (
      <Form {...form}>
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(forestryFormVariants({ variant, size, className }))}
          {...props}
        >
          {(title || description) && (
            <div className="space-y-2">
              {title && <h2 className="text-2xl font-semibold">{title}</h2>}
              {description && <p className="text-muted-foreground">{description}</p>}
            </div>
          )}

          <div className="space-y-6">
            {fields.map(renderField)}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            {onSave && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                disabled={loading || disabled}
                className="touch-target"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveText}
              </Button>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 ml-auto">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading || disabled}
                  className="touch-target"
                >
                  {cancelText}
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={loading || disabled}
                className="touch-target"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {submitText}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    );
  }
);

ForestryForm.displayName = 'ForestryForm';

export {
  ForestryForm,
  GPSInput,
  MeasurementInput,
  SpeciesSelector,
  FileUpload,
  forestryFormVariants,
};
export type { ForestryFormProps, ForestryFormField };
