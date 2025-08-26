using Microsoft.Extensions.DependencyInjection;

namespace LogsManagement.Common.Infrastructure.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, string connectionString)
    {
        return services;
    }
}
