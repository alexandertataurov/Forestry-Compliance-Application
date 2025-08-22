import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NumericInput } from './numeric-input';
import { SpeciesSelector } from './species-selector';
import { GPSInput } from './gps-input';
import { MeasurementInput } from './measurement-input';
import { FormValidation, forestryValidationRules } from './form-validation';

// Mock geolocation API
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

// Mock fetch for reverse geocoding
global.fetch = jest.fn();

describe('NumericInput Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders with label', () => {
    render(<NumericInput {...defaultProps} label="Diameter" />);
    expect(screen.getByText('Diameter')).toBeInTheDocument();
  });

  it('handles numeric input correctly', () => {
    const onChange = jest.fn();
    render(<NumericInput {...defaultProps} onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.45' } });
    
    expect(onChange).toHaveBeenCalledWith('123.45');
  });

  it('validates required field', () => {
    render(<NumericInput {...defaultProps} required />);
    const input = screen.getByRole('textbox');
    
    fireEvent.blur(input);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('shows unit display', () => {
    render(<NumericInput {...defaultProps} unit="cm" />);
    expect(screen.getByText('cm')).toBeInTheDocument();
  });

  it('formats number on blur', () => {
    const onChange = jest.fn();
    render(<NumericInput {...defaultProps} onChange={onChange} precision={2} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.456' } });
    fireEvent.blur(input);
    
    expect(onChange).toHaveBeenCalledWith('123.46');
  });
});

describe('SpeciesSelector Component', () => {
  const defaultProps = {
    value: '',
    onValueChange: jest.fn(),
  };

  it('renders with placeholder', () => {
    render(<SpeciesSelector {...defaultProps} />);
    expect(screen.getByText('Select species...')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(<SpeciesSelector {...defaultProps} />);
    const trigger = screen.getByRole('button');
    
    fireEvent.click(trigger);
    expect(screen.getByText('Scots Pine')).toBeInTheDocument();
  });

  it('filters species by search', () => {
    render(<SpeciesSelector {...defaultProps} />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    const searchInput = screen.getByPlaceholderText('Search species...');
    fireEvent.change(searchInput, { target: { value: 'oak' } });
    
    expect(screen.getByText('English Oak')).toBeInTheDocument();
    expect(screen.queryByText('Scots Pine')).not.toBeInTheDocument();
  });

  it('filters by category', () => {
    render(<SpeciesSelector {...defaultProps} />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);
    
    const deciduousButton = screen.getByText('Deciduous (5)');
    fireEvent.click(deciduousButton);
    
    expect(screen.getByText('English Oak')).toBeInTheDocument();
    expect(screen.queryByText('Scots Pine')).not.toBeInTheDocument();
  });

  it('displays selected species', () => {
    render(<SpeciesSelector {...defaultProps} value="oak-english" />);
    expect(screen.getByText('English Oak')).toBeInTheDocument();
    expect(screen.getByText('Quercus robur')).toBeInTheDocument();
  });
});

describe('GPSInput Component', () => {
  const defaultProps = {
    value: { coordinates: null },
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders GPS detection button', () => {
    render(<GPSInput {...defaultProps} />);
    expect(screen.getByText('Detect GPS Location')).toBeInTheDocument();
  });

  it('renders manual entry button', () => {
    render(<GPSInput {...defaultProps} />);
    expect(screen.getByText('Manual Entry')).toBeInTheDocument();
  });

  it('opens manual entry form', () => {
    render(<GPSInput {...defaultProps} />);
    const manualButton = screen.getByText('Manual Entry');
    fireEvent.click(manualButton);
    
    expect(screen.getByLabelText('Latitude')).toBeInTheDocument();
    expect(screen.getByLabelText('Longitude')).toBeInTheDocument();
  });

  it('handles GPS detection', async () => {
    const mockPosition = {
      coords: {
        latitude: 41.7151,
        longitude: 44.8271,
        accuracy: 10,
      },
    };
    
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    const onChange = jest.fn();
    render(<GPSInput {...defaultProps} onChange={onChange} />);
    
    const detectButton = screen.getByText('Detect GPS Location');
    fireEvent.click(detectButton);
    
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        coordinates: { lat: 41.7151, lng: 44.8271 },
        accuracy: 10,
        timestamp: expect.any(Number),
      });
    });
  });

  it('displays current location when coordinates exist', () => {
    const props = {
      ...defaultProps,
      value: {
        coordinates: { lat: 41.7151, lng: 44.8271 },
        accuracy: 10,
      },
    };
    
    render(<GPSInput {...props} />);
    expect(screen.getByText('Current Location')).toBeInTheDocument();
    expect(screen.getByText('41.715100')).toBeInTheDocument();
    expect(screen.getByText('44.827100')).toBeInTheDocument();
  });

  it('shows map link when coordinates exist', () => {
    const props = {
      ...defaultProps,
      value: {
        coordinates: { lat: 41.7151, lng: 44.8271 },
      },
    };
    
    render(<GPSInput {...props} />);
    expect(screen.getByText('View on Map')).toBeInTheDocument();
  });
});

describe('MeasurementInput Component', () => {
  const defaultProps = {
    value: 0,
    onChange: jest.fn(),
    unit: 'm',
    onUnitChange: jest.fn(),
    type: 'length' as const,
  };

  it('renders with label', () => {
    render(<MeasurementInput {...defaultProps} label="Length" />);
    expect(screen.getByText('Length')).toBeInTheDocument();
  });

  it('displays current unit', () => {
    render(<MeasurementInput {...defaultProps} />);
    expect(screen.getByText('m')).toBeInTheDocument();
  });

  it('opens unit selector on click', () => {
    render(<MeasurementInput {...defaultProps} />);
    const unitButton = screen.getByText('m');
    fireEvent.click(unitButton);
    
    expect(screen.getByText('cm')).toBeInTheDocument();
    expect(screen.getByText('Centimeters')).toBeInTheDocument();
  });

  it('converts values when unit changes', () => {
    const onChange = jest.fn();
    const onUnitChange = jest.fn();
    
    render(
      <MeasurementInput
        {...defaultProps}
        value={100}
        onChange={onChange}
        onUnitChange={onUnitChange}
      />
    );
    
    const unitButton = screen.getByText('m');
    fireEvent.click(unitButton);
    
    const cmButton = screen.getByText('cm');
    fireEvent.click(cmButton);
    
    expect(onChange).toHaveBeenCalledWith(10000);
    expect(onUnitChange).toHaveBeenCalledWith('cm');
  });

  it('shows conversions', () => {
    render(<MeasurementInput {...defaultProps} value={1} />);
    expect(screen.getByText('Conversions:')).toBeInTheDocument();
    expect(screen.getByText('100 cm')).toBeInTheDocument();
  });

  it('validates min/max values', () => {
    render(<MeasurementInput {...defaultProps} min={0} max={100} />);
    const input = screen.getByRole('spinbutton');
    
    fireEvent.change(input, { target: { value: '-1' } });
    fireEvent.blur(input);
    
    expect(screen.getByText('Value must be at least 0 m')).toBeInTheDocument();
  });
});

describe('FormValidation Component', () => {
  it('validates required fields', () => {
    render(
      <FormValidation
        value=""
        rules={[forestryValidationRules.required()]}
      />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('validates coordinates', () => {
    render(
      <FormValidation
        value="invalid-coordinates"
        rules={[forestryValidationRules.coordinates()]}
      />
    );
    
    expect(screen.getByText(/Please enter valid coordinates/)).toBeInTheDocument();
  });

  it('validates valid coordinates', () => {
    render(
      <FormValidation
        value={{ lat: 41.7151, lng: 44.8271 }}
        rules={[forestryValidationRules.coordinates()]}
      />
    );
    
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('validates batch numbers', () => {
    render(
      <FormValidation
        value="invalid-batch"
        rules={[forestryValidationRules.batchNumber()]}
      />
    );
    
    expect(screen.getByText(/Batch number should follow format/)).toBeInTheDocument();
  });

  it('validates valid batch numbers', () => {
    render(
      <FormValidation
        value="20241201-ABC123"
        rules={[forestryValidationRules.batchNumber()]}
      />
    );
    
    expect(screen.getByText('Valid')).toBeInTheDocument();
  });

  it('validates measurements', () => {
    render(
      <FormValidation
        value={-1}
        rules={[forestryValidationRules.measurement(0, 100, 'm')]}
      />
    );
    
    expect(screen.getByText(/Value must be at least 0/)).toBeInTheDocument();
  });

  it('shows warnings for plate numbers', () => {
    render(
      <FormValidation
        value="INVALID"
        rules={[forestryValidationRules.plateNumber()]}
        showWarnings={true}
      />
    );
    
    expect(screen.getByText(/Plate number format may be invalid/)).toBeInTheDocument();
  });

  it('validates email addresses', () => {
    render(
      <FormValidation
        value="invalid-email"
        rules={[forestryValidationRules.email()]}
      />
    );
    
    expect(screen.getByText(/Please enter a valid email address/)).toBeInTheDocument();
  });

  it('validates custom rules', () => {
    const customRule = forestryValidationRules.custom(
      (value) => value === 'valid' || 'Must be "valid"'
    );
    
    render(
      <FormValidation
        value="invalid"
        rules={[customRule]}
      />
    );
    
    expect(screen.getByText('Must be "valid"')).toBeInTheDocument();
  });
});

describe('Component Integration', () => {
  it('works together in a form context', () => {
    const TestForm = () => {
      const [formData, setFormData] = React.useState({
        diameter: '',
        species: '',
        location: { coordinates: null },
        length: 0,
        lengthUnit: 'm',
      });

      return (
        <div>
          <NumericInput
            label="Diameter"
            value={formData.diameter}
            onChange={(value) => setFormData(prev => ({ ...prev, diameter: value }))}
            unit="cm"
            min={0}
            max={1000}
          />
          
          <SpeciesSelector
            label="Species"
            value={formData.species}
            onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
          />
          
          <GPSInput
            label="Location"
            value={formData.location}
            onChange={(location) => setFormData(prev => ({ ...prev, location }))}
          />
          
          <MeasurementInput
            label="Length"
            value={formData.length}
            onChange={(value) => setFormData(prev => ({ ...prev, length: value }))}
            unit={formData.lengthUnit}
            onUnitChange={(unit) => setFormData(prev => ({ ...prev, lengthUnit: unit }))}
            type="length"
          />
        </div>
      );
    };

    render(<TestForm />);
    
    expect(screen.getByText('Diameter')).toBeInTheDocument();
    expect(screen.getByText('Species')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Length')).toBeInTheDocument();
  });
});
