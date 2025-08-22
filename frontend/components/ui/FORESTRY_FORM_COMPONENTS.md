# Forestry Form Components

A comprehensive set of specialized form components designed for forestry compliance data entry, featuring validation, unit conversion, GPS integration, and species selection.

## Components Overview

### 1. NumericInput
Specialized numeric input with validation, formatting, and unit display.

### 2. SpeciesSelector
Advanced species selection with search, categorization, and forestry-specific data.

### 3. GPSInput
GPS coordinate input with automatic detection, manual entry, and map integration.

### 4. MeasurementInput
Measurement input with unit conversion, validation, and multiple measurement types.

### 5. FormValidation
Comprehensive validation system with forestry-specific validation rules.

## Component Details

### NumericInput

A specialized numeric input component with advanced formatting and validation capabilities.

#### Features
- Real-time number formatting
- Unit display
- Min/max validation
- Precision control
- Negative number support
- Error and success states
- iOS-style design patterns

#### Props
```typescript
interface NumericInputProps {
  value: string | number;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  unit?: string;
  error?: string;
  success?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
  formatOnBlur?: boolean;
  allowNegative?: boolean;
  allowDecimal?: boolean;
}
```

#### Usage Example
```tsx
<NumericInput
  label="Diameter at Breast Height"
  value={diameter}
  onChange={setDiameter}
  unit="cm"
  min={0}
  max={1000}
  precision={1}
  required
/>
```

### SpeciesSelector

Advanced species selection component with comprehensive forestry species database.

#### Features
- Search functionality
- Category filtering (coniferous/deciduous)
- Scientific names display
- Density information
- Color-coded species indicators
- Comprehensive species database

#### Props
```typescript
interface SpeciesSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  showScientificName?: boolean;
  showDensity?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "filled";
}
```

#### Usage Example
```tsx
<SpeciesSelector
  label="Tree Species"
  value={species}
  onValueChange={setSpecies}
  showScientificName
  showDensity
  required
/>
```

#### Included Species
- **Coniferous**: Scots Pine, Norway Spruce, Silver Fir, European Larch
- **Deciduous**: English Oak, European Beech, Silver Birch, Norway Maple, Common Ash, English Elm

### GPSInput

GPS coordinate input with automatic detection and manual entry capabilities.

#### Features
- Automatic GPS detection
- Manual coordinate entry
- Reverse geocoding for addresses
- Accuracy display
- Map integration
- Coordinate validation
- Offline support

#### Props
```typescript
interface GPSInputProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  label?: string;
  showMap?: boolean;
  showAccuracy?: boolean;
  showTimestamp?: boolean;
  allowManualEntry?: boolean;
  autoDetect?: boolean;
  required?: boolean;
  disabled?: boolean;
}
```

#### Usage Example
```tsx
<GPSInput
  label="GPS Coordinates"
  value={location}
  onChange={setLocation}
  showAccuracy
  showTimestamp
  required
/>
```

### MeasurementInput

Advanced measurement input with unit conversion and validation.

#### Features
- Multiple measurement types (length, area, volume, weight, density)
- Real-time unit conversion
- Unit selector
- Conversion display
- Validation with min/max values
- Precision control

#### Props
```typescript
interface MeasurementInputProps {
  value: number;
  onChange: (value: number) => void;
  unit: string;
  onUnitChange: (unit: string) => void;
  type: "length" | "area" | "volume" | "weight" | "density";
  min?: number;
  max?: number;
  precision?: number;
  showUnitSelector?: boolean;
  showConversion?: boolean;
  allowNegative?: boolean;
}
```

#### Supported Units
- **Length**: m, cm, mm, ft, in
- **Area**: m², ha, km², ft², ac
- **Volume**: m³, cm³, ft³, yd³, L
- **Weight**: kg, g, t, lb, oz
- **Density**: kg/m³, g/cm³, lb/ft³

#### Usage Example
```tsx
<MeasurementInput
  label="Tree Length"
  value={length}
  onChange={setLength}
  unit={lengthUnit}
  onUnitChange={setLengthUnit}
  type="length"
  min={0}
  max={100}
/>
```

### FormValidation

Comprehensive validation system with forestry-specific validation rules.

#### Features
- Forestry-specific validation patterns
- Real-time validation
- Error, warning, and info messages
- Custom validation rules
- Batch number validation
- Plate number validation
- Coordinate validation

#### Props
```typescript
interface FormValidationProps {
  value: any;
  rules: ValidationRule[];
  showValidation?: boolean;
  showWarnings?: boolean;
  showInfo?: boolean;
}
```

#### Forestry Validation Rules
```typescript
// Available validation rules
forestryValidationRules.required()
forestryValidationRules.coordinates()
forestryValidationRules.species()
forestryValidationRules.measurement(min, max, unit)
forestryValidationRules.batchNumber()
forestryValidationRules.plateNumber()
forestryValidationRules.email()
forestryValidationRules.min(value)
forestryValidationRules.max(value)
forestryValidationRules.custom(validator)
```

#### Usage Example
```tsx
<FormValidation
  value={batchNumber}
  rules={[forestryValidationRules.batchNumber()]}
  showWarnings
/>
```

## Integration Example

```tsx
import React, { useState } from 'react';
import { NumericInput } from './numeric-input';
import { SpeciesSelector } from './species-selector';
import { GPSInput } from './gps-input';
import { MeasurementInput } from './measurement-input';
import { FormValidation, forestryValidationRules } from './form-validation';

function ForestryForm() {
  const [formData, setFormData] = useState({
    diameter: '',
    species: '',
    location: { coordinates: null },
    length: 0,
    lengthUnit: 'm',
  });

  return (
    <form className="space-y-4">
      <NumericInput
        label="Diameter"
        value={formData.diameter}
        onChange={(value) => setFormData(prev => ({ ...prev, diameter: value }))}
        unit="cm"
        min={0}
        max={1000}
        required
      />
      
      <SpeciesSelector
        label="Species"
        value={formData.species}
        onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
        showScientificName
        required
      />
      
      <GPSInput
        label="Location"
        value={formData.location}
        onChange={(location) => setFormData(prev => ({ ...prev, location }))}
        showAccuracy
        required
      />
      
      <MeasurementInput
        label="Length"
        value={formData.length}
        onChange={(value) => setFormData(prev => ({ ...prev, length: value }))}
        unit={formData.lengthUnit}
        onUnitChange={(unit) => setFormData(prev => ({ ...prev, lengthUnit: unit }))}
        type="length"
        min={0}
        required
      />
    </form>
  );
}
```

## Design System Integration

All components are built using the existing design system and follow iOS-style design patterns:

- **Colors**: Use design token colors (brand-primary, surface-bg, etc.)
- **Typography**: Follow typography scale (text-label, text-body, etc.)
- **Spacing**: Use consistent spacing tokens
- **Accessibility**: Full ARIA support and keyboard navigation
- **Touch Targets**: Minimum 48dp touch targets for mobile
- **Focus Management**: Proper focus indicators and keyboard navigation

## Testing

Comprehensive test suite included with:
- Unit tests for each component
- Integration tests for form workflows
- Accessibility testing
- Validation testing
- GPS functionality testing

## Browser Support

- Modern browsers with ES6+ support
- GPS functionality requires HTTPS in production
- Geolocation API support for GPS detection
- LocalStorage for offline data persistence

## Performance Considerations

- Lazy loading of species data
- Debounced validation
- Optimized re-renders with React.memo
- Efficient unit conversion calculations
- Minimal bundle size impact

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
- High contrast support
- Reduced motion support

## Future Enhancements

- Offline species database
- Advanced GPS tracking
- Photo capture integration
- Barcode/QR code scanning
- Voice input support
- Multi-language support
- Advanced analytics integration
