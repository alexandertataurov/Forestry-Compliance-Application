using LogsManagement.Common.Application.Providers;
using LogsManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace LogsManagement.Infrastructure.Migrations;

public sealed class MigrationDbContextFactory : IDesignTimeDbContextFactory<LogsManagementDbContext>
{
    public LogsManagementDbContext CreateDbContext(string[] args)
    {
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
        var configurationPath = FindConfigurationPath();
        var configuration = BuildConfiguration(configurationPath, environment);
        var connectionString = GetConnectionString(configuration);

        var optionsBuilder = new DbContextOptionsBuilder<LogsManagementDbContext>()
            .UseNpgsql(connectionString, ConfigureNpgsql)
            .UseSnakeCaseNamingConvention();

        if (environment == "Development")
        {
            optionsBuilder
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors();
        }

        // Создаем фиктивный ITenantService для миграций
        var tenantProvider = new NullTenantProvider();

        return new LogsManagementDbContext(optionsBuilder.Options, tenantProvider);
    }

    private static void ConfigureNpgsql(Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure.NpgsqlDbContextOptionsBuilder npgsqlOptions)
    {
        npgsqlOptions.MigrationsAssembly(typeof(MigrationDbContextFactory).Assembly.GetName().Name);
        npgsqlOptions.CommandTimeout(60);
        npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "logs");
        npgsqlOptions.EnableRetryOnFailure(3);
    }

    private static IConfiguration BuildConfiguration(string basePath, string environment)
    {
        return new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{environment}.json", optional: true, reloadOnChange: true)
            .AddEnvironmentVariables("LOGSMANAGEMENT_")
            .Build();
    }

    private static string GetConnectionString(IConfiguration configuration)
    {
        return configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("DefaultConnection не найдена в конфигурации");
    }

    private static string FindConfigurationPath()
    {
        var currentDirectory = Directory.GetCurrentDirectory();
        
        if (HasAppsettings(currentDirectory))
            return currentDirectory;

        var apiPath = Path.GetFullPath(Path.Combine(currentDirectory, "..", "LogsManagement.API"));
        if (HasAppsettings(apiPath))
            return apiPath;

        var binPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", ".."));
        if (HasAppsettings(binPath))
            return binPath;

        var solutionPath = FindSolutionDirectory(currentDirectory);
        if (solutionPath != null)
        {
            var webApiPath = Path.Combine(solutionPath, "LogsManagement.API");
            if (HasAppsettings(webApiPath))
                return webApiPath;
        }

        throw new InvalidOperationException("Не удалось найти файл appsettings.json");
    }

    private static bool HasAppsettings(string path)
    {
        return File.Exists(Path.Combine(path, "appsettings.json"));
    }

    private static string? FindSolutionDirectory(string currentDirectory)
    {
        var directory = new DirectoryInfo(currentDirectory);
        
        while (directory != null)
        {
            if (directory.GetFiles("*.sln").Length > 0)
                return directory.FullName;
                
            directory = directory.Parent;
        }
        
        return null;
    }
}

/// <summary>
/// Null implementation для миграций
/// </summary>
internal class NullTenantProvider : ITenantProvider
{
    public bool BelongsToTenant(Guid tenantId)
    {
        return false;
    }

    public void ClearTenant()
    {
    }

    public Guid? GetCurrentTenantId() => null;

    public ClaimsPrincipal? GetCurrentUser()
    {
        throw new NotImplementedException();
    }

    public void SetCurrentTenantId(Guid? tenantId) { }
}
