/**
 * Color Contrast Validation Utilities
 * Implements WCAG 2.1 AA contrast ratio requirements
 */

// Convert hex color to RGB
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
};

// Convert RGB to relative luminance
export const rgbToLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const l1 = rgbToLuminance(...rgb1);
  const l2 = rgbToLuminance(...rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast meets WCAG AA standards
export const meetsWCAGAA = (
  contrastRatio: number, 
  isLargeText = false
): boolean => {
  return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
};

// Check if contrast meets WCAG AAA standards
export const meetsWCAGAAA = (
  contrastRatio: number, 
  isLargeText = false
): boolean => {
  return isLargeText ? contrastRatio >= 4.5 : contrastRatio >= 7;
};

// Validate color pair for accessibility
export const validateColorPair = (
  foreground: string,
  background: string,
  isLargeText = false
): {
  contrastRatio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  level: 'AA' | 'AAA' | 'FAIL';
} => {
  const contrastRatio = getContrastRatio(foreground, background);
  const meetsAA = meetsWCAGAA(contrastRatio, isLargeText);
  const meetsAAA = meetsWCAGAAA(contrastRatio, isLargeText);
  
  let level: 'AA' | 'AAA' | 'FAIL';
  if (meetsAAA) {
    level = 'AAA';
  } else if (meetsAA) {
    level = 'AA';
  } else {
    level = 'FAIL';
  }
  
  return {
    contrastRatio,
    meetsAA,
    meetsAAA,
    level
  };
};

// Get accessible text color for a background
export const getAccessibleTextColor = (
  background: string,
  isLargeText = false
): string => {
  const whiteContrast = getContrastRatio('#FFFFFF', background);
  const blackContrast = getContrastRatio('#000000', background);
  
  const whiteMeetsAA = meetsWCAGAA(whiteContrast, isLargeText);
  const blackMeetsAA = meetsWCAGAA(blackContrast, isLargeText);
  
  if (whiteMeetsAA) {
    return '#FFFFFF';
  } else if (blackMeetsAA) {
    return '#000000';
  } else {
    // Find a color that meets AA standards
    const colors = [
      '#FFFFFF', '#000000', '#333333', '#666666', 
      '#999999', '#CCCCCC', '#E5E5E5', '#F5F5F5'
    ];
    
    for (const color of colors) {
      const contrast = getContrastRatio(color, background);
      if (meetsWCAGAA(contrast, isLargeText)) {
        return color;
      }
    }
    
    // Fallback to highest contrast
    return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
  }
};

// Validate design token colors for accessibility
export const validateDesignTokens = (): {
  brand: Record<string, Record<string, {
    contrastRatio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    level: 'AA' | 'AAA' | 'FAIL';
  }>>;
  neutral: Record<string, Record<string, {
    contrastRatio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    level: 'AA' | 'AAA' | 'FAIL';
  }>>;
  surface: Record<string, Record<string, {
    contrastRatio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    level: 'AA' | 'AAA' | 'FAIL';
  }>>;
  state: Record<string, Record<string, {
    contrastRatio: number;
    meetsAA: boolean;
    meetsAAA: boolean;
    level: 'AA' | 'AAA' | 'FAIL';
  }>>;
} => {
  const results = {
    brand: {},
    neutral: {},
    surface: {},
    state: {}
  };
  
  // Brand colors validation
  const brandColors = {
    primary: '#335CFF',
    secondary: '#6B8AFF',
    tertiary: '#00BFA5',
    error: '#D14343'
  };
  
  Object.entries(brandColors).forEach(([name, color]) => {
    results.brand[name] = {
      onPrimary: validateColorPair('#FFFFFF', color, false),
      onSurface: validateColorPair(color, '#FFFFFF', false)
    };
  });
  
  // Neutral colors validation
  const neutralColors = {
    0: '#FFFFFF',
    100: '#DDE3EE',
    500: '#7E8AAD',
    900: '#1A202C'
  };
  
  Object.entries(neutralColors).forEach(([name, color]) => {
    results.neutral[name] = {
      onColor: validateColorPair('#000000', color, false),
      colorOnWhite: validateColorPair(color, '#FFFFFF', false)
    };
  });
  
  // Surface colors validation
  const surfaceColors = {
    bg: '#FFFFFF',
    bgVariant: '#F6F7F9',
    onSurface: '#111418',
    onVariant: '#2B303A'
  };
  
  Object.entries(surfaceColors).forEach(([name, color]) => {
    results.surface[name] = {
      onSurface: validateColorPair(color, '#FFFFFF', false),
      surfaceOnColor: validateColorPair('#FFFFFF', color, false)
    };
  });
  
  // State colors validation
  const stateColors = {
    success: '#17A34A',
    warning: '#D97706',
    info: '#0284C7'
  };
  
  Object.entries(stateColors).forEach(([name, color]) => {
    results.state[name] = {
      onState: validateColorPair('#FFFFFF', color, false),
      stateOnWhite: validateColorPair(color, '#FFFFFF', false)
    };
  });
  
  return results;
};

// Generate accessibility report
export const generateAccessibilityReport = (): string => {
  const validation = validateDesignTokens();
  let report = 'Design Token Accessibility Report\n';
  report += '===================================\n\n';
  
  Object.entries(validation).forEach(([category, colors]) => {
    report += `${category.toUpperCase()} COLORS:\n`;
    report += '-'.repeat(category.length + 8) + '\n';
    
    Object.entries(colors).forEach(([colorName, tests]) => {
      report += `\n${colorName}:\n`;
      Object.entries(tests).forEach(([testName, result]) => {
        const status = result.level === 'FAIL' ? '❌' : result.level === 'AAA' ? '✅' : '⚠️';
        report += `  ${testName}: ${status} ${result.contrastRatio.toFixed(2)}:1 (${result.level})\n`;
      });
    });
    report += '\n';
  });
  
  return report;
};
