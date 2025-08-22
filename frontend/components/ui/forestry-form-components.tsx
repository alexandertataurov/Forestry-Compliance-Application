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

// GPS Input Component
export const GPSInput: React.FC<{
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

// Species Selector Component
export const SpeciesSelector: React.FC<{
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

// Measurement Input Component
export const MeasurementInput: React.FC<{
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
