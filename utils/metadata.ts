// Metadata capture utilities for field operations

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  timestamp: Date;
}

export interface OperationalMetadata {
  timestamp: Date;
  location?: LocationData;
  weather?: {
    temperature?: number;
    humidity?: number;
    conditions?: string;
  };
  operator: string;
  equipment?: string;
  notes?: string;
}

/**
 * Get current GPS location
 */
export async function getCurrentLocation(): Promise<LocationData | null> {
  if (!navigator.geolocation) {
    return null;
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude || undefined,
          timestamp: new Date(),
        });
      },
      (error) => {
        console.warn('Location access denied:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`;
}

/**
 * Check if location data is recent (within 5 minutes)
 */
export function isLocationRecent(timestamp: Date): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return timestamp > fiveMinutesAgo;
}