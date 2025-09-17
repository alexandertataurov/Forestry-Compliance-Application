namespace LogsManagement.API.Options;

/// <summary>
/// Configuration options for OpenTelemetry telemetry
/// </summary>
public class TelemetryOptions
{
    public const string SectionName = "OpenTelemetry";

    /// <summary>
    /// Service name for telemetry identification
    /// </summary>
    public string ServiceName { get; set; } = "logsmanagement-api";

    /// <summary>
    /// Service namespace for telemetry grouping
    /// </summary>
    public string ServiceNamespace { get; set; } = "LogsManagement";

    /// <summary>
    /// OTLP endpoint for exporting telemetry data
    /// </summary>
    public string OtlpEndpoint { get; set; } = "http://localhost:4318";

    /// <summary>
    /// OTLP protocol (http/protobuf or grpc)
    /// </summary>
    public string OtlpProtocol { get; set; } = "http/protobuf";

    /// <summary>
    /// Enable console exporters for traces and metrics
    /// </summary>
    public bool EnableConsoleExporters { get; set; } = false;

    /// <summary>
    /// Enable runtime instrumentation for metrics
    /// </summary>
    public bool EnableRuntime { get; set; } = true;

    /// <summary>
    /// OTLP exporter timeout in milliseconds
    /// </summary>
    public int TimeoutMilliseconds { get; set; } = 15000;

    /// <summary>
    /// Sampler configuration
    /// </summary>
    public SamplerOptions Sampler { get; set; } = new();

    /// <summary>
    /// Instrumentation configuration
    /// </summary>
    public InstrumentationOptions Instrumentation { get; set; } = new();

    /// <summary>
    /// Trace filtering options
    /// </summary>
    public FilterOptions Filter { get; set; } = new();
}

/// <summary>
/// Sampler configuration options
/// </summary>
public class SamplerOptions
{
    /// <summary>
    /// Trace sampling ratio (0.0 to 1.0)
    /// </summary>
    public double TraceIdRatio { get; set; } = 1.0;
}

/// <summary>
/// Instrumentation configuration options
/// </summary>
public class InstrumentationOptions
{
    /// <summary>
    /// Enable ASP.NET Core instrumentation
    /// </summary>
    public bool AspNetCore { get; set; } = true;

    /// <summary>
    /// Enable HTTP client instrumentation
    /// </summary>
    public bool HttpClient { get; set; } = true;

    /// <summary>
    /// Enable Entity Framework Core instrumentation
    /// </summary>
    public bool EntityFrameworkCore { get; set; } = true;

    /// <summary>
    /// Enable runtime metrics instrumentation
    /// </summary>
    public bool Runtime { get; set; } = true;

    /// <summary>
    /// Record exceptions in traces
    /// </summary>
    public bool RecordExceptions { get; set; } = true;

    /// <summary>
    /// Include database statements in EF Core traces
    /// </summary>
    public bool IncludeDbStatements { get; set; } = true;
}

/// <summary>
/// Filtering configuration options
/// </summary>
public class FilterOptions
{
    /// <summary>
    /// Paths to exclude from tracing (e.g., health check endpoints)
    /// </summary>
    public string[] ExcludedPaths { get; set; } = ["/health", "/alive"];

    /// <summary>
    /// Enable filtering of health check endpoints
    /// </summary>
    public bool FilterHealthEndpoints { get; set; } = true;
}