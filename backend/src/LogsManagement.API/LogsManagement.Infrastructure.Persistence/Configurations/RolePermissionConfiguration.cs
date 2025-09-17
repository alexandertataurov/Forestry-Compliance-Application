using LogsManagement.Domain.Entities.User;
using LogsManagement.Domain.Enums;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public sealed class RolePermissionConfiguration : IEntityTypeConfiguration<RolePermission>
{
    public void Configure(EntityTypeBuilder<RolePermission> builder)
    {
        builder.ConfigureBaseEntity();

        builder.Property(rp => rp.Permission)
            .HasConversion<string>()
            .HasMaxLength(100)
            .IsRequired();

        builder.HasIndex(rp => new { rp.RoleId, rp.Permission })
            .IsUnique();

        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}