using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Common.Infrastructure.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LogsManagement.Infrastructure.Persistence.Extensions
{
    public static class PersistenceServiceExtensions
    {
        public static IServiceCollection AddPersistenceServices(
            this IServiceCollection services,
            Action<DbContextOptionsBuilder> configureDb,
            int poolSize = 0)
        {
            if (poolSize > 0)
                services.AddPooledDbContextFactory<LogsManagementDbContext>(configureDb, poolSize);
            else
                services.AddDbContextFactory<LogsManagementDbContext>(configureDb);

            // UoW создаёт НОВЫЙ DbContext через IDbContextFactory<TContext>
            services.AddScoped<IUnitOfWorkFactory, EfUnitOfWorkFactory<LogsManagementDbContext>>();

            return services;
        }
    }
}
