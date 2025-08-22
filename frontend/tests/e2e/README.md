# End-to-End Testing for Forestry Compliance Application

## Overview

This directory contains comprehensive end-to-end tests for the Forestry Compliance Application using Playwright. The tests cover complete user workflows from volume calculation to data management and analytics.

## Test Structure

### Test Files
- `forestry-workflows.spec.ts` - Main E2E test suite covering all workflows
- `README.md` - This documentation file

### Test Categories

1. **Volume Calculator Workflow**
   - Standard volume calculation
   - Batch calculation processing
   - GPS coordinate input
   - Species selection

2. **Data Management Workflow**
   - Data search and filtering
   - Export functionality
   - Sync operations
   - Data validation

3. **Analytics Workflow**
   - Dashboard visualization
   - Chart interactions
   - Time range filtering
   - Species filtering

4. **Mobile Field Operations**
   - Mobile responsiveness
   - Touch interactions
   - Offline functionality
   - GPS integration

5. **Accessibility Workflow**
   - Keyboard navigation
   - Screen reader support
   - ARIA compliance
   - Focus management

6. **Error Handling**
   - Validation errors
   - Network errors
   - Offline scenarios
   - Invalid input handling

## Running Tests

### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Test Commands
```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI
npm run test:e2e:ui

# Run tests in headed mode
npm run test:e2e:headed

# Run mobile tests only
npm run test:e2e:mobile

# Run desktop tests only
npm run test:e2e:desktop
```

### Development Server
The tests automatically start the development server on `http://localhost:5173`. Make sure the port is available.

## Test Data

### Sample Calculations
The tests use realistic forestry data:
- Species: Сосна (Pine), Ель (Spruce), Берёза (Birch)
- Diameters: 20-50 cm range
- Lengths: 4-8 meters
- GPS coordinates: Tbilisi area (41.7151, 44.8271)

### Test Users
- Operator: Иван Петров
- Batch numbers: YYYYMMDD-XXXXXX format
- Locations: Forest plots and coordinates

## Test Scenarios

### Volume Calculator
1. **Standard Calculation**
   - Select GOST 2708-75 standard
   - Choose species (Сосна)
   - Enter length (6.5m)
   - Add diameter measurements
   - Calculate volume
   - Save calculation

2. **Batch Processing**
   - Enter batch information
   - Add multiple calculations
   - Calculate batch totals
   - Export batch data

### Data Management
1. **Search and Filter**
   - Search by species
   - Filter by date range
   - Sort by various criteria
   - Export filtered data

2. **Sync Operations**
   - Check sync status
   - Trigger manual sync
   - Handle sync errors
   - Verify data consistency

### Mobile Operations
1. **Touch Interface**
   - Mobile navigation
   - Touch input handling
   - GPS integration
   - Offline functionality

2. **Field Scenarios**
   - Rugged device testing
   - Battery optimization
   - Network connectivity
   - Data persistence

## Configuration

### Playwright Config
- **Base URL**: `http://localhost:5173`
- **Timeout**: 120 seconds for dev server
- **Retries**: 2 on CI, 0 locally
- **Parallel**: Enabled for faster execution

### Browser Support
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Pixel 5, iPhone 12
- **Viewports**: Responsive testing

### Reporting
- **HTML**: Interactive test reports
- **JSON**: Machine-readable results
- **JUnit**: CI/CD integration
- **Screenshots**: On failure
- **Videos**: On failure

## Best Practices

### Test Data Management
- Use realistic forestry data
- Clean up test data after tests
- Avoid hardcoded values
- Use data-testid attributes

### Reliability
- Wait for network idle
- Use proper selectors
- Handle async operations
- Retry flaky operations

### Performance
- Run tests in parallel
- Optimize test data
- Use efficient selectors
- Minimize setup time

## Troubleshooting

### Common Issues

1. **Development Server Not Starting**
   ```bash
   # Check if port 5173 is available
   lsof -i :5173
   # Kill process if needed
   kill -9 <PID>
   ```

2. **Tests Failing on CI**
   ```bash
   # Run with CI configuration
   CI=true npm run test:e2e
   ```

3. **Mobile Tests Failing**
   ```bash
   # Install mobile browsers
   npx playwright install --with-deps
   ```

4. **Network Timeouts**
   - Increase timeout in playwright.config.ts
   - Check network connectivity
   - Verify API endpoints

### Debug Mode
```bash
# Run with debug logging
DEBUG=pw:api npm run test:e2e

# Run single test with UI
npx playwright test forestry-workflows.spec.ts --ui
```

## Continuous Integration

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e
  env:
    CI: true
```

### Test Results
- HTML reports in `playwright-report/`
- JSON results in `test-results/`
- Screenshots on failure
- Videos for debugging

## Future Enhancements

### Planned Features
- Visual regression testing
- Performance testing
- Load testing scenarios
- API integration testing
- Database testing

### Test Coverage
- [ ] LesEGAIS integration
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] User management
- [ ] Role-based access

## Contributing

### Adding New Tests
1. Follow existing test structure
2. Use data-testid attributes
3. Add proper assertions
4. Include error scenarios
5. Update documentation

### Test Guidelines
- Keep tests independent
- Use descriptive test names
- Add proper comments
- Follow accessibility standards
- Test edge cases

## Support

For issues with E2E tests:
1. Check troubleshooting section
2. Review test logs
3. Run in debug mode
4. Contact QA team
5. Create issue ticket
