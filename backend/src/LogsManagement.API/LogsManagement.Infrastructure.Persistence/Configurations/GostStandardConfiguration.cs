using LogsManagement.Domain.Entities.Gost;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public sealed class GostStandardConfiguration : IEntityTypeConfiguration<GostStandard>
{
    public void Configure(EntityTypeBuilder<GostStandard> b)
    {
        b.ConfigureBaseEntity();

        b.Property(x => x.Code).IsRequired().HasMaxLength(128);
        b.Property(x => x.Name).IsRequired().HasMaxLength(256);
        b.Property(x => x.Description).HasMaxLength(1024);

        // Уникальный индекс на (TenantId, Code) — один и тот же код можно завести в разных тенантах
        b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();

        // Фильтрация по активности
        b.HasIndex(x => new { x.IsActive, x.IsSystem });
    }
}