# Build Optimization & Performance Guide

## Overview

This guide covers comprehensive build optimization strategies for the Forestry Compliance Application, ensuring optimal performance, fast loading times, and excellent user experience across all devices.

## 🚀 Build Optimizations

### Vite Configuration Optimizations

#### Code Splitting Strategy
```typescript
// Optimized chunk splitting in vite.config.ts
manualChunks: {
  // React core
  'react-vendor': ['react', 'react-dom'],
  
  // UI components
  'radix-vendor': [
    '@radix-ui/react-accordion',
    '@radix-ui/react-alert-dialog',
    // ... all Radix UI components
  ],
  
  // Charts and data visualization
  'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
  
  // Form handling
  'form-vendor': ['react-hook-form', 'zod'],
  
  // Utility libraries
  'ui-vendor': [
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react',
  ],
  
  // Additional utilities
  'utils-vendor': ['cmdk', 'embla-carousel-react', 'vaul'],
}
```

#### Asset Optimization
```typescript
// Optimized asset naming and organization
assetFileNames: (assetInfo) => {
  if (/\.(css)$/.test(assetInfo.name || '')) {
    return `css/[name]-[hash].[ext]`
  }
  if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name || '')) {
    return `images/[name]-[hash].[ext]`
  }
  if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name || '')) {
    return `fonts/[name]-[hash].[ext]`
  }
  return `assets/[name]-[hash].[ext]`
}
```

#### Terser Optimization
```typescript
// Production minification settings
terserOptions: {
  compress: {
    drop_console: true,
    drop_debugger: true,
    pure_funcs: ['console.log', 'console.info', 'console.debug'],
  },
  mangle: {
    safari10: true,
  },
}
```

### PWA Configuration

#### Service Worker Setup
```typescript
// PWA with offline support
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
        },
      },
      {
        urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
    ],
  },
})
```

#### PWA Manifest
```json
{
  "name": "Forestry Compliance Application",
  "short_name": "ForestryApp",
  "description": "Comprehensive forestry compliance and management application",
  "theme_color": "#2D5016",
  "background_color": "#ffffff",
  "display": "standalone",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 📊 Performance Monitoring

### Core Web Vitals Tracking

#### Performance Metrics
```typescript
// Performance monitoring component
interface PerformanceMetrics {
  fcp: number | null;  // First Contentful Paint
  lcp: number | null;  // Largest Contentful Paint
  fid: number | null;  // First Input Delay
  cls: number | null;  // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}
```

#### Performance Scoring
```typescript
// Performance score calculation
const calculatePerformanceScore = (metrics: PerformanceMetrics): number => {
  let score = 0;
  let totalWeight = 0;

  // LCP scoring (weight: 25%)
  if (metrics.lcp !== null) {
    const lcpScore = metrics.lcp < 2500 ? 100 : Math.max(0, 100 - ((metrics.lcp - 2500) / 100));
    score += lcpScore * 0.25;
    totalWeight += 0.25;
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
```

### Bundle Analysis

#### Bundle Analyzer
```bash
# Analyze bundle size
npm run build:analyze

# View bundle statistics
open dist/stats.html
```

#### Bundle Size Targets
- **Total Bundle Size**: < 500KB gzipped
- **Initial Chunk**: < 200KB gzipped
- **Vendor Chunks**: < 150KB each
- **CSS Bundle**: < 50KB gzipped

## 🏗️ Build Scripts

### Optimized Build Commands
```json
{
  "scripts": {
    "build": "vite build",
    "build:optimized": "vite build --mode production",
    "build:production": "vite build --mode production",
    "build:staging": "vite build --mode staging",
    "build:preview": "vite build --mode preview",
    "build:analyze": "vite build --mode production && npm run analyze",
    "analyze": "npx vite-bundle-analyzer dist/stats.html",
    "test:performance": "npm run build:analyze && npm run lighthouse",
    "lighthouse": "npx lighthouse http://localhost:4173 --output=html --output-path=./lighthouse-report.html"
  }
}
```

### Environment-Specific Builds
```typescript
// Environment configuration
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    build: {
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      // ... other optimizations
    }
  }
})
```

## 🌐 Netlify Deployment Optimizations

### Caching Strategy
```toml
# Static assets caching
[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Encoding = "gzip"
    Vary = "Accept-Encoding"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Encoding = "gzip"
    Vary = "Accept-Encoding"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Content-Encoding = "gzip"
    Vary = "Accept-Encoding"
```

### Security Headers
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;"
```

### Build Processing
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[build.processing.images]
  compress = true
```

## 📱 Mobile Optimization

### Touch-Friendly Components
```css
/* Minimum touch target size */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Mobile-optimized spacing */
@media (max-width: 768px) {
  .mobile-spacing {
    padding: 1rem;
    gap: 0.75rem;
  }
}
```

### Responsive Images
```typescript
// Image optimization
const ImageComponent = ({ src, alt, sizes }) => (
  <img
    src={src}
    alt={alt}
    sizes={sizes}
    loading="lazy"
    decoding="async"
    className="w-full h-auto"
  />
);
```

### Offline Support
```typescript
// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

## 🔧 Performance Best Practices

### Code Splitting
```typescript
// Lazy load components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Route-based code splitting
const routes = [
  {
    path: '/dashboard',
    component: React.lazy(() => import('./Dashboard')),
  },
  {
    path: '/reports',
    component: React.lazy(() => import('./Reports')),
  },
];
```

### Image Optimization
```typescript
// Optimized image loading
const OptimizedImage = ({ src, alt, width, height }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    loading="lazy"
    decoding="async"
    className="object-cover"
  />
);
```

### Font Optimization
```css
/* Font display optimization */
@font-face {
  font-family: 'Inter';
  font-display: swap;
  src: url('/fonts/inter-var.woff2') format('woff2');
}
```

### CSS Optimization
```typescript
// Purge unused CSS
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  // ... other config
}
```

## 📈 Monitoring & Analytics

### Performance Tracking
```typescript
// Performance metrics logging
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
};
```

### Error Tracking
```typescript
// Error boundary with performance tracking
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }
}
```

## 🧪 Testing Performance

### Lighthouse Testing
```bash
# Run Lighthouse audit
npm run lighthouse

# Performance testing workflow
npm run test:performance
```

### Bundle Size Testing
```bash
# Analyze bundle size
npm run build:analyze

# Check bundle size limits
npm run build:size-check
```

### Performance Budgets
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "200kb",
      "maximumError": "300kb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "50kb",
      "maximumError": "100kb"
    }
  ]
}
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Run performance tests
- [ ] Check bundle size
- [ ] Validate PWA manifest
- [ ] Test offline functionality
- [ ] Verify security headers
- [ ] Check Core Web Vitals

### Post-Deployment
- [ ] Monitor performance metrics
- [ ] Check error rates
- [ ] Validate caching
- [ ] Test mobile performance
- [ ] Verify PWA installation

### Continuous Monitoring
- [ ] Set up performance alerts
- [ ] Monitor Core Web Vitals
- [ ] Track user experience metrics
- [ ] Analyze bundle size trends
- [ ] Review performance budgets

This comprehensive build optimization guide ensures optimal performance, fast loading times, and excellent user experience for the Forestry Compliance Application.
