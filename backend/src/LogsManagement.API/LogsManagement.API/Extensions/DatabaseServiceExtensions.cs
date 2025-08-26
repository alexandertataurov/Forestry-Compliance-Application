using LogsManagement.Infrastructure.Persistence;
using LogsManagement.Infrastructure.Persistence.Extensions;
using LogsManagement.Infrastructure.Persistence.Seeders;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.API.Extensions;

/// <summary>
/// Database and Entity Framework configuration extensions.
/// No longer dependent on Aspire connection string resolution.
/// </summary>
public static class DatabaseServiceExtensions
{
    /// <summary>
    /// Adds database services and configures Entity Framework.
    /// Uses standard .NET configuration without Aspire.
    /// </summary>
    public static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration, ILogger logger)
    {
        var connectionString = ResolveConnectionString(configuration, logger);

        services.AddPersistenceServices(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly("LogsManagement.Infrastructure.Migrations");
                npgsqlOptions.CommandTimeout(60);
                npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "logs");
                npgsqlOptions.EnableRetryOnFailure(15, TimeSpan.FromSeconds(5), null);
            })
            .UseSnakeCaseNamingConvention();

            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production";
            if (environment == "Development")
            {
                //options.EnableSensitiveDataLogging();
                //options.EnableDetailedErrors();
            }
        });

        // Health check for PostgreSQL
        services.AddHealthChecks()
            .AddNpgSql(connectionString, name: "postgres", tags: ["db", "postgres"], timeout: TimeSpan.FromSeconds(30));

        return services;
    }

    /// <summary>
    /// Resolves connection string from standard .NET configuration.
    /// TODO: Remove Aspire-specific keys when migration is complete.
    /// </summary>
    private static string ResolveConnectionString(IConfiguration configuration, ILogger logger)
    {
        var candidates = new[]
        {
            "DefaultConnection",   // Standard .NET convention
            "logs-management",     // TODO: REMOVE - Legacy Aspire DB resource key
            "postgres"            // TODO: REMOVE - Legacy Aspire server resource key
        };

        foreach (var key in candidates)
        {
            var connectionString = configuration.GetConnectionString(key);
            if (!string.IsNullOrWhiteSpace(connectionString))
            {
                logger.LogInformation("🔗 Using connection string from key: {Key}", key);
                logger.LogInformation("🔗 Connection: {MaskedConnection}", MaskPassword(connectionString));
                return connectionString;
            }
        }

        const string fallback = "Host=localhost;Port=5433;Database=logs_management;Username=postgres;Password=password123";
        logger.LogWarning("⚠️ No configured connection string found. Falling back to: {Fallback}", MaskPassword(fallback));
        return fallback;
    }

    /// <summary>
    /// Masks password in connection string for safe logging
    /// </summary>
    private static string MaskPassword(string connectionString)
    {
        return connectionString.Replace("Password=password123", "Password=***");
    }

    /// <summary>
    /// Applies database migrations and performs initial data seeding
    /// </summary>
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        const int maxRetries = 30;
        const int delayMs = 2000;

        app.Logger.LogInformation("🔄 Waiting for PostgreSQL...");

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            try
            {
                using var scope = app.Services.CreateScope();
                var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<LogsManagementDbContext>>();
                await using var context = await contextFactory.CreateDbContextAsync();

                if (!await context.Database.CanConnectAsync())
                    throw new InvalidOperationException("Cannot connect to database");

                var pendingMigrations = await context.Database.GetPendingMigrationsAsync();
                if (pendingMigrations.Any())
                {
                    app.Logger.LogInformation("📊 Applying {Count} migrations", pendingMigrations.Count());
                    await context.Database.MigrateAsync();
                    app.Logger.LogInformation("✅ Migrations applied");
                }
                else
                {
                    app.Logger.LogInformation("✅ Database is up-to-date");
                }

                // Initialize seed data
                app.Logger.LogInformation("🌱 Seeding initial data...");
                await DatabaseSeeder.SeedAsync(context, scope.ServiceProvider);
                app.Logger.LogInformation("✅ Initial data seeded");

                return;
            }
            catch (Exception ex)
            {
                app.Logger.LogWarning("❌ Attempt {Attempt}/{MaxRetries}: {Error}", attempt, maxRetries, ex.Message);
                if (attempt == maxRetries)
                {
                    app.Logger.LogError("🚨 Could not connect to PostgreSQL after {MaxRetries} attempts", maxRetries);
                    return;
                }
                await Task.Delay(delayMs);
            }
        }
    }
}