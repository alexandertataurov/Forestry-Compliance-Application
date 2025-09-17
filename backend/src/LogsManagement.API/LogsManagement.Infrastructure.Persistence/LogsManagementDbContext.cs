using LogsManagement.Common.Application.Providers;
using LogsManagement.Common.Domain.Interfaces;
using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Domain.Entities.Gost;
using LogsManagement.Domain.Entities.Tenant;
using LogsManagement.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Reflection;

namespace LogsManagement.Infrastructure.Persistence
{
    public class LogsManagementDbContext : DbContext
    {
        private readonly ITenantProvider _tenantProvider;

        public LogsManagementDbContext(
            DbContextOptions<LogsManagementDbContext> options,
            ITenantProvider tenantService) : base(options)
        {
            _tenantProvider = tenantService;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            modelBuilder.HasDefaultSchema("logs");

            // Применяем Global Query Filter только для TenantEntity
            ApplyGlobalQueryFilters(modelBuilder);
        }

        /// <summary>
        /// Применяет глобальные фильтры запросов для мультитенантности
        /// </summary>
        private void ApplyGlobalQueryFilters(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // Проверяем, наследуется ли сущность от TenantEntity
                if (typeof(TenantEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var method = typeof(LogsManagementDbContext)
                        .GetMethod(nameof(GetTenantFilter), BindingFlags.NonPublic | BindingFlags.Static)
                        ?.MakeGenericMethod(entityType.ClrType);

                    if (method?.Invoke(null, [this]) is LambdaExpression filter)
                    {
                        entityType.SetQueryFilter(filter);
                    }
                }
            }
        }

        /// <summary>
        /// Создает фильтр по TenantId для TenantEntity
        /// </summary>
        private static LambdaExpression GetTenantFilter<TEntity>(LogsManagementDbContext context)
            where TEntity : TenantEntity
        {
            Expression<Func<TEntity, bool>> filter = entity =>
                context._tenantProvider.GetCurrentTenantId() == null
                || entity.TenantId == context._tenantProvider.GetCurrentTenantId()
                || entity.TenantId == Guid.Empty;

            return filter;
        }

        // User Entities
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        // Calculation Entities  
        public DbSet<Calculation> Calculations { get; set; }
        public DbSet<Batch> Batches { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }

        // Gost Data
        public DbSet<GostStandard> GostStandards { get; set; }
        public DbSet<GostVolume> GostVolumes { get; set; }


        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Устанавливаем метаданные для всех IEntity
            foreach (var entry in ChangeTracker.Entries<IEntity>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        break;
                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        break;
                }
            }

            // Устанавливаем TenantId только для TenantEntity
            var currentTenantId = _tenantProvider.GetCurrentTenantId();
            
            foreach (var entry in ChangeTracker.Entries<TenantEntity>())
            {
                if (entry.State == EntityState.Added)
                {
                    // Устанавливаем TenantId если он не задан и есть текущий tenant
                    if (entry.Entity.TenantId == Guid.Empty && currentTenantId.HasValue)
                    {
                        entry.Entity.TenantId = currentTenantId.Value;
                    }
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
