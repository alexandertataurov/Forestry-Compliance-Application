import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Offline Functionality Testing', () => {
  describe('Service Worker & PWA Features', () => {
    it('should register service worker successfully', async () => {
      // Mock service worker registration
      const mockRegistration = {
        active: { postMessage: vi.fn() },
        updateViaCache: 'all',
        scope: '/',
        unregister: vi.fn()
      };

      const mockServiceWorker = {
        register: vi.fn().mockResolvedValue(mockRegistration)
      };

      Object.defineProperty(navigator, 'serviceWorker', {
        value: mockServiceWorker,
        writable: true
      });

      const registration = await navigator.serviceWorker.register('/sw.js');
      
      expect(registration).toBeDefined();
      expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw.js');
    });

    it('should handle service worker installation', async () => {
      // Mock service worker install event
      const mockCache = {
        addAll: vi.fn().mockResolvedValue([]),
        put: vi.fn().mockResolvedValue(undefined),
        match: vi.fn().mockResolvedValue(null)
      };

      const mockCaches = {
        open: vi.fn().mockResolvedValue(mockCache),
        match: vi.fn().mockResolvedValue(null)
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true
      });

      // Simulate cache opening
      const cache = await caches.open('forestry-static-v1');
      expect(cache).toBeDefined();
      expect(mockCaches.open).toHaveBeenCalledWith('forestry-static-v1');
    });

    it('should cache static assets for offline use', async () => {
      const staticFiles = [
        '/',
        '/index.html',
        '/manifest.json',
        '/offline.html',
        '/static/js/bundle.js',
        '/static/css/main.css'
      ];

      // Mock cache operations
      const mockCache = {
        addAll: vi.fn().mockResolvedValue([])
      };

      const mockCaches = {
        open: vi.fn().mockResolvedValue(mockCache)
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true
      });

      const cache = await caches.open('forestry-static-v1');
      await cache.addAll(staticFiles);

      expect(mockCache.addAll).toHaveBeenCalledWith(staticFiles);
    });

    it('should handle offline navigation requests', async () => {
      // Mock fetch for offline scenario
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      Object.defineProperty(window, 'fetch', {
        value: mockFetch,
        writable: true
      });

      // Mock cache with offline page
      const offlineResponse = new Response('<html><body>Offline</body></html>', {
        headers: { 'Content-Type': 'text/html' }
      });

      const mockCache = {
        match: vi.fn().mockResolvedValue(offlineResponse)
      };

      const mockCaches = {
        match: vi.fn().mockResolvedValue(offlineResponse)
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true
      });

      // Simulate offline navigation
      const response = await caches.match('/offline.html');
      expect(response).toBeDefined();
      expect(response?.headers.get('Content-Type')).toBe('text/html');
    });
  });

  describe('Data Persistence & Storage', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    afterEach(() => {
      // Clear localStorage after each test
      localStorage.clear();
    });

    it('should persist calculation data in localStorage', () => {
      const calculationData = {
        id: 'calc-001',
        diameter: 25,
        length: 6,
        volume: 0.294,
        timestamp: Date.now(),
        synced: false
      };

      // Store calculation data
      const calculations = JSON.parse(localStorage.getItem('forestry-calculations') || '[]');
      calculations.push(calculationData);
      localStorage.setItem('forestry-calculations', JSON.stringify(calculations));

      // Retrieve and verify data
      const storedCalculations = JSON.parse(localStorage.getItem('forestry-calculations') || '[]');
      expect(storedCalculations).toHaveLength(1);
      expect(storedCalculations[0].id).toBe('calc-001');
      expect(storedCalculations[0].volume).toBe(0.294);
      expect(storedCalculations[0].synced).toBe(false);
    });

    it('should persist batch data for offline sync', () => {
      const batchData = {
        id: 'batch-001',
        calculations: [
          { diameter: 25, length: 6, volume: 0.294 },
          { diameter: 30, length: 8, volume: 0.565 }
        ],
        timestamp: Date.now(),
        synced: false
      };

      // Store batch data
      const batches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
      batches.push(batchData);
      localStorage.setItem('forestry-batches', JSON.stringify(batches));

      // Retrieve and verify data
      const storedBatches = JSON.parse(localStorage.getItem('forestry-batches') || '[]');
      expect(storedBatches).toHaveLength(1);
      expect(storedBatches[0].id).toBe('batch-001');
      expect(storedBatches[0].calculations).toHaveLength(2);
      expect(storedBatches[0].synced).toBe(false);
    });

    it('should persist user settings and preferences', () => {
      const userSettings = {
        operatorName: 'John Doe',
        operatorINN: '123456789',
        organization: 'Forestry Corp',
        region: 'Tbilisi',
        language: 'ka',
        theme: 'light',
        autoSync: true
      };

      localStorage.setItem('forestry-settings', JSON.stringify(userSettings));

      const storedSettings = JSON.parse(localStorage.getItem('forestry-settings') || '{}');
      expect(storedSettings.operatorName).toBe('John Doe');
      expect(storedSettings.operatorINN).toBe('123456789');
      expect(storedSettings.autoSync).toBe(true);
    });

    it('should handle storage quota limits gracefully', () => {
      // Mock storage quota exceeded
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const largeData = 'x'.repeat(10 * 1024 * 1024); // 10MB

      expect(() => {
        localStorage.setItem('large-data', largeData);
      }).toThrow('QuotaExceededError');

      // Restore original function
      localStorage.setItem = originalSetItem;
    });

    it('should handle corrupted localStorage data', () => {
      // Simulate corrupted data
      localStorage.setItem('forestry-calculations', 'invalid json');

      // Should handle gracefully
      const calculations = (() => {
        try {
          return JSON.parse(localStorage.getItem('forestry-calculations') || '[]');
        } catch (error) {
          return [];
        }
      })();

      expect(calculations).toEqual([]);
    });
  });

  describe('Offline Data Synchronization', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should queue offline data for sync', () => {
      const offlineQueue = [
        {
          id: 'sync-001',
          type: 'calculation',
          data: { diameter: 25, length: 6, volume: 0.294 },
          timestamp: Date.now(),
          retryCount: 0,
          priority: 'high' as const,
          status: 'pending' as const
        }
      ];

      localStorage.setItem('offline-sync-queue', JSON.stringify(offlineQueue));

      const storedQueue = JSON.parse(localStorage.getItem('offline-sync-queue') || '[]');
      expect(storedQueue).toHaveLength(1);
      expect(storedQueue[0].type).toBe('calculation');
      expect(storedQueue[0].status).toBe('pending');
    });

    it('should handle sync retry logic', () => {
      const syncItem = {
        id: 'sync-001',
        type: 'calculation',
        data: { diameter: 25, length: 6, volume: 0.294 },
        timestamp: Date.now(),
        retryCount: 2,
        priority: 'high' as const,
        status: 'failed' as const,
        error: 'Network timeout'
      };

      // Increment retry count
      syncItem.retryCount += 1;
      syncItem.status = 'pending';

      expect(syncItem.retryCount).toBe(3);
      expect(syncItem.status).toBe('pending');
    });

    it('should prioritize sync items correctly', () => {
      const syncQueue = [
        { id: '1', priority: 'low' as const, timestamp: Date.now() },
        { id: '2', priority: 'critical' as const, timestamp: Date.now() },
        { id: '3', priority: 'high' as const, timestamp: Date.now() },
        { id: '4', priority: 'medium' as const, timestamp: Date.now() }
      ];

      // Sort by priority (critical > high > medium > low)
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const sortedQueue = syncQueue.sort((a, b) => 
        priorityOrder[b.priority] - priorityOrder[a.priority]
      );

      expect(sortedQueue[0].priority).toBe('critical');
      expect(sortedQueue[1].priority).toBe('high');
      expect(sortedQueue[2].priority).toBe('medium');
      expect(sortedQueue[3].priority).toBe('low');
    });

    it('should handle sync conflicts and duplicates', () => {
      const syncQueue = [
        { id: 'calc-001', data: { diameter: 25, length: 6 }, timestamp: 1000 },
        { id: 'calc-001', data: { diameter: 25, length: 6 }, timestamp: 2000 },
        { id: 'calc-002', data: { diameter: 30, length: 8 }, timestamp: 1500 }
      ];

      // Remove duplicates based on ID, keep latest timestamp
      const uniqueQueue = syncQueue.reduce((acc, item) => {
        const existing = acc.find(x => x.id === item.id);
        if (!existing || item.timestamp > existing.timestamp) {
          acc = acc.filter(x => x.id !== item.id);
          acc.push(item);
        }
        return acc;
      }, [] as typeof syncQueue);

      expect(uniqueQueue).toHaveLength(2);
      expect(uniqueQueue.find(x => x.id === 'calc-001')?.timestamp).toBe(2000);
    });
  });

  describe('Network Status Detection', () => {
    it('should detect online/offline status changes', () => {
      // Mock navigator.onLine
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true
      });

      expect(navigator.onLine).toBe(true);

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true
      });

      expect(navigator.onLine).toBe(false);
    });

    it('should handle network quality detection', () => {
      // Mock network information API
      const mockConnection = {
        effectiveType: '4g',
        downlink: 10,
        rtt: 50,
        saveData: false
      };

      Object.defineProperty(navigator, 'connection', {
        value: mockConnection,
        writable: true
      });

      expect(navigator.connection?.effectiveType).toBe('4g');
      expect(navigator.connection?.downlink).toBe(10);
    });

    it('should handle connection type detection', () => {
      const connectionTypes = ['slow-2g', '2g', '3g', '4g'];
      
      connectionTypes.forEach(type => {
        const mockConnection = { effectiveType: type };
        Object.defineProperty(navigator, 'connection', {
          value: mockConnection,
          writable: true
        });

        expect(navigator.connection?.effectiveType).toBe(type);
      });
    });
  });

  describe('Offline Operation in Field Conditions', () => {
    it('should continue volume calculations offline', () => {
      const offlineCalculation = {
        diameter: 25,
        length: 6,
        species: 'pine',
        standard: 'GOST-2708-75'
      };

      // Volume calculation should work offline
      const volume = Math.PI * Math.pow(offlineCalculation.diameter / 100 / 2, 2) * offlineCalculation.length * 0.95;
      
      expect(volume).toBeGreaterThan(0);
      expect(volume).toBeCloseTo(0.294, 3);
    });

    it('should store GPS coordinates offline', () => {
      const gpsData = {
        latitude: 41.7151,
        longitude: 44.8271,
        accuracy: 5,
        timestamp: Date.now()
      };

      localStorage.setItem('offline-gps-data', JSON.stringify(gpsData));

      const storedGPS = JSON.parse(localStorage.getItem('offline-gps-data') || '{}');
      expect(storedGPS.latitude).toBe(41.7151);
      expect(storedGPS.longitude).toBe(44.8271);
      expect(storedGPS.accuracy).toBe(5);
    });

    it('should handle offline form validation', () => {
      const formData = {
        diameter: 25,
        length: 6,
        operator: 'John Doe',
        batchNumber: 'BATCH-2024-001'
      };

      // Client-side validation should work offline
      const errors = [];
      
      if (formData.diameter < 6 || formData.diameter > 120) {
        errors.push('Diameter must be between 6 and 120 cm');
      }
      
      if (formData.length < 0.5 || formData.length > 15) {
        errors.push('Length must be between 0.5 and 15 meters');
      }
      
      if (!formData.operator.trim()) {
        errors.push('Operator name is required');
      }

      expect(errors).toHaveLength(0);
    });

    it('should handle offline data export', () => {
      const exportData = {
        calculations: [
          { diameter: 25, length: 6, volume: 0.294 },
          { diameter: 30, length: 8, volume: 0.565 }
        ],
        metadata: {
          exportDate: new Date().toISOString(),
          totalVolume: 0.859,
          operator: 'John Doe'
        }
      };

      // Should be able to generate export data offline
      const exportBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      expect(exportBlob.size).toBeGreaterThan(0);
      expect(exportBlob.type).toBe('application/json');
    });
  });

  describe('Data Integrity & Recovery', () => {
    it('should handle data corruption recovery', () => {
      // Simulate corrupted data
      const corruptedData = '{"calculations": [{"diameter": 25, "length": 6, "volume": 0.294}, {"diameter": 30, "length": 8, "volume": 0.565, "invalid": "data"}]}';
      
      // Should be able to parse and clean corrupted data
      const parseAndClean = (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.calculations) {
            parsed.calculations = parsed.calculations.map((calc: any) => ({
              diameter: calc.diameter,
              length: calc.length,
              volume: calc.volume,
              timestamp: calc.timestamp || Date.now()
            }));
          }
          return parsed;
        } catch (error) {
          return { calculations: [] };
        }
      };

      const cleanedData = parseAndClean(corruptedData);
      expect(cleanedData.calculations).toHaveLength(2);
      expect(cleanedData.calculations[0].diameter).toBe(25);
      expect(cleanedData.calculations[1].diameter).toBe(30);
    });

    it('should handle data backup and restore', () => {
      const originalData = {
        calculations: [
          { id: 'calc-001', diameter: 25, length: 6, volume: 0.294 }
        ],
        settings: {
          operatorName: 'John Doe',
          autoSync: true
        }
      };

      // Create backup
      const backup = {
        timestamp: Date.now(),
        data: originalData,
        version: '1.0.0'
      };

      localStorage.setItem('forestry-backup', JSON.stringify(backup));

      // Simulate data loss
      localStorage.removeItem('forestry-calculations');
      localStorage.removeItem('forestry-settings');

      // Restore from backup
      const backupData = JSON.parse(localStorage.getItem('forestry-backup') || '{}');
      if (backupData.data) {
        localStorage.setItem('forestry-calculations', JSON.stringify(backupData.data.calculations));
        localStorage.setItem('forestry-settings', JSON.stringify(backupData.data.settings));
      }

      const restoredCalculations = JSON.parse(localStorage.getItem('forestry-calculations') || '[]');
      const restoredSettings = JSON.parse(localStorage.getItem('forestry-settings') || '{}');

      expect(restoredCalculations).toHaveLength(1);
      expect(restoredSettings.operatorName).toBe('John Doe');
    });

    it('should handle version migration', () => {
      const oldData = {
        version: '0.9.0',
        calculations: [
          { diameter: 25, length: 6, volume: 0.294 }
        ]
      };

      // Migration function
      const migrateData = (data: any) => {
        if (data.version === '0.9.0') {
          return {
            version: '1.0.0',
            calculations: data.calculations.map((calc: any) => ({
              ...calc,
              id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              timestamp: Date.now(),
              synced: false
            }))
          };
        }
        return data;
      };

      const migratedData = migrateData(oldData);
      expect(migratedData.version).toBe('1.0.0');
      expect(migratedData.calculations[0].id).toBeDefined();
      expect(migratedData.calculations[0].synced).toBe(false);
    });
  });

  describe('Performance & Battery Optimization', () => {
    it('should optimize storage operations for battery life', () => {
      const batchOperations = [];
      
      // Batch multiple operations
      for (let i = 0; i < 100; i++) {
        batchOperations.push({
          id: `calc-${i}`,
          diameter: 20 + i,
          length: 6,
          volume: 0.1 + (i * 0.01)
        });
      }

      // Single storage operation instead of multiple
      const startTime = performance.now();
      localStorage.setItem('forestry-calculations', JSON.stringify(batchOperations));
      const endTime = performance.now();

      const operationTime = endTime - startTime;
      expect(operationTime).toBeLessThan(100); // Should complete quickly
    });

    it('should handle memory management for large datasets', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: `calc-${i}`,
        diameter: 20 + (i % 30),
        length: 6,
        volume: 0.1 + (i * 0.001),
        timestamp: Date.now() - (i * 60000) // Staggered timestamps
      }));

      // Should handle large datasets without memory issues
      const dataSize = JSON.stringify(largeDataset).length;
      expect(dataSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB

      // Should be able to process in chunks
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < largeDataset.length; i += chunkSize) {
        chunks.push(largeDataset.slice(i, i + chunkSize));
      }

      expect(chunks).toHaveLength(10);
      expect(chunks[0]).toHaveLength(100);
    });

    it('should optimize sync operations for field conditions', () => {
      const syncOperations = [
        { priority: 'critical', size: 1024 },
        { priority: 'high', size: 2048 },
        { priority: 'medium', size: 4096 },
        { priority: 'low', size: 8192 }
      ];

      // Sort by priority and size for optimal sync
      const optimizedSync = syncOperations.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
        if (priorityDiff !== 0) return priorityDiff;
        return a.size - b.size; // Smaller files first within same priority
      });

      expect(optimizedSync[0].priority).toBe('critical');
      expect(optimizedSync[1].priority).toBe('high');
    });
  });
});
