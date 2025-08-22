import * as React from "react";

// Enhanced breakpoints for forestry field operations
const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  large: 1536,
} as const;

// Device-specific features for field operations
const FIELD_DEVICE_FEATURES = {
  touchScreen: true,
  gps: true,
  camera: true,
  offline: true,
  rugged: false, // Can be detected via user agent
} as const;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < BREAKPOINTS.mobile);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

// Enhanced device detection for forestry operations
export function useDeviceFeatures() {
  const [features, setFeatures] = React.useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    hasTouch: false,
    hasGPS: false,
    hasCamera: false,
    isLandscape: false,
    isPortrait: false,
    screenSize: { width: 0, height: 0 },
    pixelRatio: 1,
    isRugged: false,
  });

  React.useEffect(() => {
    const updateFeatures = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setFeatures({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
        isDesktop: width >= BREAKPOINTS.tablet,
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasGPS: 'geolocation' in navigator,
        hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
        isLandscape: width > height,
        isPortrait: height > width,
        screenSize: { width, height },
        pixelRatio: window.devicePixelRatio || 1,
        isRugged: /rugged|industrial|field/i.test(navigator.userAgent),
      });
    };

    updateFeatures();
    window.addEventListener('resize', updateFeatures);
    window.addEventListener('orientationchange', updateFeatures);

    return () => {
      window.removeEventListener('resize', updateFeatures);
      window.removeEventListener('orientationchange', updateFeatures);
    };
  }, []);

  return features;
}

// Hook for responsive breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop' | 'large'>('mobile');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) setBreakpoint('mobile');
      else if (width < BREAKPOINTS.tablet) setBreakpoint('tablet');
      else if (width < BREAKPOINTS.desktop) setBreakpoint('desktop');
      else setBreakpoint('large');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

// Hook for field operation specific features
export function useFieldOperations() {
  const deviceFeatures = useDeviceFeatures();
  
  return {
    ...deviceFeatures,
    // Field-specific optimizations
    shouldUseLargeButtons: deviceFeatures.isMobile && deviceFeatures.hasTouch,
    shouldUseCompactLayout: deviceFeatures.isMobile && deviceFeatures.isPortrait,
    shouldUseLandscapeLayout: deviceFeatures.isMobile && deviceFeatures.isLandscape,
    shouldOptimizeForTouch: deviceFeatures.hasTouch,
    shouldShowGPSFeatures: deviceFeatures.hasGPS,
    shouldShowCameraFeatures: deviceFeatures.hasCamera,
    // Rugged device optimizations
    shouldUseHighContrast: deviceFeatures.isRugged,
    shouldUseLargerText: deviceFeatures.isRugged || deviceFeatures.pixelRatio < 2,
  };
}
