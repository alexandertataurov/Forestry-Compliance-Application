using OpenTelemetry.Logs;
using Serilog;
using Serilog.Sinks.OpenTelemetry;

namespace LogsManagement.API.Extensions;

/// <summary>
/// Centralized Serilog bootstrap and middleware.
/// </summary>
public static class LoggingExtensions
{
    /// <summary>
    /// Configure Serilog from configuration (appsettings*).
    /// </summary>
    public static void ConfigureSerilogLogging(this WebApplicationBuilder builder)
    {

        var otlpEndpoint = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT");
        var otlpProtocol = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_PROTOCOL");

        OtlpProtocol protocol = otlpProtocol?.ToLower() switch
        {
            "grpc" => OtlpProtocol.Grpc,
            "http/protobuf" => OtlpProtocol.HttpProtobuf,
            _ => OtlpProtocol.Grpc
        };
        
        builder.Logging.ClearProviders(); // Убираем другие провайдеры логирования

        // Настраиваем Serilog
        Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(builder.Configuration)
            .Enrich.FromLogContext()
            .WriteTo.OpenTelemetry(options =>
            {
                options.Endpoint = otlpEndpoint;
                options.Protocol = protocol;
            })
            .CreateLogger();

        // Используем Serilog как основной провайдер (это правильный способ)
        builder.Host.UseSerilog(Log.Logger, dispose: true);
        
        // Логируем конфигурацию OTLP для отладки
        Console.WriteLine($"📝 Logging OTLP Configuration:");
        Console.WriteLine($"   Endpoint: {otlpEndpoint}");
        Console.WriteLine($"   Protocol: {otlpProtocol}");
        Console.WriteLine($"   Providers: Serilog + OpenTelemetry");
    }

    /// <summary>
    /// Adds request logging middleware (minimal touch in Program.cs).
    /// </summary>
    public static IApplicationBuilder UseAppRequestLogging(this IApplicationBuilder app)
    {
        app.UseSerilogRequestLogging();
        return app;
    }
}