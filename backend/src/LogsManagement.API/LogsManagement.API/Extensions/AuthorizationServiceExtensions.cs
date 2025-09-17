using LogsManagement.API.Authorization;
using LogsManagement.Common.Application.Services;
using LogsManagement.Common.Infrastructure.Services;
using LogsManagement.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace LogsManagement.API.Extensions;

public static class AuthorizationServiceExtensions
{
    public static IServiceCollection AddPermissionBasedAuthorization(this IServiceCollection services)
    {
        services.AddScoped<IPermissionService, PermissionService>();
        services.AddScoped<IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddMemoryCache();

        services.AddAuthorization(options =>
        {
            // Создаем политики для каждого разрешения
            foreach (Permission permission in Enum.GetValues<Permission>())
            {
                options.AddPolicy(permission.ToString(), policy =>
                    policy.Requirements.Add(new PermissionRequirement(permission)));
            }
        });

        return services;
    }
}