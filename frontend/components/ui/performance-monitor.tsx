import * as React from 'react';
import { useEffect, useState } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  fmp: number | null; // First Meaningful Paint
  tti: number | null; // Time to Interactive
}

// Performance observer hook
const usePerformanceObserver = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fmp: null,
    tti: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }));
      }
    });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setMetrics((prev) => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fidEntry = entries[0];
      if (fidEntry) {
        setMetrics((prev) => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
      }
    });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      setMetrics((prev) => ({ ...prev, cls: clsValue }));
    });

    // Time to First Byte
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      setMetrics((prev) => ({ ...prev, ttfb: navigationEntry.responseStart - navigationEntry.requestStart }));
    }

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics;
};

// Performance score calculator
const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 0;
  let totalWeight = 0;

  // FCP scoring (weight: 10%)
  if (metrics.fcp !== null) {
    const fcpScore = metrics.fcp < 1800 ? 100 : Math.max(0, 100 - ((metrics.fcp - 1800) / 100));
    score += fcpScore * 0.1;
    totalWeight += 0.1;
  }

  // LCP scoring (weight: 25%)
  if (metrics.lcp !== null) {
    const lcpScore = metrics.lcp < 2500 ? 100 : Math.max(0, 100 - ((metrics.lcp - 2500) / 100));
    score += lcpScore * 0.25;
    totalWeight += 0.25;
  }

  // FID scoring (weight: 10%)
  if (metrics.fid !== null) {
    const fidScore = metrics.fid < 100 ? 100 : Math.max(0, 100 - ((metrics.fid - 100) / 10));
    score += fidScore * 0.1;
    totalWeight += 0.1;
  }

  // CLS scoring (weight: 25%)
  if (metrics.cls !== null) {
    const clsScore = metrics.cls < 0.1 ? 100 : Math.max(0, 100 - (metrics.cls * 1000));
    score += clsScore * 0.25;
    totalWeight += 0.25;
  }

  // TTFB scoring (weight: 30%)
  if (metrics.ttfb !== null) {
    const ttfbScore = metrics.ttfb < 800 ? 100 : Math.max(0, 100 - ((metrics.ttfb - 800) / 10));
    score += ttfbScore * 0.3;
    totalWeight += 0.3;
  }

  return totalWeight > 0 ? Math.round(score / totalWeight) : 0;
};

// Performance grade calculator
const getPerformanceGrade = (score: number): { grade: string; color: string } => {
  if (score >= 90) return { grade: 'A', color: 'text-green-500' };
  if (score >= 80) return { grade: 'B', color: 'text-yellow-500' };
  if (score >= 70) return { grade: 'C', color: 'text-orange-500' };
  if (score >= 60) return { grade: 'D', color: 'text-red-500' };
  return { grade: 'F', color: 'text-red-600' };
};

// Performance metric component
const PerformanceMetric: React.FC<{
  label: string;
  value: number | null;
  unit: string;
  threshold: { good: number; needsImprovement: number };
}> = ({ label, value, unit, threshold }) => {
  if (value === null) return null;

  const getStatusColor = () => {
    if (value <= threshold.good) return 'text-green-500';
    if (value <= threshold.needsImprovement) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusIcon = () => {
    if (value <= threshold.good) return '✅';
    if (value <= threshold.needsImprovement) return '⚠️';
    return '❌';
  };

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs">{getStatusIcon()}</span>
      </div>
      <span className={`text-sm font-mono ${getStatusColor()}`}>
        {value.toFixed(2)} {unit}
      </span>
    </div>
  );
};

// Main performance monitor component
export const PerformanceMonitor: React.FC<{
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  className?: string;
}> = ({ showDetails = false, onMetricsUpdate, className = '' }) => {
  const metrics = usePerformanceObserver();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  const performanceScore = calculatePerformanceScore(metrics);
  const { grade, color } = getPerformanceGrade(performanceScore);

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [metrics]);

  // Show when metrics are available
  useEffect(() => {
    if (Object.values(metrics).some((value) => value !== null)) {
      setIsVisible(true);
    }
  }, [metrics]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 bg-white border rounded-lg shadow-lg p-4 max-w-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Performance Score */}
      <div className="mb-3 p-3 bg-gray-50 rounded">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Performance Score</span>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${color}`}>{grade}</span>
            <span className="text-sm text-gray-600">({performanceScore}/100)</span>
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      {showDetails && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Core Web Vitals</h4>
          
          <PerformanceMetric
            label="LCP"
            value={metrics.lcp}
            unit="ms"
            threshold={{ good: 2500, needsImprovement: 4000 }}
          />
          
          <PerformanceMetric
            label="FID"
            value={metrics.fid}
            unit="ms"
            threshold={{ good: 100, needsImprovement: 300 }}
          />
          
          <PerformanceMetric
            label="CLS"
            value={metrics.cls}
            unit=""
            threshold={{ good: 0.1, needsImprovement: 0.25 }}
          />
          
          <PerformanceMetric
            label="FCP"
            value={metrics.fcp}
            unit="ms"
            threshold={{ good: 1800, needsImprovement: 3000 }}
          />
          
          <PerformanceMetric
            label="TTFB"
            value={metrics.ttfb}
            unit="ms"
            threshold={{ good: 800, needsImprovement: 1800 }}
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setIsVisible(!showDetails)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

// Performance hook for external use
export const usePerformance = () => {
  const metrics = usePerformanceObserver();
  const score = calculatePerformanceScore(metrics);
  const grade = getPerformanceGrade(score);

  return {
    metrics,
    score,
    grade,
    isReady: Object.values(metrics).some((value) => value !== null),
  };
};

// Performance logger for analytics
export const logPerformanceMetrics = (metrics: PerformanceMetrics) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metrics', {
      event_category: 'performance',
      event_label: 'core_web_vitals',
      value: calculatePerformanceScore(metrics),
      custom_map: {
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
      },
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group('🚀 Performance Metrics');
    console.log('FCP:', metrics.fcp, 'ms');
    console.log('LCP:', metrics.lcp, 'ms');
    console.log('FID:', metrics.fid, 'ms');
    console.log('CLS:', metrics.cls);
    console.log('TTFB:', metrics.ttfb, 'ms');
    console.log('Score:', calculatePerformanceScore(metrics));
    console.groupEnd();
  }
};

export default PerformanceMonitor;
