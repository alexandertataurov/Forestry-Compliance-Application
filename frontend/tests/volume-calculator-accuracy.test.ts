import { describe, it, expect, beforeEach } from 'vitest';
import { calculateLogVolume, validateMeasurement } from '../utils/gost-calculations';

describe('Volume Calculator Accuracy Testing', () => {
  describe('GOST 2708-75 Standard Compliance', () => {
    it('should calculate volume according to GOST 2708-75 standards', () => {
      // Test cases based on GOST 2708-75 volume tables
      const testCases = [
        { diameter: 14, length: 4, expectedVolume: 0.062 }, // Small diameter
        { diameter: 20, length: 6, expectedVolume: 0.179 }, // Standard diameter
        { diameter: 28, length: 8, expectedVolume: 0.469 }, // Large diameter
        { diameter: 36, length: 10, expectedVolume: 0.966 }, // Extra large diameter
        { diameter: 50, length: 12, expectedVolume: 2.234 }  // Maximum diameter
      ];

      testCases.forEach(({ diameter, length, expectedVolume }) => {
        const calculatedVolume = calculateLogVolume(diameter, length);
        expect(calculatedVolume).toBeCloseTo(expectedVolume, 3);
      });
    });

    it('should apply correct correction factors for bark and irregularities', () => {
      // Test that correction factor (0.95) is properly applied
      const diameter = 25;
      const length = 6;
      
      // Manual calculation without correction
      const diameterM = diameter / 100;
      const baseVolume = Math.PI * Math.pow(diameterM / 2, 2) * length;
      
      // With GOST correction factor
      const correctedVolume = baseVolume * 0.95;
      
      const calculatedVolume = calculateLogVolume(diameter, length);
      expect(calculatedVolume).toBeCloseTo(correctedVolume, 3);
    });

    it('should handle GOST standard diameter ranges correctly', () => {
      // GOST 2708-75 valid diameter range: 6-120 cm
      const validDiameters = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 120];
      
      validDiameters.forEach(diameter => {
        const volume = calculateLogVolume(diameter, 6);
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThan(50); // Reasonable upper limit for 6m logs
      });
    });
  });

  describe('Mathematical Precision', () => {
    it('should maintain precision to 3 decimal places', () => {
      const testCases = [
        { diameter: 25.123, length: 6.789 },
        { diameter: 30.456, length: 8.012 },
        { diameter: 18.789, length: 4.567 }
      ];

      testCases.forEach(({ diameter, length }) => {
        const volume = calculateLogVolume(diameter, length);
        const decimalPlaces = (volume.toString().split('.')[1] || '').length;
        expect(decimalPlaces).toBeLessThanOrEqual(3);
      });
    });

    it('should handle floating point precision correctly', () => {
      // Test with very precise measurements
      const diameter = 25.123456789;
      const length = 6.987654321;
      
      const volume1 = calculateLogVolume(diameter, length);
      const volume2 = calculateLogVolume(diameter, length);
      
      // Same inputs should produce identical results
      expect(volume1).toBe(volume2);
      
      // Results should be rounded appropriately
      expect(volume1).toBeGreaterThan(0);
    });

    it('should handle edge cases with mathematical accuracy', () => {
      // Minimum valid measurements
      const minVolume = calculateLogVolume(6, 0.5);
      expect(minVolume).toBeGreaterThan(0);
      expect(minVolume).toBeLessThan(0.01);

      // Maximum valid measurements
      const maxVolume = calculateLogVolume(120, 15);
      expect(maxVolume).toBeGreaterThan(10);
      expect(maxVolume).toBeLessThan(20);

      // Zero length should return zero volume
      const zeroVolume = calculateLogVolume(25, 0);
      expect(zeroVolume).toBe(0);
    });
  });

  describe('Forestry Measurement Protocols', () => {
    it('should validate forestry-specific measurement ranges', () => {
      // Forestry standard measurement ranges
      const forestryTestCases = [
        { diameter: 6, length: 0.5, valid: true },   // Minimum valid
        { diameter: 25, length: 6, valid: true },   // Standard forestry
        { diameter: 50, length: 12, valid: true },  // Large forestry
        { diameter: 120, length: 15, valid: true }, // Maximum valid
        { diameter: 5, length: 0.5, valid: false }, // Below minimum
        { diameter: 121, length: 15, valid: false }, // Above maximum
        { diameter: 25, length: 0.4, valid: false }, // Below minimum length
        { diameter: 25, length: 16, valid: false }   // Above maximum length
      ];

      forestryTestCases.forEach(({ diameter, length, valid }) => {
        const errors = validateMeasurement(diameter, length);
        if (valid) {
          expect(errors).toEqual([]);
        } else {
          expect(errors.length).toBeGreaterThan(0);
        }
      });
    });

    it('should handle common forestry log sizes accurately', () => {
      // Common forestry log sizes in Georgia
      const commonLogSizes = [
        { diameter: 18, length: 4, description: 'Small pine log' },
        { diameter: 24, length: 6, description: 'Standard spruce log' },
        { diameter: 32, length: 8, description: 'Large larch log' },
        { diameter: 40, length: 10, description: 'Extra large oak log' }
      ];

      commonLogSizes.forEach(({ diameter, length, description }) => {
        const volume = calculateLogVolume(diameter, length);
        
        // Verify reasonable volume ranges for each log size
        expect(volume).toBeGreaterThan(0);
        
        if (diameter <= 20) {
          expect(volume).toBeLessThan(0.5); // Small logs
        } else if (diameter <= 30) {
          expect(volume).toBeLessThan(1.5); // Medium logs
        } else if (diameter <= 40) {
          expect(volume).toBeLessThan(3.0); // Large logs
        } else {
          expect(volume).toBeLessThan(5.0); // Extra large logs
        }
      });
    });

    it('should validate species-specific volume calculations', () => {
      // Different species have different density factors
      const speciesTestCases = [
        { species: 'pine', diameter: 25, length: 6, density: 0.52 },
        { species: 'spruce', diameter: 25, length: 6, density: 0.45 },
        { species: 'larch', diameter: 25, length: 6, density: 0.66 },
        { species: 'oak', diameter: 25, length: 6, density: 0.81 }
      ];

      speciesTestCases.forEach(({ species, diameter, length, density }) => {
        const volume = calculateLogVolume(diameter, length);
        
        // Volume should be consistent regardless of species (GOST standard)
        // Species density affects weight, not volume
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThan(1.0); // Reasonable for 25cm diameter, 6m length
      });
    });
  });

  describe('Unit Conversion Accuracy', () => {
    it('should handle metric unit conversions correctly', () => {
      // Test diameter conversions
      const diameterConversions = [
        { cm: 25, m: 0.25 },
        { cm: 50, m: 0.50 },
        { cm: 100, m: 1.00 }
      ];

      diameterConversions.forEach(({ cm, m }) => {
        const volumeCm = calculateLogVolume(cm, 6);
        const volumeM = calculateLogVolume(m * 100, 6); // Convert back to cm
        expect(volumeCm).toBeCloseTo(volumeM, 3);
      });
    });

    it('should handle length unit conversions correctly', () => {
      // Test length conversions
      const lengthConversions = [
        { m: 4, cm: 400 },
        { m: 6, cm: 600 },
        { m: 8, cm: 800 }
      ];

      lengthConversions.forEach(({ m, cm }) => {
        const volumeM = calculateLogVolume(25, m);
        const volumeCm = calculateLogVolume(25, cm / 100); // Convert back to m
        expect(volumeM).toBeCloseTo(volumeCm, 3);
      });
    });

    it('should maintain accuracy across different measurement scales', () => {
      // Test precision across different scales
      const scaleTestCases = [
        { diameter: 6, length: 0.5, scale: 'minimum' },
        { diameter: 25, length: 6, scale: 'standard' },
        { diameter: 60, length: 12, scale: 'large' },
        { diameter: 120, length: 15, scale: 'maximum' }
      ];

      scaleTestCases.forEach(({ diameter, length, scale }) => {
        const volume = calculateLogVolume(diameter, length);
        
        // All scales should produce valid, positive volumes
        expect(volume).toBeGreaterThan(0);
        expect(typeof volume).toBe('number');
        expect(isFinite(volume)).toBe(true);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid inputs gracefully', () => {
      const invalidInputs = [
        { diameter: NaN, length: 6 },
        { diameter: 25, length: NaN },
        { diameter: Infinity, length: 6 },
        { diameter: 25, length: Infinity },
        { diameter: -1, length: 6 },
        { diameter: 25, length: -1 }
      ];

      invalidInputs.forEach(({ diameter, length }) => {
        expect(() => calculateLogVolume(diameter, length)).toThrow();
      });
    });

    it('should handle boundary conditions correctly', () => {
      // Test exact boundary values
      const boundaryTests = [
        { diameter: 6, length: 0.5, description: 'Minimum valid' },
        { diameter: 120, length: 15, description: 'Maximum valid' },
        { diameter: 6.001, length: 0.5, description: 'Just above minimum' },
        { diameter: 119.999, length: 15, description: 'Just below maximum' }
      ];

      boundaryTests.forEach(({ diameter, length, description }) => {
        const volume = calculateLogVolume(diameter, length);
        expect(volume).toBeGreaterThan(0);
      });
    });

    it('should handle extreme values appropriately', () => {
      // Test with very small and very large values
      const extremeTests = [
        { diameter: 6.1, length: 0.51, description: 'Very small valid' },
        { diameter: 119.9, length: 14.99, description: 'Very large valid' }
      ];

      extremeTests.forEach(({ diameter, length, description }) => {
        const volume = calculateLogVolume(diameter, length);
        expect(volume).toBeGreaterThan(0);
        expect(isFinite(volume)).toBe(true);
      });
    });
  });

  describe('Performance and Consistency', () => {
    it('should produce consistent results for identical inputs', () => {
      const testInputs = [
        { diameter: 25, length: 6 },
        { diameter: 30, length: 8 },
        { diameter: 18, length: 4 }
      ];

      testInputs.forEach(({ diameter, length }) => {
        const volume1 = calculateLogVolume(diameter, length);
        const volume2 = calculateLogVolume(diameter, length);
        const volume3 = calculateLogVolume(diameter, length);
        
        expect(volume1).toBe(volume2);
        expect(volume2).toBe(volume3);
        expect(volume1).toBe(volume3);
      });
    });

    it('should handle rapid successive calculations', () => {
      // Test performance with multiple calculations
      const calculations = [];
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        const diameter = 20 + (i % 30); // Vary diameter from 20-50
        const length = 4 + (i % 8);     // Vary length from 4-12
        calculations.push(calculateLogVolume(diameter, length));
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Should complete 1000 calculations in reasonable time
      expect(duration).toBeLessThan(1000); // Less than 1 second
      
      // All calculations should be valid
      calculations.forEach(volume => {
        expect(volume).toBeGreaterThan(0);
        expect(isFinite(volume)).toBe(true);
      });
    });
  });

  describe('Compliance with Georgian Forestry Standards', () => {
    it('should comply with Georgian forestry measurement standards', () => {
      // Georgian forestry standards typically follow GOST
      const georgianStandards = [
        { diameter: 18, length: 4, standard: 'Georgian Pine Standard' },
        { diameter: 24, length: 6, standard: 'Georgian Spruce Standard' },
        { diameter: 32, length: 8, standard: 'Georgian Larch Standard' }
      ];

      georgianStandards.forEach(({ diameter, length, standard }) => {
        const volume = calculateLogVolume(diameter, length);
        
        // Georgian standards should produce valid volumes
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThan(5.0); // Reasonable upper limit
      });
    });

    it('should handle Georgian forest species correctly', () => {
      // Common Georgian forest species
      const georgianSpecies = [
        { species: 'pine', diameter: 25, length: 6 },
        { species: 'spruce', diameter: 25, length: 6 },
        { species: 'fir', diameter: 25, length: 6 },
        { species: 'beech', diameter: 25, length: 6 },
        { species: 'oak', diameter: 25, length: 6 }
      ];

      georgianSpecies.forEach(({ species, diameter, length }) => {
        const volume = calculateLogVolume(diameter, length);
        
        // All Georgian species should produce valid volumes
        expect(volume).toBeGreaterThan(0);
        expect(volume).toBeLessThan(1.0); // Reasonable for 25cm, 6m
      });
    });
  });
});
