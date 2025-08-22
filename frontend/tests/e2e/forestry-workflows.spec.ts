import { test, expect } from '@playwright/test';

test.describe('Forestry Compliance Application - E2E Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    // Wait for the application to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Volume Calculator Workflow', () => {
    test('should complete volume calculation workflow', async ({ page }) => {
      // Navigate to calculator
      await page.click('[data-testid="calculator-nav"]');
      await expect(page.locator('[data-testid="volume-calculator"]')).toBeVisible();

      // Select standard
      await page.click('[data-testid="standard-selector"]');
      await page.click('text=GOST 2708-75');

      // Select species
      await page.click('[data-testid="species-selector"]');
      await page.click('text=Сосна');

      // Enter length measurement
      await page.fill('[data-testid="length-input"]', '6.5');
      await page.selectOption('[data-testid="length-unit"]', 'm');

      // Enter GPS coordinates
      await page.fill('[data-testid="gps-lat"]', '41.7151');
      await page.fill('[data-testid="gps-lng"]', '44.8271');

      // Add diameter measurements
      await page.fill('[data-testid="diameter-input"]', '25.5');
      await page.click('[data-testid="add-diameter"]');
      await page.fill('[data-testid="diameter-input"]', '28.2');
      await page.click('[data-testid="add-diameter"]');

      // Calculate volume
      await page.click('[data-testid="calculate-volume"]');

      // Verify calculation results
      await expect(page.locator('[data-testid="volume-result"]')).toBeVisible();
      await expect(page.locator('[data-testid="volume-value"]')).toContainText('м³');

      // Save calculation
      await page.click('[data-testid="save-calculation"]');
      await expect(page.locator('[data-testid="save-success"]')).toBeVisible();
    });

    test('should handle batch calculation workflow', async ({ page }) => {
      // Navigate to batch mode
      await page.click('[data-testid="calculator-nav"]');
      await page.click('[data-testid="batch-mode"]');

      // Enter batch information
      await page.fill('[data-testid="batch-number"]', '20241201-ABC123');
      await page.fill('[data-testid="operator-name"]', 'Иван Петров');
      await page.fill('[data-testid="batch-date"]', '2024-12-01');

      // Add multiple calculations
      for (let i = 0; i < 3; i++) {
        await page.click('[data-testid="add-calculation"]');
        await page.fill(`[data-testid="diameter-${i}"]`, `${20 + i * 5}`);
        await page.fill(`[data-testid="length-${i}"]`, '6.0');
      }

      // Calculate batch total
      await page.click('[data-testid="calculate-batch"]');
      await expect(page.locator('[data-testid="batch-total"]')).toBeVisible();
    });
  });

  test.describe('Data Management Workflow', () => {
    test('should manage calculation data', async ({ page }) => {
      // Navigate to data management
      await page.click('[data-testid="data-nav"]');
      await expect(page.locator('[data-testid="data-management"]')).toBeVisible();

      // Search for calculations
      await page.fill('[data-testid="search-input"]', 'Сосна');
      await expect(page.locator('[data-testid="calculation-row"]')).toHaveCount(1);

      // Filter by species
      await page.selectOption('[data-testid="species-filter"]', 'Сосна');
      await expect(page.locator('[data-testid="calculation-row"]')).toHaveCount(1);

      // Sort by date
      await page.click('[data-testid="sort-date"]');
      await expect(page.locator('[data-testid="calculation-row"]').first()).toBeVisible();

      // Export data
      await page.click('[data-testid="export-data"]');
      // Verify download started
      await expect(page.locator('[data-testid="export-success"]')).toBeVisible();
    });

    test('should sync data with server', async ({ page }) => {
      await page.click('[data-testid="data-nav"]');

      // Check sync status
      await expect(page.locator('[data-testid="sync-status"]')).toBeVisible();

      // Trigger manual sync
      await page.click('[data-testid="sync-button"]');
      await expect(page.locator('[data-testid="sync-progress"]')).toBeVisible();

      // Wait for sync completion
      await expect(page.locator('[data-testid="sync-complete"]')).toBeVisible();
    });
  });

  test.describe('Analytics Workflow', () => {
    test('should display analytics dashboard', async ({ page }) => {
      // Navigate to analytics
      await page.click('[data-testid="analytics-nav"]');
      await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible();

      // Check charts are rendered
      await expect(page.locator('[data-testid="volume-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="species-chart"]')).toBeVisible();
      await expect(page.locator('[data-testid="trend-chart"]')).toBeVisible();

      // Change time range
      await page.selectOption('[data-testid="time-range"]', 'month');
      await expect(page.locator('[data-testid="chart-updated"]')).toBeVisible();

      // Filter by species
      await page.selectOption('[data-testid="species-filter"]', 'Ель');
      await expect(page.locator('[data-testid="filtered-chart"]')).toBeVisible();
    });
  });

  test.describe('Mobile Field Operations', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Test mobile navigation
      await page.click('[data-testid="mobile-menu"]');
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible();

      // Test touch interactions
      await page.click('[data-testid="calculator-nav"]');
      await expect(page.locator('[data-testid="volume-calculator"]')).toBeVisible();

      // Test mobile form inputs
      await page.fill('[data-testid="diameter-input"]', '25.5');
      await page.tap('[data-testid="add-diameter"]');

      // Test mobile GPS input
      await page.click('[data-testid="gps-button"]');
      await expect(page.locator('[data-testid="gps-modal"]')).toBeVisible();
    });

    test('should handle offline mode', async ({ page }) => {
      // Simulate offline mode
      await page.route('**/*', route => route.abort());

      // Navigate to calculator
      await page.click('[data-testid="calculator-nav"]');
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();

      // Should still be able to calculate
      await page.fill('[data-testid="diameter-input"]', '25.5');
      await page.click('[data-testid="calculate-volume"]');
      await expect(page.locator('[data-testid="volume-result"]')).toBeVisible();

      // Data should be saved locally
      await page.click('[data-testid="save-calculation"]');
      await expect(page.locator('[data-testid="local-save"]')).toBeVisible();
    });
  });

  test.describe('Accessibility Workflow', () => {
    test('should support keyboard navigation', async ({ page }) => {
      // Navigate using keyboard
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter'); // Should activate calculator

      // Navigate through form fields
      await page.keyboard.press('Tab');
      await page.keyboard.type('25.5'); // Diameter input

      await page.keyboard.press('Tab');
      await page.keyboard.type('6.5'); // Length input

      // Submit form
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      await expect(page.locator('[data-testid="volume-result"]')).toBeVisible();
    });

    test('should support screen readers', async ({ page }) => {
      // Check ARIA labels
      await expect(page.locator('[aria-label="Volume Calculator"]')).toBeVisible();
      await expect(page.locator('[aria-label="Diameter Input"]')).toBeVisible();

      // Check role attributes
      await expect(page.locator('[role="button"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle validation errors', async ({ page }) => {
      await page.click('[data-testid="calculator-nav"]');

      // Try to calculate without required fields
      await page.click('[data-testid="calculate-volume"]');
      await expect(page.locator('[data-testid="validation-error"]')).toBeVisible();

      // Enter invalid data
      await page.fill('[data-testid="diameter-input"]', '-5');
      await page.click('[data-testid="calculate-volume"]');
      await expect(page.locator('[data-testid="invalid-input"]')).toBeVisible();
    });

    test('should handle network errors', async ({ page }) => {
      // Simulate network error
      await page.route('**/api/**', route => route.abort('failed'));

      await page.click('[data-testid="data-nav"]');
      await page.click('[data-testid="sync-button"]');

      await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    });
  });
});
