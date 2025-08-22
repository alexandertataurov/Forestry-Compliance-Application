// Error tracking utility for monitoring and alerting
export interface ErrorEvent {
  message: string;
  stack?: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  sessionId: string;
  userId?: string;
  userAgent: string;
  url: string;
  componentStack?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorTracker {
  private sessionId: string;
  private errors: ErrorEvent[] = [];
  private isInitialized = false;
  private maxErrors = 100; // Prevent memory leaks

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  init(): void {
    if (this.isInitialized) return;

    // Global error handlers
    this.setupGlobalErrorHandlers();
    
    // Unhandled promise rejection handler
    this.setupPromiseRejectionHandler();
    
    // Network error monitoring
    this.setupNetworkErrorMonitoring();
    
    this.isInitialized = true;
  }

  private setupGlobalErrorHandlers(): void {
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        additionalData: {
          type: 'javascript_error',
          isTrusted: event.isTrusted
        }
      });
    });
  }

  private setupPromiseRejectionHandler(): void {
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        additionalData: {
          type: 'promise_rejection',
          reason: event.reason
        }
      });
    });
  }

  private setupNetworkErrorMonitoring(): void {
    // Monitor fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        if (!response.ok) {
          this.captureError({
            message: `HTTP ${response.status}: ${response.statusText}`,
            additionalData: {
              type: 'network_error',
              url: args[0] as string,
              status: response.status,
              statusText: response.statusText
            }
          });
        }
        
        return response;
      } catch (error) {
        this.captureError({
          message: `Network request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          stack: error instanceof Error ? error.stack : undefined,
          additionalData: {
            type: 'network_error',
            url: args[0] as string
          }
        });
        throw error;
      }
    };
  }

  captureError(errorData: Partial<ErrorEvent>): void {
    const errorEvent: ErrorEvent = {
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      filename: errorData.filename,
      lineno: errorData.lineno,
      colno: errorData.colno,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: errorData.userId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      componentStack: errorData.componentStack,
      additionalData: errorData.additionalData
    };

    this.errors.push(errorEvent);
    
    // Prevent memory leaks
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Send to error tracking service
    this.sendToErrorService(errorEvent);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error captured:', errorEvent);
    }
  }

  private sendToErrorService(error: ErrorEvent): void {
    // Send to Sentry (if configured)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(new Error(error.message), {
        extra: error.additionalData,
        tags: {
          sessionId: error.sessionId,
          url: error.url
        }
      });
    }

    // Send to custom error tracking endpoint
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    }).catch(() => {
      // Silently fail to prevent infinite loops
    });
  }

  // React Error Boundary integration
  captureReactError(error: Error, errorInfo: React.ErrorInfo): void {
    this.captureError({
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      additionalData: {
        type: 'react_error',
        componentStack: errorInfo.componentStack
      }
    });
  }

  // Forestry-specific error tracking
  captureForestryError(operation: string, error: Error, context?: any): void {
    this.captureError({
      message: `Forestry operation error: ${error.message}`,
      stack: error.stack,
      additionalData: {
        type: 'forestry_error',
        operation,
        context
      }
    });
  }

  captureComplianceError(checkType: string, error: Error, data?: any): void {
    this.captureError({
      message: `Compliance check error: ${error.message}`,
      stack: error.stack,
      additionalData: {
        type: 'compliance_error',
        checkType,
        data
      }
    });
  }

  captureDataValidationError(field: string, value: any, validationRule: string): void {
    this.captureError({
      message: `Data validation error for field: ${field}`,
      additionalData: {
        type: 'validation_error',
        field,
        value,
        validationRule
      }
    });
  }

  getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  getSessionId(): string {
    return this.sessionId;
  }

  clearErrors(): void {
    this.errors = [];
  }

  // Error boundary component helper
  static getErrorBoundaryState(error: Error, errorInfo: React.ErrorInfo): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo
    };
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  errorTracker.init();
}

// React Error Boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo }>
) {
  return class ErrorBoundary extends React.Component<P, ErrorBoundaryState> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
      return ErrorTracker.getErrorBoundaryState(error, {} as React.ErrorInfo);
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorTracker.captureReactError(error, errorInfo);
      this.setState(ErrorTracker.getErrorBoundaryState(error, errorInfo));
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          return React.createElement(fallback, {
            error: this.state.error,
            errorInfo: this.state.errorInfo
          });
        }
        return (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
}
