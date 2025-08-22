# Form Components & Validation Guide

## Overview

This guide covers the comprehensive form components and validation system for the Forestry Compliance Application, providing reusable, accessible, and type-safe form solutions.

## 🎯 Features

### Core Features
- **Type-Safe Forms** - Built with React Hook Form and Zod validation
- **Forestry-Specific Components** - Specialized components for forestry operations
- **Comprehensive Validation** - Real-time validation with custom rules
- **Accessibility First** - WCAG 2.1 compliant form components
- **Mobile Optimized** - Touch-friendly components for field operations
- **Offline Support** - Forms work without internet connection

### Form Components
- **Basic Inputs** - Text, number, email, tel, url, textarea
- **Specialized Inputs** - GPS coordinates, measurements, species selection
- **File Uploads** - Drag & drop file upload with validation
- **Date & Time** - Date pickers and time inputs
- **Select Components** - Dropdowns, multi-select, searchable selects
- **Toggle Components** - Checkboxes, radio buttons, switches, sliders

## 📦 Component Library

### Basic Form Components

#### Form Structure
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';

const MyForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormDescription>Enter your full name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
```

#### Input Components
```tsx
// Text Input
<Input 
  type="text" 
  placeholder="Enter text" 
  className="touch-target"
/>

// Number Input
<Input 
  type="number" 
  min={0} 
  max={100} 
  step={0.1}
/>

// Email Input
<Input 
  type="email" 
  autoComplete="email"
/>

// Textarea
<Textarea 
  placeholder="Enter description" 
  rows={4}
/>
```

### Forestry-Specific Components

#### GPS Input Component
```tsx
import { GPSInput } from '@/components/ui/forestry-form-components';

<GPSInput
  label="GPS Coordinates"
  description="Enter or capture GPS coordinates"
  value={{ lat: 41.7151, lng: 44.8271 }}
  onChange={(coords) => console.log(coords)}
  onCapture={() => {
    // Handle GPS capture
  }}
  accuracy={5}
  required={true}
/>
```

#### Species Selector
```tsx
import { SpeciesSelector } from '@/components/ui/forestry-form-components';

<SpeciesSelector
  label="Tree Species"
  description="Select tree species"
  value="pine"
  onChange={(species) => console.log(species)}
  required={true}
/>
```

#### Measurement Input
```tsx
import { MeasurementInput } from '@/components/ui/forestry-form-components';

<MeasurementInput
  label="Diameter"
  unit="cm"
  description="Enter tree diameter"
  value={25.5}
  onChange={(value) => console.log(value)}
  min={0}
  max={500}
  step={0.1}
  required={true}
/>
```

## 🔧 Validation System

### Zod Schemas
```tsx
import * as z from 'zod';
import { forestrySchemas } from '@/components/ui/forestry-form-components';

// Tree measurement schema
const treeSchema = forestrySchemas.treeMeasurement;

// GPS coordinates schema
const gpsSchema = forestrySchemas.gpsCoordinates;

// Batch processing schema
const batchSchema = forestrySchemas.batchProcessing;

// Compliance document schema
const complianceSchema = forestrySchemas.complianceDocument;

// Volume calculation schema
const volumeSchema = forestrySchemas.volumeCalculation;
```

### Custom Validation Rules
```tsx
import { FormValidation, forestryValidationRules } from '@/components/ui/form-validation';

// Basic validation
const basicRules = [
  forestryValidationRules.required(),
  forestryValidationRules.min(10),
  forestryValidationRules.max(100),
  forestryValidationRules.email(),
];

// Forestry-specific validation
const forestryRules = [
  forestryValidationRules.coordinates(),
  forestryValidationRules.species(),
  forestryValidationRules.measurement(0, 500, 'cm'),
  forestryValidationRules.batchNumber(),
  forestryValidationRules.plateNumber(),
];

// Custom validation
const customRules = [
  forestryValidationRules.custom(
    (value) => value.length > 0 && value.length <= 100,
    'Must be between 1 and 100 characters'
  ),
];
```

### Form Validation Component
```tsx
<FormValidation
  value={formValue}
  rules={validationRules}
  label="Field Label"
  showValidation={true}
  showWarnings={true}
  showInfo={true}
/>
```

## 📋 Form Patterns

### Tree Measurement Form
```tsx
const TreeMeasurementForm = () => {
  const form = useForm({
    resolver: zodResolver(forestrySchemas.treeMeasurement),
    defaultValues: {
      species: '',
      diameter: 0,
      height: 0,
      health: 'good',
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="species"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Species</FormLabel>
              <FormControl>
                <SpeciesSelector
                  value={field.value}
                  onChange={field.onChange}
                  label="Tree Species"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diameter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diameter</FormLabel>
              <FormControl>
                <MeasurementInput
                  value={field.value}
                  onChange={field.onChange}
                  unit="cm"
                  label="Diameter"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height</FormLabel>
              <FormControl>
                <MeasurementInput
                  value={field.value}
                  onChange={field.onChange}
                  unit="m"
                  label="Height"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="health"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select health status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional observations..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Measurement</Button>
      </form>
    </Form>
  );
};
```

### GPS Location Form
```tsx
const GPSLocationForm = () => {
  const form = useForm({
    resolver: zodResolver(forestrySchemas.gpsCoordinates),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      accuracy: 0,
      timestamp: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="coordinates"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPS Coordinates</FormLabel>
              <FormControl>
                <GPSInput
                  value={field.value}
                  onChange={field.onChange}
                  onCapture={() => {
                    // Handle GPS capture
                  }}
                  accuracy={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Location</Button>
      </form>
    </Form>
  );
};
```

### Batch Processing Form
```tsx
const BatchProcessingForm = () => {
  const form = useForm({
    resolver: zodResolver(forestrySchemas.batchProcessing),
    defaultValues: {
      batchNumber: '',
      date: new Date(),
      location: '',
      operator: '',
      weather: 'sunny',
      temperature: 20,
      humidity: 50,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="batchNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="YYYYMMDD-XXXXXX"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter location"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="operator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Operator</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter operator name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="weather"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weather Conditions</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sunny">Sunny</SelectItem>
                  <SelectItem value="cloudy">Cloudy</SelectItem>
                  <SelectItem value="rainy">Rainy</SelectItem>
                  <SelectItem value="snowy">Snowy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temperature"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temperature (°C)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={-50}
                  max={60}
                  step={0.1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="humidity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Humidity (%)</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Start Batch Processing</Button>
      </form>
    </Form>
  );
};
```

## 🎨 Styling & Theming

### Form Variants
```tsx
// Default form
<Form variant="default">
  {/* Form content */}
</Form>

// Card form
<Form variant="card">
  {/* Form content */}
</Form>

// Compact form
<Form variant="compact">
  {/* Form content */}
</Form>

// Expanded form
<Form variant="expanded">
  {/* Form content */}
</Form>
```

### Custom Styling
```tsx
// Custom form styling
<Form className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
  {/* Form content */}
</Form>

// Field-specific styling
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem className="space-y-2">
      <FormLabel className="text-lg font-semibold">Field Label</FormLabel>
      <FormControl>
        <Input 
          className="border-2 border-gray-300 focus:border-blue-500" 
          {...field} 
        />
      </FormControl>
      <FormDescription className="text-sm text-gray-600">
        Field description
      </FormDescription>
      <FormMessage className="text-red-500 font-medium" />
    </FormItem>
  )}
/>
```

## ♿ Accessibility Features

### ARIA Labels & Descriptions
```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel id="field-label">Field Label</FormLabel>
      <FormControl>
        <Input
          aria-labelledby="field-label"
          aria-describedby="field-description field-error"
          {...field}
        />
      </FormControl>
      <FormDescription id="field-description">
        Field description
      </FormDescription>
      <FormMessage id="field-error" />
    </FormItem>
  )}
/>
```

### Keyboard Navigation
```tsx
// All form components support keyboard navigation
<Input
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      // Handle enter key
    }
    if (e.key === 'Escape') {
      // Handle escape key
    }
  }}
/>
```

### Screen Reader Support
```tsx
// Proper labeling for screen readers
<FormLabel>
  <span className="sr-only">Hidden label for screen readers</span>
  Visible Label
</FormLabel>

// Error announcements
<FormMessage role="alert" aria-live="polite">
  Error message
</FormMessage>
```

## 📱 Mobile Optimization

### Touch-Friendly Components
```tsx
// Touch targets meet minimum 44px requirement
<Input className="touch-target h-11" />
<Button className="touch-target min-h-11 min-w-11" />

// Mobile-optimized spacing
<Form className="space-y-4 md:space-y-6">
  {/* Form content */}
</Form>
```

### Responsive Layout
```tsx
// Responsive form layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <FormField name="field1" />
  <FormField name="field2" />
</div>

// Mobile-first approach
<Form className="p-4 md:p-6 lg:p-8">
  {/* Form content */}
</Form>
```

## 🧪 Testing

### Unit Tests
```tsx
// Test form rendering
it('renders form with fields', () => {
  render(<MyForm />);
  expect(screen.getByText('Field Label')).toBeInTheDocument();
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});

// Test form submission
it('handles form submission', async () => {
  const handleSubmit = jest.fn();
  render(<MyForm onSubmit={handleSubmit} />);
  
  await userEvent.type(screen.getByRole('textbox'), 'test value');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(handleSubmit).toHaveBeenCalledWith({ fieldName: 'test value' });
});

// Test validation
it('shows validation errors', async () => {
  render(<MyForm />);
  
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('This field is required')).toBeInTheDocument();
});
```

### Integration Tests
```tsx
// Test form with validation
it('validates form data', async () => {
  const schema = z.object({
    email: z.string().email('Invalid email'),
  });
  
  render(<MyForm schema={schema} />);
  
  await userEvent.type(screen.getByRole('textbox'), 'invalid-email');
  await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
  
  expect(screen.getByText('Invalid email')).toBeInTheDocument();
});
```

## 🚀 Performance Optimization

### Form Optimization
```tsx
// Memoize form components
const MemoizedForm = React.memo(MyForm);

// Use React.memo for expensive components
const ExpensiveField = React.memo(({ value, onChange }) => (
  <ComplexInput value={value} onChange={onChange} />
));

// Lazy load form sections
const LazyFormSection = React.lazy(() => import('./FormSection'));
```

### Validation Optimization
```tsx
// Debounce validation
const debouncedValidation = useMemo(
  () => debounce(validateField, 300),
  []
);

// Conditional validation
const shouldValidate = useMemo(() => {
  return formState.isDirty && formState.isTouched;
}, [formState.isDirty, formState.isTouched]);
```

## 📚 Best Practices

### Form Structure
1. **Use semantic HTML** - Proper form elements and labels
2. **Group related fields** - Logical field grouping
3. **Provide clear feedback** - Validation messages and success states
4. **Support keyboard navigation** - Tab order and keyboard shortcuts
5. **Handle errors gracefully** - Clear error messages and recovery options

### Validation
1. **Validate on blur** - Real-time validation without overwhelming users
2. **Show validation state** - Clear visual indicators
3. **Provide helpful messages** - Specific, actionable error messages
4. **Support custom validation** - Domain-specific validation rules
5. **Handle async validation** - Server-side validation when needed

### Accessibility
1. **Use proper labels** - Associate labels with form controls
2. **Support screen readers** - ARIA labels and descriptions
3. **Keyboard navigation** - Full keyboard support
4. **Focus management** - Clear focus indicators and order
5. **Error announcements** - Screen reader announcements for errors

### Mobile Experience
1. **Touch-friendly targets** - Minimum 44px touch targets
2. **Responsive design** - Adapt to different screen sizes
3. **Offline support** - Forms work without internet
4. **Fast loading** - Optimize for mobile performance
5. **Native features** - GPS, camera, file upload integration

This comprehensive form components and validation guide ensures robust, accessible, and user-friendly forms for the Forestry Compliance Application.
