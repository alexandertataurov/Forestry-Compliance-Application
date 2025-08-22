// Performance monitoring and load testing utilities
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  tti: number; // Time to Interactive
  tbt: number; // Total Blocking Time
}

export interface LoadTestResult {
  timestamp: number;
  duration: number;
  requests: number;
  errors: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  throughput: number;
  concurrentUsers: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {} as PerformanceMetrics;
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  init(): void {
    if (this.isInitialized) return;

    this.setupPerformanceObservers();
    this.setupResourceTiming();
    this.setupUserTiming();
    
    this.isInitialized = true;
  }

  private setupPerformanceObservers(): void {
    if ('PerformanceObserver' in window) {
      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.fid = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Observe layout shifts
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(paintObserver, lcpObserver, fidObserver, clsObserver);
    }
  }

  private setupResourceTiming(): void {
    // Monitor resource loading performance
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          this.trackResourcePerformance(resourceEntry);
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private setupUserTiming(): void {
    // Monitor custom user timing marks
    if ('PerformanceObserver' in window) {
      const userTimingObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackUserTiming(entry);
        }
      });
      userTimingObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(userTimingObserver);
    }
  }

  private trackResourcePerformance(entry: PerformanceResourceTiming): void {
    const resourceMetrics = {
      name: entry.name,
      duration: entry.duration,
      transferSize: entry.transferSize,
      decodedBodySize: entry.decodedBodySize,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      responseEnd: entry.responseEnd
    };

    // Send to analytics
    this.sendPerformanceData('resource_timing', resourceMetrics);
  }

  private trackUserTiming(entry: PerformanceEntry): void {
    const userMetrics = {
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime
    };

    // Send to analytics
    this.sendPerformanceData('user_timing', userMetrics);
  }

  private sendPerformanceData(type: string, data: any): void {
    // Send to analytics service
    fetch('/api/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        data,
        timestamp: Date.now(),
        url: window.location.href
      }),
    }).catch(error => {
      console.warn('Failed to send performance data:', error);
    });
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Load testing utilities
  async runLoadTest(
    url: string,
    concurrentUsers: number = 10,
    duration: number = 60000, // 1 minute
    requestsPerSecond: number = 10
  ): Promise<LoadTestResult> {
    const startTime = Date.now();
    const endTime = startTime + duration;
    const results: number[] = [];
    const errors: number[] = [];
    let totalRequests = 0;

    const makeRequest = async (): Promise<void> => {
      const requestStart = Date.now();
      try {
        const response = await fetch(url);
        const requestEnd = Date.now();
        
        if (response.ok) {
          results.push(requestEnd - requestStart);
        } else {
          errors.push(requestEnd - requestStart);
        }
        totalRequests++;
      } catch (error) {
        errors.push(Date.now() - requestStart);
        totalRequests++;
      }
    };

    // Create concurrent users
    const userPromises: Promise<void>[] = [];
    for (let i = 0; i < concurrentUsers; i++) {
      const userPromise = (async () => {
        while (Date.now() < endTime) {
          await makeRequest();
          await new Promise(resolve => setTimeout(resolve, 1000 / requestsPerSecond));
        }
      })();
      userPromises.push(userPromise);
    }

    // Wait for all users to complete
    await Promise.all(userPromises);

    const testDuration = Date.now() - startTime;
    const successfulRequests = results.length;
    const failedRequests = errors.length;
    const avgResponseTime = successfulRequests > 0 ? results.reduce((a, b) => a + b, 0) / successfulRequests : 0;
    
    // Calculate percentiles
    const sortedResults = results.sort((a, b) => a - b);
    const p95Index = Math.floor(sortedResults.length * 0.95);
    const p99Index = Math.floor(sortedResults.length * 0.99);
    const p95ResponseTime = sortedResults[p95Index] || 0;
    const p99ResponseTime = sortedResults[p99Index] || 0;

    const throughput = (successfulRequests / testDuration) * 1000; // requests per second

    return {
      timestamp: startTime,
      duration: testDuration,
      requests: totalRequests,
      errors: failedRequests,
      avgResponseTime,
      p95ResponseTime,
      p99ResponseTime,
      throughput,
      concurrentUsers
    };
  }

  // Stress testing
  async runStressTest(
    url: string,
    maxConcurrentUsers: number = 100,
    stepDuration: number = 30000, // 30 seconds per step
    stepIncrease: number = 10
  ): Promise<LoadTestResult[]> {
    const results: LoadTestResult[] = [];
    
    for (let users = stepIncrease; users <= maxConcurrentUsers; users += stepIncrease) {
      console.log(`Running stress test with ${users} concurrent users...`);
      const result = await this.runLoadTest(url, users, stepDuration, 5);
      results.push(result);
      
      // Check if system is still responsive
      if (result.errors / result.requests > 0.1) { // More than 10% errors
        console.log(`System breaking point reached at ${users} users`);
        break;
      }
    }

    return results;
  }

  // Performance benchmarking
  async benchmarkOperation(operation: () => Promise<any>, iterations: number = 100): Promise<{
    avgTime: number;
    minTime: number;
    maxTime: number;
    p95Time: number;
    p99Time: number;
    totalTime: number;
  }> {
    const times: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await operation();
      const end = performance.now();
      times.push(end - start);
    }

    const sortedTimes = times.sort((a, b) => a - b);
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    const minTime = sortedTimes[0];
    const maxTime = sortedTimes[sortedTimes.length - 1];
    const p95Index = Math.floor(sortedTimes.length * 0.95);
    const p99Index = Math.floor(sortedTimes.length * 0.99);
    const p95Time = sortedTimes[p95Index];
    const p99Time = sortedTimes[p99Index];
    const totalTime = times.reduce((a, b) => a + b, 0);

    return {
      avgTime,
      minTime,
      maxTime,
      p95Time,
      p99Time,
      totalTime
    };
  }

  // Memory usage monitoring
  getMemoryUsage(): {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit
      };
    }
    return null;
  }

  // Network conditions simulation
  simulateNetworkConditions(
    latency: number = 100,
    bandwidth: number = 1000,
    packetLoss: number = 0
  ): void {
    // This would integrate with browser dev tools or network throttling
    console.log(`Simulating network: ${latency}ms latency, ${bandwidth}kbps bandwidth, ${packetLoss}% packet loss`);
  }

  // Cleanup
  dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  performanceMonitor.init();
}
