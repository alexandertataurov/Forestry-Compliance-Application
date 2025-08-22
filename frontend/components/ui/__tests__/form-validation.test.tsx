import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../form';
import { Input } from '../input';
import { Button } from '../button';
import { FormValidation, forestryValidationRules } from '../form-validation';
import { GPSInput, SpeciesSelector, MeasurementInput } from '../forestry-form-components';
import { forestrySchemas } from '../forestry-form-components';

// Test form component wrapper
const TestForm = ({ schema, defaultValues, onSubmit }: {
  schema?: any;
  defaultValues?: any;
  onSubmit?: (data: any) => void;
}) => {
  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit || (() => {}))}>
        <FormField
          control={form.control}
          name="testField"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Field</FormLabel>
              <FormControl>
                <Input placeholder="Enter test value" {...field} />
              </FormControl>
              <FormDescription>Test description</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

describe('Form Components & Validation', () => {
  describe('Basic Form Components', () => {
    it('renders form with field', () => {
      render(<TestForm />);
      
      expect(screen.getByText('Test Field')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter test value')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('handles form submission', async () => {
      const handleSubmit = jest.fn();
      render(<TestForm onSubmit={handleSubmit} />);
      
      const input = screen.getByPlaceholderText('Enter test value');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await userEvent.type(input, 'test value');
      await userEvent.click(submitButton);
      
      expect(handleSubmit).toHaveBeenCalledWith({ testField: 'test value' });
    });

    it('shows validation errors', async () => {
      const schema = z.object({
        testField: z.string().min(3, 'Must be at least 3 characters'),
      });
      
      render(<TestForm schema={schema} />);
      
      const input = screen.getByPlaceholderText('Enter test value');
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      
      await userEvent.type(input, 'ab');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument();
    });
  });

  describe('FormValidation Component', () => {
    it('renders validation messages', () => {
      const rules = [forestryValidationRules.required()];
      
      render(
        <FormValidation
          value=""
          rules={rules}
          label="Test Field"
          showValidation={true}
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows success message for valid input', () => {
      const rules = [forestryValidationRules.required()];
      
      render(
        <FormValidation
          value="valid input"
          rules={rules}
          label="Test Field"
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('validates email format', () => {
      const rules = [forestryValidationRules.email()];
      
      const { rerender } = render(
        <FormValidation
          value="invalid-email"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value="valid@email.com"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('validates minimum and maximum values', () => {
      const rules = [
        forestryValidationRules.min(10),
        forestryValidationRules.max(100),
      ];
      
      const { rerender } = render(
        <FormValidation
          value={5}
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Value must be at least 10')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value={150}
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Value must be no more than 100')).toBeInTheDocument();
    });
  });

  describe('Forestry-Specific Validation', () => {
    it('validates GPS coordinates', () => {
      const rules = [forestryValidationRules.coordinates()];
      
      const { rerender } = render(
        <FormValidation
          value="invalid-coordinates"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Please enter valid coordinates (e.g., 41.7151, 44.8271)')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value="41.7151, 44.8271"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('validates batch numbers', () => {
      const rules = [forestryValidationRules.batchNumber()];
      
      const { rerender } = render(
        <FormValidation
          value="invalid-batch"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Batch number should follow format: YYYYMMDD-XXXXXX')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value="20241201-ABC123"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('validates plate numbers', () => {
      const rules = [forestryValidationRules.plateNumber()];
      
      const { rerender } = render(
        <FormValidation
          value="invalid-plate"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Plate number format may be invalid')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value="AB123CD"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });

    it('validates measurements', () => {
      const rules = [forestryValidationRules.measurement(0, 100, 'cm')];
      
      const { rerender } = render(
        <FormValidation
          value="invalid-measurement"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Invalid measurement format')).toBeInTheDocument();
      
      rerender(
        <FormValidation
          value="50 cm"
          rules={rules}
          showValidation={true}
        />
      );
      
      expect(screen.getByText('Valid')).toBeInTheDocument();
    });
  });

  describe('GPSInput Component', () => {
    it('renders GPS input fields', () => {
      render(
        <GPSInput
          label="GPS Coordinates"
          description="Enter GPS coordinates"
        />
      );
      
      expect(screen.getByText('GPS Coordinates')).toBeInTheDocument();
      expect(screen.getByText('Latitude')).toBeInTheDocument();
      expect(screen.getByText('Longitude')).toBeInTheDocument();
      expect(screen.getByText('Enter GPS coordinates')).toBeInTheDocument();
    });

    it('handles coordinate changes', async () => {
      const handleChange = jest.fn();
      
      render(
        <GPSInput
          label="GPS Coordinates"
          onChange={handleChange}
        />
      );
      
      const latInput = screen.getByPlaceholderText('41.7151');
      const lngInput = screen.getByPlaceholderText('44.8271');
      
      await userEvent.type(latInput, '41.7151');
      await userEvent.type(lngInput, '44.8271');
      
      expect(handleChange).toHaveBeenCalledWith({ lat: 41.7151, lng: 44.8271 });
    });

    it('shows capture location button when onCapture is provided', () => {
      const handleCapture = jest.fn();
      
      render(
        <GPSInput
          label="GPS Coordinates"
          onCapture={handleCapture}
        />
      );
      
      expect(screen.getByText('Capture Current Location')).toBeInTheDocument();
    });

    it('shows accuracy information', () => {
      render(
        <GPSInput
          label="GPS Coordinates"
          accuracy={5}
        />
      );
      
      expect(screen.getByText('Accuracy: 5m')).toBeInTheDocument();
    });
  });

  describe('SpeciesSelector Component', () => {
    it('renders species selector', () => {
      render(
        <SpeciesSelector
          label="Tree Species"
          description="Select tree species"
        />
      );
      
      expect(screen.getByText('Tree Species')).toBeInTheDocument();
      expect(screen.getByText('Select tree species')).toBeInTheDocument();
      expect(screen.getByText('Select species')).toBeInTheDocument();
    });

    it('opens species options on click', async () => {
      const handleChange = jest.fn();
      
      render(
        <SpeciesSelector
          label="Tree Species"
          onChange={handleChange}
        />
      );
      
      const trigger = screen.getByText('Select species');
      await userEvent.click(trigger);
      
      expect(screen.getByText('Pine (Pinus)')).toBeInTheDocument();
      expect(screen.getByText('Oak (Quercus)')).toBeInTheDocument();
      expect(screen.getByText('Maple (Acer)')).toBeInTheDocument();
    });

    it('handles species selection', async () => {
      const handleChange = jest.fn();
      
      render(
        <SpeciesSelector
          label="Tree Species"
          onChange={handleChange}
        />
      );
      
      const trigger = screen.getByText('Select species');
      await userEvent.click(trigger);
      
      const pineOption = screen.getByText('Pine (Pinus)');
      await userEvent.click(pineOption);
      
      expect(handleChange).toHaveBeenCalledWith('pine');
    });
  });

  describe('MeasurementInput Component', () => {
    it('renders measurement input', () => {
      render(
        <MeasurementInput
          label="Diameter"
          unit="cm"
          description="Enter tree diameter"
        />
      );
      
      expect(screen.getByText('Diameter')).toBeInTheDocument();
      expect(screen.getByText('Enter tree diameter')).toBeInTheDocument();
      expect(screen.getByText('cm')).toBeInTheDocument();
    });

    it('handles measurement changes', async () => {
      const handleChange = jest.fn();
      
      render(
        <MeasurementInput
          label="Diameter"
          unit="cm"
          onChange={handleChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Enter diameter');
      await userEvent.type(input, '25.5');
      
      expect(handleChange).toHaveBeenCalledWith(25.5);
    });

    it('respects min and max constraints', () => {
      render(
        <MeasurementInput
          label="Diameter"
          unit="cm"
          min={0}
          max={500}
        />
      );
      
      const input = screen.getByPlaceholderText('Enter diameter');
      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '500');
    });
  });

  describe('Forestry Schemas', () => {
    it('validates tree measurement schema', async () => {
      const schema = forestrySchemas.treeMeasurement;
      const validData = {
        species: 'pine',
        diameter: 25.5,
        height: 15.2,
        health: 'good' as const,
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid tree measurement data', () => {
      const schema = forestrySchemas.treeMeasurement;
      const invalidData = {
        species: '',
        diameter: -5,
        height: 200,
        health: 'invalid' as any,
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('validates GPS coordinates schema', () => {
      const schema = forestrySchemas.gpsCoordinates;
      const validData = {
        latitude: 41.7151,
        longitude: 44.8271,
        accuracy: 5,
        timestamp: new Date(),
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid GPS coordinates', () => {
      const schema = forestrySchemas.gpsCoordinates;
      const invalidData = {
        latitude: 100, // Invalid latitude
        longitude: 200, // Invalid longitude
        accuracy: -5, // Invalid accuracy
        timestamp: new Date(),
      };
      
      const result = schema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('validates batch processing schema', () => {
      const schema = forestrySchemas.batchProcessing;
      const validData = {
        batchNumber: '20241201-ABC123',
        date: new Date(),
        location: 'Forest Area A',
        operator: 'John Doe',
        weather: 'sunny' as const,
        temperature: 25,
        humidity: 60,
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates compliance document schema', () => {
      const schema = forestrySchemas.complianceDocument;
      const validData = {
        documentType: 'permit' as const,
        documentNumber: 'PERM-2024-001',
        issueDate: new Date(),
        issuingAuthority: 'Forestry Department',
        status: 'active' as const,
      };
      
      const result = schema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('integrates form validation with forestry components', async () => {
      const handleSubmit = jest.fn();
      const schema = forestrySchemas.treeMeasurement;
      
      const TestForestryForm = () => {
        const form = useForm({
          resolver: zodResolver(schema),
          defaultValues: {
            species: '',
            diameter: 0,
            height: 0,
            health: 'good' as const,
          },
        });

        return (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
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
              
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        );
      };
      
      render(<TestForestryForm />);
      
      const submitButton = screen.getByRole('button', { name: 'Submit' });
      await userEvent.click(submitButton);
      
      // Should show validation errors for required fields
      expect(screen.getByText('Species is required')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(
        <GPSInput
          label="GPS Coordinates"
          required={true}
        />
      );
      
      const latInput = screen.getByLabelText('Latitude');
      const lngInput = screen.getByLabelText('Longitude');
      
      expect(latInput).toBeInTheDocument();
      expect(lngInput).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      render(
        <SpeciesSelector
          label="Tree Species"
        />
      );
      
      const trigger = screen.getByText('Select species');
      trigger.focus();
      
      fireEvent.keyDown(trigger, { key: 'Enter' });
      
      await waitFor(() => {
        expect(screen.getByText('Pine (Pinus)')).toBeInTheDocument();
      });
    });

    it('shows required field indicators', () => {
      render(
        <MeasurementInput
          label="Diameter"
          unit="cm"
          required={true}
        />
      );
      
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles GPS capture errors gracefully', () => {
      // Mock geolocation to fail
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success, error) => {
          error({ code: 1, message: 'Permission denied' });
        }),
      };
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true,
      });
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      render(
        <GPSInput
          label="GPS Coordinates"
          onCapture={() => {}}
        />
      );
      
      const captureButton = screen.getByText('Capture Current Location');
      fireEvent.click(captureButton);
      
      expect(consoleSpy).toHaveBeenCalledWith('GPS capture failed:', expect.any(Object));
      
      consoleSpy.mockRestore();
    });

    it('handles invalid numeric input', async () => {
      const handleChange = jest.fn();
      
      render(
        <MeasurementInput
          label="Diameter"
          unit="cm"
          onChange={handleChange}
        />
      );
      
      const input = screen.getByPlaceholderText('Enter diameter');
      await userEvent.type(input, 'abc');
      
      // Should not call onChange with invalid input
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
