// GOST 2708-75 Round Log Volume Calculations
// Standard for calculating wood volume from round logs

export interface LogMeasurement {
  id: string;
  diameter: number; // cm
  length: number; // m
  timestamp: Date;
  gpsCoordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  operator?: string;
  species?: string;
  quality?: string; // Quality grade (1, 2, 3)
  pricePerCubic?: number; // Price per cubic meter
}

export interface VolumeResult {
  volume: number; // m³
  method: 'GOST-2708-75';
  measurements: LogMeasurement;
}

// GOST 2708-75 volume table coefficients
const GOST_COEFFICIENTS = {
  // Simplified coefficients for demonstration - actual GOST table is more complex
  base: 0.7854, // π/4 for circular cross-section
  lengthFactor: 1.0,
  diameterCorrection: 0.95, // Account for bark and irregularities
};

/**
 * Calculate log volume according to GOST 2708-75
 * @param diameter Diameter at mid-length in cm
 * @param length Length in meters
 * @returns Volume in cubic meters
 */
export function calculateLogVolume(diameter: number, length: number): number {
  // Convert diameter from cm to m
  const diameterM = diameter / 100;
  
  // Basic volume calculation: V = π * (d/2)² * L
  const baseVolume = Math.PI * Math.pow(diameterM / 2, 2) * length;
  
  // Apply GOST correction factors
  const correctedVolume = baseVolume * GOST_COEFFICIENTS.diameterCorrection;
  
  // Round to 3 decimal places
  return Math.round(correctedVolume * 1000) / 1000;
}

/**
 * Calculate total volume for multiple logs
 */
export function calculateBatchVolume(measurements: LogMeasurement[]): number {
  return measurements.reduce((total, log) => {
    return total + calculateLogVolume(log.diameter, log.length);
  }, 0);
}

/**
 * Validate measurement inputs according to GOST standards
 */
export function validateMeasurement(diameter: number, length: number): string[] {
  const errors: string[] = [];
  
  if (diameter < 6 || diameter > 120) {
    errors.push('Diameter must be between 6 and 120 cm');
  }
  
  if (length < 0.5 || length > 15) {
    errors.push('Length must be between 0.5 and 15 meters');
  }
  
  return errors;
}

/**
 * Format volume for display
 */
export function formatVolume(volume: number): string {
  return `${volume.toFixed(3)} m³`;
}