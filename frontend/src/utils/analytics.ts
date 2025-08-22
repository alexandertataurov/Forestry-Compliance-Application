// Analytics utility for monitoring and tracking
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

class Analytics {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  init(): void {
    if (this.isInitialized) return;
    
    // Initialize performance monitoring
    this.initPerformanceMonitoring();
    
    // Initialize error tracking
    this.initErrorTracking();
    
    // Initialize user interaction tracking
    this.initInteractionTracking();
    
    this.isInitialized = true;
    this.track('analytics_initialized', 'system', 'init');
  }

  private initPerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceMetric(entry);
        }
      });

      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    }

    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.trackPerformanceMetric({
          name: 'page_load',
          startTime: navigation.loadEventEnd - navigation.loadEventStart,
          entryType: 'measure'
        });
      }
    });
  }

  private initErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.track('error', 'system', 'js_error', event.message, undefined, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.track('error', 'system', 'unhandled_promise', event.reason?.message || 'Unknown promise rejection');
    });
  }

  private initInteractionTracking(): void {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submit', 'interaction', 'submit', form.id || form.className);
    });

    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button') as HTMLButtonElement;
        this.track('button_click', 'interaction', 'click', button.textContent?.trim() || button.id);
      }
    });
  }

  private trackPerformanceMetric(entry: PerformanceEntry): void {
    const metrics: Partial<PerformanceMetrics> = {};
    
    switch (entry.entryType) {
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime;
        }
        break;
      case 'largest-contentful-paint':
        metrics.lcp = entry.startTime;
        break;
      case 'first-input':
        metrics.fid = (entry as any).processingStart - entry.startTime;
        break;
      case 'layout-shift':
        metrics.cls = (entry as any).value;
        break;
    }

    if (Object.keys(metrics).length > 0) {
      this.track('performance_metric', 'performance', entry.entryType, entry.name, metrics);
    }
  }

  track(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    additionalData?: Record<string, any>
  ): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...additionalData
    };

    this.events.push(analyticsEvent);
    
    // Send to analytics service (Netlify Analytics, Google Analytics, etc.)
    this.sendToAnalyticsService(analyticsEvent);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Send to Netlify Analytics
    if (typeof window !== 'undefined' && (window as any).netlifyAnalytics) {
      (window as any).netlifyAnalytics.track(event.event, {
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value
      });
    }

    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.event, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }

    // Custom analytics endpoint
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch(error => {
      console.warn('Failed to send analytics event:', error);
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  // Forestry-specific tracking methods
  trackForestryOperation(operation: string, location?: string, data?: any): void {
    this.track('forestry_operation', 'forestry', operation, location, undefined, data);
  }

  trackComplianceCheck(checkType: string, status: string, details?: any): void {
    this.track('compliance_check', 'compliance', checkType, status, undefined, details);
  }

  trackDataEntry(field: string, value: any, validationStatus: string): void {
    this.track('data_entry', 'data', 'input', field, undefined, {
      value: value,
      validation: validationStatus
    });
  }

  trackGPSLocation(latitude: number, longitude: number, accuracy: number): void {
    this.track('gps_location', 'location', 'update', 'coordinates', undefined, {
      latitude,
      longitude,
      accuracy
    });
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  analytics.init();
}
