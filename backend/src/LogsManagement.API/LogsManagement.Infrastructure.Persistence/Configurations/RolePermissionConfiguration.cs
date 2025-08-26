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
        builder.ToTable("role_permissions", t =>
        {
            // Optional: DB-level guard to prevent invalid values
            var allowed = string.Join(", ", Enum.GetNames<Permission>().Select(n => $"'{n}'"));
            t.HasCheckConstraint("ck_role_permissions_permission_valid", $"permission in ({allowed})");
        });

        builder.ConfigureBaseEntity();

        // Store enum as string (readable, migration-friendly)
        builder.Property(rp => rp.Permission)
            .HasConversion<string>()
            .HasMaxLength(100)
            .IsRequired();

        // Unique per role
        builder.HasIndex(rp => new { rp.RoleId, rp.Permission })
            .IsUnique();

        builder.HasOne(rp => rp.Role)
            .WithMany(r => r.RolePermissions)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}