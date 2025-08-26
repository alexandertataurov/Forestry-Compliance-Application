using LogsManagement.API.Extensions;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Logging configuration
builder.ConfigureSerilogLogging();

// OpenTelemetry configuration (replaces deprecated Aspire ServiceDefaults)
builder.Services.AddAppTelemetry(
    builder.Environment.ApplicationName,
    builder.Environment.EnvironmentName);

// HTTP client configuration (replaces Aspire resilience and service discovery)
builder.Services.AddHttpClient();

// Use Serilog logger for startup logs
var logger = LoggerFactory.Create(b => b.AddSerilog()).CreateLogger("Startup");

builder.Services.AddDatabase(builder.Configuration, logger);
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithJwt();

var app = builder.Build();

if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Docker")
{
    await app.ApplyMigrationsAsync();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAppRequestLogging();

// Enable HTTPS redirection only when not running in Docker environment
if (!app.Environment.IsEnvironment("Docker"))
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Use custom health endpoints (replaces Aspire MapDefaultEndpoints)
app.MapHealthEndpoints();

app.Run();
