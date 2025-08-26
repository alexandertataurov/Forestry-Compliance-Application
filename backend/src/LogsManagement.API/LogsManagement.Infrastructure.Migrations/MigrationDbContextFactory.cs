using LogsManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

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
            optionsBuilder.EnableSensitiveDataLogging()
                         .EnableDetailedErrors();
        }

        return new LogsManagementDbContext(optionsBuilder.Options);
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

        throw new InvalidOperationException("Не удалось найти appsettings.json");
    }

    private static bool HasAppsettings(string path) =>
        Directory.Exists(path) && File.Exists(Path.Combine(path, "appsettings.json"));

    private static string? FindSolutionDirectory(string startPath)
    {
        var current = new DirectoryInfo(startPath);
        while (current?.Parent != null)
        {
            if (current.GetFiles("*.sln").Any())
                return current.FullName;
            current = current.Parent;
        }
        return null;
    }
}
