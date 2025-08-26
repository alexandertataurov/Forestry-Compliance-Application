using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace LogsManagement.Infrastructure.Persistence
{
    public sealed class LogsManagementDbContext(DbContextOptions<LogsManagementDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configure entity mappings here if needed

            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

            // Set default schema
            modelBuilder.HasDefaultSchema("logs");
        }

        public DbSet<Calculation> Calculations { get; set; }
        
        public DbSet<Batch> Batches { get; set; }

        public DbSet<LogEntry> LogEntries { get; set; }

        public DbSet<User> Users { get; set; }


        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Update audit fields before saving
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is BaseEntity entity)
                {
                    if (entry.State == EntityState.Added)
                    {
                        entity.CreatedAt = DateTime.UtcNow;
                        entity.UpdatedAt = DateTime.UtcNow;
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        entity.UpdatedAt = DateTime.UtcNow;
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
