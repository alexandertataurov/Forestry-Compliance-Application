import React, { useState } from 'react';
import { NumericInput } from './numeric-input';
import { SpeciesSelector } from './species-selector';
import { GPSInput } from './gps-input';
import { MeasurementInput } from './measurement-input';
import { FormValidation, forestryValidationRules } from './form-validation';
import { Button } from './button';
import { Card } from './card';

interface FormData {
  diameter: string;
  species: string;
  location: { coordinates: { lat: number; lng: number } | null };
  length: number;
  lengthUnit: string;
  volume: number;
  volumeUnit: string;
  weight: number;
  weightUnit: string;
}

export function ForestryFormDemo() {
  const [formData, setFormData] = useState<FormData>({
    diameter: '',
    species: '',
    location: { coordinates: null },
    length: 0,
    lengthUnit: 'm',
    volume: 0,
    volumeUnit: 'm3',
    weight: 0,
    weightUnit: 'kg',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.diameter) {
      newErrors.diameter = 'Diameter is required';
    }
    if (!formData.species) {
      newErrors.species = 'Species is required';
    }
    if (!formData.location.coordinates) {
      newErrors.location = 'Location is required';
    }
    if (formData.length <= 0) {
      newErrors.length = 'Length must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! Check console for data.');
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  const handleReset = () => {
    setFormData({
      diameter: '',
      species: '',
      location: { coordinates: null },
      length: 0,
      lengthUnit: 'm',
      volume: 0,
      volumeUnit: 'm3',
      weight: 0,
      weightUnit: 'kg',
    });
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-on-surface mb-2">
          Forestry Data Entry Form
        </h1>
        <p className="text-surface-on-variant">
          Comprehensive form components for forestry compliance data collection
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Tree Measurements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NumericInput
              label="Diameter at Breast Height"
              value={formData.diameter}
              onChange={(value) => updateFormData('diameter', value)}
              unit="cm"
              min={0}
              max={1000}
              precision={1}
              required
              error={errors.diameter}
            />
            
            <MeasurementInput
              label="Tree Length"
              value={formData.length}
              onChange={(value) => updateFormData('length', value)}
              unit={formData.lengthUnit}
              onUnitChange={(unit) => updateFormData('lengthUnit', unit)}
              type="length"
              min={0}
              max={100}
              required
              error={errors.length}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Species Information</h2>
          <SpeciesSelector
            label="Tree Species"
            value={formData.species}
            onValueChange={(value) => updateFormData('species', value)}
            showScientificName
            showDensity
            required
            error={errors.species}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Location Data</h2>
          <GPSInput
            label="GPS Coordinates"
            value={formData.location}
            onChange={(location) => updateFormData('location', location)}
            showAccuracy
            showTimestamp
            required
            error={errors.location}
          />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Calculated Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MeasurementInput
              label="Estimated Volume"
              value={formData.volume}
              onChange={(value) => updateFormData('volume', value)}
              unit={formData.volumeUnit}
              onUnitChange={(unit) => updateFormData('volumeUnit', unit)}
              type="volume"
              min={0}
              precision={3}
            />
            
            <MeasurementInput
              label="Estimated Weight"
              value={formData.weight}
              onChange={(value) => updateFormData('weight', value)}
              unit={formData.weightUnit}
              onUnitChange={(unit) => updateFormData('weightUnit', unit)}
              type="weight"
              min={0}
              precision={1}
            />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Validation Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-surface-on-surface mb-2 block">
                Batch Number Validation
              </label>
              <FormValidation
                value="20241201-ABC123"
                rules={[forestryValidationRules.batchNumber()]}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-surface-on-surface mb-2 block">
                Plate Number Validation
              </label>
              <FormValidation
                value="AB123CD"
                rules={[forestryValidationRules.plateNumber()]}
                showWarnings
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
          >
            Reset Form
          </Button>
          <Button type="submit">
            Submit Data
          </Button>
        </div>
      </form>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Form Data Preview</h2>
        <pre className="bg-surface-bg-variant p-4 rounded-md text-sm overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
