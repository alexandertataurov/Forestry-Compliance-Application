# Forestry Compliance Application - DevOps Guide

## 🚀 Deployment Pipeline

### CI/CD Workflows

The application uses GitHub Actions for automated CI/CD:

- **Main Deployment** (`deploy.yml`): Deploys to production on main branch
- **Preview Deployment** (`preview.yml`): Creates preview URLs for PRs
- **Security Scanning** (`security.yml`): Runs security audits
- **Performance Monitoring** (`performance.yml`): Lighthouse CI monitoring

### Required Secrets

Set these secrets in GitHub repository settings:

```bash
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
SNYK_TOKEN=your_snyk_token
```

### Local Development

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test:e2e

# Security audit
npm run security:audit
```

## 🔧 Environment Configuration

### Netlify Configuration

The `netlify.toml` file configures:

- Build commands for different environments
- Security headers and CSP policies
- Cache optimization
- Redirect rules for SPA
- Environment-specific settings

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Build environment | `production` |
| `VITE_APP_ENV` | App environment | `production` |
| `NODE_VERSION` | Node.js version | `18` |

## 🛡️ Security Features

### Security Headers

- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection
- Strict-Transport-Security
- Permissions Policy

### Security Scanning

- npm audit integration
- Snyk vulnerability scanning
- OWASP ZAP security testing
- Automated security checks in CI/CD

## 📊 Performance Monitoring

### Lighthouse CI

- Automated performance testing
- Core Web Vitals monitoring
- Accessibility compliance
- SEO optimization checks

### Build Optimization

- Code splitting with manual chunks
- Terser minification
- Asset optimization
- Bundle size monitoring

## 🔄 Deployment Process

1. **Code Push**: Triggers CI/CD pipeline
2. **Testing**: Type check, lint, build, E2E tests
3. **Security Scan**: Vulnerability assessment
4. **Build**: Production-optimized build
5. **Deploy**: Automatic deployment to Netlify
6. **Performance Check**: Lighthouse CI validation

## 📈 Monitoring & Analytics

### Error Tracking

- Netlify error tracking
- Performance monitoring
- User analytics integration

### Backup & Recovery

- Automated backups
- Rollback procedures
- Disaster recovery protocols

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**: Check Node.js version and dependencies
2. **Deployment Issues**: Verify Netlify configuration
3. **Performance Issues**: Review Lighthouse reports
4. **Security Warnings**: Address npm audit findings

### Support

For DevOps issues, contact the DevOps team or check the GitHub Actions logs.
