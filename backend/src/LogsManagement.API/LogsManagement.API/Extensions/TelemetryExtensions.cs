using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using System.Diagnostics;
using System.Diagnostics.Metrics;
using System.Reflection;

namespace LogsManagement.API.Extensions;

/// <summary>
/// Provides extension methods for configuring telemetry in an application.
/// </summary>
/// <remarks>This class includes methods to configure OpenTelemetry tracing and metrics for an application, 
/// including support for custom activity sources, meters, and integration with ASP.NET Core and HTTP client
/// instrumentation.</remarks>
public static class TelemetryExtensions
{
    public static readonly ActivitySource ApplicationActivitySource = new("logsmanagement-api");

    /// <summary>
    /// Configures application telemetry using OpenTelemetry for distributed tracing and metrics.
    /// </summary>
    /// <remarks>This method sets up OpenTelemetry for the application, including distributed tracing and
    /// metrics collection.  It configures the service name, version, and environment attributes for telemetry
    /// resources, and adds instrumentation  for ASP.NET Core, HTTP client, and runtime metrics. The method also enables
    /// exporting telemetry data using the OTLP protocol.</remarks>
    /// <param name="services">The <see cref="IServiceCollection"/> to which the telemetry services will be added.</param>
    /// <param name="applicationName">The name of the application, used to identify the service in telemetry data.</param>
    /// <param name="environmentName">The name of the deployment environment (e.g., "Development", "Production"), included as a telemetry attribute.</param>
    /// <returns>The updated <see cref="IServiceCollection"/> instance with telemetry services configured.</returns>
    public static IServiceCollection AddAppTelemetry(
        this IServiceCollection services,
        string applicationName,
        string environmentName)
    {
        var serviceName = applicationName;
        var serviceVersion = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0";
        var activitySource = new ActivitySource("WeatherApp");   // свой источник спанов
        var meter = new Meter("WeatherMeter", "1.0.0"); // свой meter

        var otel = services.AddOpenTelemetry()
            .ConfigureResource(r => r
                .AddService(serviceName: serviceName, serviceVersion: serviceVersion)
                .AddAttributes(
                [
                    new KeyValuePair<string, object>("deployment.environment", environmentName),
                    new KeyValuePair<string, object>("service.instance.id", Environment.MachineName)
                ]))
            .WithTracing(t => t
                .AddSource(activitySource.Name)                     // <— важно для кастомных спанов
                .AddAspNetCoreInstrumentation(o => o.RecordException = true)
                .AddHttpClientInstrumentation(o => o.RecordException = true)
                .AddOtlpExporter())                                 // читает OTEL_EXPORTER_* из env
            .WithMetrics(m => m
                .AddMeter(meter.Name)
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddRuntimeInstrumentation()
                .AddOtlpExporter());
        

        return services;
    }
}