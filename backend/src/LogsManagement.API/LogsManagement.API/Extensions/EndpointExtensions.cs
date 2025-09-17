using LogsManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.API.Extensions;

/// <summary>
/// 
/// </summary>
public static class EndpointExtensions
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="app"></param>
    /// <returns></returns>
    public static WebApplication MapHealthEndpoints(this WebApplication app)
    {
        app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow }))
            .WithTags("Health")
            .WithSummary("Basic health check");

        app.MapGet("/health/database", async (IDbContextFactory<LogsManagementDbContext> contextFactory) =>
        {
            try
            {
                await using var context = await contextFactory.CreateDbContextAsync();
                var canConnect = await context.Database.CanConnectAsync();
                
                if (!canConnect) 
                    return Results.Problem("Cannot connect to database");

                var appliedMigrations = await context.Database.GetAppliedMigrationsAsync();
                var pendingMigrations = await context.Database.GetPendingMigrationsAsync();

                return Results.Ok(new
                {
                    DatabaseConnected = canConnect,
                    AppliedMigrations = appliedMigrations.Count(),
                    PendingMigrations = pendingMigrations.Count(),
                    LastAppliedMigration = appliedMigrations.LastOrDefault(),
                    PendingMigrationsList = pendingMigrations.ToArray(),
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return Results.Problem($"Database connection failed: {ex.Message}");
            }
        })
        .WithTags("Health")
        .WithSummary("Database health check with migration status");

        return app;
    }
}