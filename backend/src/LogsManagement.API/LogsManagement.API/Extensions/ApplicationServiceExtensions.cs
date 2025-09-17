using LogsManagement.Application.Services;
using LogsManagement.Application.Services.Interfaces;
using LogsManagement.Common.Application.Providers;
using LogsManagement.Common.Infrastructure.Providers;

namespace LogsManagement.API.Extensions
{
    /// <summary>
    /// 
    /// </summary>
    public static class ApplicationServiceExtensions
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddAplicationServices(this IServiceCollection services)
        {
            services.AddTransient<ITenantProvider, TenantProvider>();

            // Только бизнес-сервисы приложения. UoW/репозитории уже регистрируются в Persistence.
            services.AddScoped<IVolumeCalculator, VolumeCalculator>();
            services.AddScoped<ICalculationService, CalculationService>();

            return services;
        }
    }
}
