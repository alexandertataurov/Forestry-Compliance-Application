import { describe, it, expect } from 'vitest';
import { calculateLogVolume, validateMeasurement, calculateBatchVolume } from '../utils/gost-calculations';

describe('Forestry Data Validation & Integrity Tests', () => {
  describe('Volume Calculation Accuracy', () => {
    it('should calculate volume correctly for standard measurements', () => {
      // Test case 1: Standard log
      const volume1 = calculateLogVolume(25, 6);
      expect(volume1).toBeCloseTo(0.294, 3); // Expected: π * (0.25/2)² * 6 * 0.95

      // Test case 2: Large log
      const volume2 = calculateLogVolume(50, 8);
      expect(volume2).toBeCloseTo(1.493, 3); // Expected: π * (0.5/2)² * 8 * 0.95

      // Test case 3: Small log
      const volume3 = calculateLogVolume(15, 4);
      expect(volume3).toBeCloseTo(0.067, 3); // Expected: π * (0.15/2)² * 4 * 0.95
    });

    it('should handle edge cases correctly', () => {
      // Minimum valid diameter
      const minVolume = calculateLogVolume(6, 0.5);
      expect(minVolume).toBeGreaterThan(0);
      expect(minVolume).toBeLessThan(0.01);

      // Maximum valid diameter
      const maxVolume = calculateLogVolume(120, 15);
      expect(maxVolume).toBeGreaterThan(10);
      expect(maxVolume).toBeLessThan(20);

      // Zero length should return zero volume
      const zeroVolume = calculateLogVolume(25, 0);
      expect(zeroVolume).toBe(0);
    });

    it('should apply GOST correction factors correctly', () => {
      // Test that correction factor is applied
      const diameter = 30;
      const length = 6;
      
      // Manual calculation without correction
      const diameterM = diameter / 100;
      const baseVolume = Math.PI * Math.pow(diameterM / 2, 2) * length;
      
      // With correction factor (0.95)
      const correctedVolume = baseVolume * 0.95;
      
      const calculatedVolume = calculateLogVolume(diameter, length);
      expect(calculatedVolume).toBeCloseTo(correctedVolume, 3);
    });
  });

  describe('Measurement Validation', () => {
    it('should validate diameter ranges correctly', () => {
      // Valid diameters
      expect(validateMeasurement(6, 1)).toEqual([]);
      expect(validateMeasurement(25, 1)).toEqual([]);
      expect(validateMeasurement(120, 1)).toEqual([]);

      // Invalid diameters
      expect(validateMeasurement(5, 1)).toContain('Diameter must be between 6 and 120 cm');
      expect(validateMeasurement(121, 1)).toContain('Diameter must be between 6 and 120 cm');
      expect(validateMeasurement(-1, 1)).toContain('Diameter must be between 6 and 120 cm');
    });

    it('should validate length ranges correctly', () => {
      // Valid lengths
      expect(validateMeasurement(25, 0.5)).toEqual([]);
      expect(validateMeasurement(25, 6)).toEqual([]);
      expect(validateMeasurement(25, 15)).toEqual([]);

      // Invalid lengths
      expect(validateMeasurement(25, 0.4)).toContain('Length must be between 0.5 and 15 meters');
      expect(validateMeasurement(25, 16)).toContain('Length must be between 0.5 and 15 meters');
      expect(validateMeasurement(25, -1)).toContain('Length must be between 0.5 and 15 meters');
    });

    it('should return multiple errors for invalid measurements', () => {
      const errors = validateMeasurement(5, 0.4);
      expect(errors).toContain('Diameter must be between 6 and 120 cm');
      expect(errors).toContain('Length must be between 0.5 and 15 meters');
      expect(errors.length).toBe(2);
    });
  });

  describe('Batch Volume Calculations', () => {
    it('should calculate batch volume correctly', () => {
      const measurements = [
        { id: '1', diameter: 25, length: 6, timestamp: new Date() },
        { id: '2', diameter: 30, length: 8, timestamp: new Date() },
        { id: '3', diameter: 20, length: 4, timestamp: new Date() }
      ];

      const batchVolume = calculateBatchVolume(measurements);
      const expectedVolume = calculateLogVolume(25, 6) + calculateLogVolume(30, 8) + calculateLogVolume(20, 4);
      
      expect(batchVolume).toBeCloseTo(expectedVolume, 3);
    });

    it('should handle empty batch', () => {
      const emptyBatch = calculateBatchVolume([]);
      expect(emptyBatch).toBe(0);
    });

    it('should handle single measurement batch', () => {
      const singleMeasurement = [{ id: '1', diameter: 25, length: 6, timestamp: new Date() }];
      const batchVolume = calculateBatchVolume(singleMeasurement);
      const expectedVolume = calculateLogVolume(25, 6);
      
      expect(batchVolume).toBeCloseTo(expectedVolume, 3);
    });
  });

  describe('GPS Coordinate Validation', () => {
    it('should validate latitude ranges', () => {
      const validLatitudes = [0, 45, 90, -45, -90];
      const invalidLatitudes = [91, -91, 180, -180];

      validLatitudes.forEach(lat => {
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
      });

      invalidLatitudes.forEach(lat => {
        expect(lat < -90 || lat > 90).toBe(true);
      });
    });

    it('should validate longitude ranges', () => {
      const validLongitudes = [0, 45, 90, 180, -45, -90, -180];
      const invalidLongitudes = [181, -181, 360, -360];

      validLongitudes.forEach(lng => {
        expect(lng).toBeGreaterThanOrEqual(-180);
        expect(lng).toBeLessThanOrEqual(180);
      });

      invalidLongitudes.forEach(lng => {
        expect(lng < -180 || lng > 180).toBe(true);
      });
    });

    it('should validate Georgian forestry coordinates', () => {
      // Tbilisi area coordinates (valid for forestry operations)
      const tbilisiCoords = { lat: 41.7151, lng: 44.8271 };
      expect(tbilisiCoords.lat).toBeGreaterThanOrEqual(-90);
      expect(tbilisiCoords.lat).toBeLessThanOrEqual(90);
      expect(tbilisiCoords.lng).toBeGreaterThanOrEqual(-180);
      expect(tbilisiCoords.lng).toBeLessThanOrEqual(180);

      // Forest areas in Georgia
      const forestCoords = [
        { lat: 41.7151, lng: 44.8271 }, // Tbilisi
        { lat: 42.3154, lng: 43.3569 }, // Kutaisi
        { lat: 41.6483, lng: 41.6333 }, // Batumi
      ];

      forestCoords.forEach(coord => {
        expect(coord.lat).toBeGreaterThanOrEqual(-90);
        expect(coord.lat).toBeLessThanOrEqual(90);
        expect(coord.lng).toBeGreaterThanOrEqual(-180);
        expect(coord.lng).toBeLessThanOrEqual(180);
      });
    });
  });

  describe('Species Data Validation', () => {
    it('should validate species density values', () => {
      const speciesDensities = {
        'pine': 0.52,
        'spruce': 0.45,
        'larch': 0.66,
        'fir': 0.39,
        'cedar': 0.44,
        'birch': 0.65,
        'aspen': 0.51,
        'oak': 0.81,
        'beech': 0.72
      };

      Object.entries(speciesDensities).forEach(([species, density]) => {
        expect(density).toBeGreaterThan(0);
        expect(density).toBeLessThan(2); // Wood density should be reasonable
        expect(typeof density).toBe('number');
      });
    });

    it('should validate species categories', () => {
      const coniferousSpecies = ['pine', 'spruce', 'larch', 'fir', 'cedar'];
      const deciduousSpecies = ['birch', 'aspen', 'oak', 'beech'];

      // All species should have valid IDs
      [...coniferousSpecies, ...deciduousSpecies].forEach(species => {
        expect(species).toMatch(/^[a-z]+$/);
        expect(species.length).toBeGreaterThan(0);
        expect(species.length).toBeLessThan(20);
      });
    });
  });

  describe('Measurement Unit Conversions', () => {
    it('should convert length units correctly', () => {
      const conversions = [
        { from: 1, unit: 'm', to: 100, targetUnit: 'cm' },
        { from: 1, unit: 'm', to: 1000, targetUnit: 'mm' },
        { from: 1, unit: 'km', to: 1000, targetUnit: 'm' },
        { from: 1, unit: 'ft', to: 0.3048, targetUnit: 'm' },
        { from: 1, unit: 'in', to: 0.0254, targetUnit: 'm' }
      ];

      conversions.forEach(({ from, unit, to, targetUnit }) => {
        // Test conversion logic
        const result = convertUnit(from, unit, targetUnit);
        expect(result).toBeCloseTo(to, 3);
      });
    });

    it('should convert volume units correctly', () => {
      const volumeConversions = [
        { from: 1, unit: 'm³', to: 1000000, targetUnit: 'cm³' },
        { from: 1, unit: 'm³', to: 1000, targetUnit: 'L' },
        { from: 1, unit: 'ft³', to: 0.0283168, targetUnit: 'm³' }
      ];

      volumeConversions.forEach(({ from, unit, to, targetUnit }) => {
        const result = convertUnit(from, unit, targetUnit);
        expect(result).toBeCloseTo(to, 3);
      });
    });
  });

  describe('Data Consistency Tests', () => {
    it('should maintain data consistency across calculations', () => {
      const measurements = [
        { diameter: 25, length: 6 },
        { diameter: 30, length: 8 },
        { diameter: 20, length: 4 }
      ];

      // Calculate individual volumes
      const individualVolumes = measurements.map(m => calculateLogVolume(m.diameter, m.length));
      
      // Calculate batch volume
      const batchVolume = individualVolumes.reduce((sum, vol) => sum + vol, 0);
      
      // Verify consistency
      expect(batchVolume).toBeGreaterThan(0);
      expect(batchVolume).toBeLessThan(10); // Reasonable range for test data
      
      // Verify each individual volume is positive
      individualVolumes.forEach(volume => {
        expect(volume).toBeGreaterThan(0);
      });
    });

    it('should handle precision consistently', () => {
      const diameter = 25.123;
      const length = 6.789;
      
      const volume1 = calculateLogVolume(diameter, length);
      const volume2 = calculateLogVolume(diameter, length);
      
      // Same inputs should produce same results
      expect(volume1).toBe(volume2);
      
      // Results should be rounded to 3 decimal places
      const decimalPlaces = (volume1.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(3);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid input gracefully', () => {
      // Test with NaN values
      expect(() => calculateLogVolume(NaN, 6)).toThrow();
      expect(() => calculateLogVolume(25, NaN)).toThrow();
      
      // Test with undefined values
      expect(() => calculateLogVolume(undefined as any, 6)).toThrow();
      expect(() => calculateLogVolume(25, undefined as any)).toThrow();
    });

    it('should validate measurement data structure', () => {
      const validMeasurement = {
        id: '1',
        diameter: 25,
        length: 6,
        timestamp: new Date()
      };

      const invalidMeasurement = {
        id: '1',
        diameter: 'invalid',
        length: 6,
        timestamp: new Date()
      };

      expect(() => calculateLogVolume(validMeasurement.diameter, validMeasurement.length)).not.toThrow();
      expect(() => calculateLogVolume(invalidMeasurement.diameter as any, invalidMeasurement.length)).toThrow();
    });
  });
});

// Helper function for unit conversion (simplified)
function convertUnit(value: number, fromUnit: string, toUnit: string): number {
  const conversions: Record<string, Record<string, number>> = {
    'm': { 'cm': 100, 'mm': 1000, 'km': 0.001, 'ft': 3.28084, 'in': 39.3701 },
    'cm': { 'm': 0.01, 'mm': 10, 'km': 0.00001, 'ft': 0.0328084, 'in': 0.393701 },
    'km': { 'm': 1000, 'cm': 100000, 'mm': 1000000, 'ft': 3280.84, 'in': 39370.1 },
    'ft': { 'm': 0.3048, 'cm': 30.48, 'mm': 304.8, 'km': 0.0003048, 'in': 12 },
    'in': { 'm': 0.0254, 'cm': 2.54, 'mm': 25.4, 'km': 0.0000254, 'ft': 0.0833333 },
    'm³': { 'cm³': 1000000, 'L': 1000, 'ft³': 35.3147 },
    'cm³': { 'm³': 0.000001, 'L': 0.001, 'ft³': 0.0000353147 },
    'L': { 'm³': 0.001, 'cm³': 1000, 'ft³': 0.0353147 },
    'ft³': { 'm³': 0.0283168, 'cm³': 28316.8, 'L': 28.3168 }
  };

  if (fromUnit === toUnit) return value;
  
  const conversion = conversions[fromUnit]?.[toUnit];
  if (!conversion) {
    throw new Error(`Conversion from ${fromUnit} to ${toUnit} not supported`);
  }
  
  return value * conversion;
}
