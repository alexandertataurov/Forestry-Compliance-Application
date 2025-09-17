using LogsManagement.Domain.Entities.Gost;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public sealed class GostVolumeConfiguration : IEntityTypeConfiguration<GostVolume>
{
    public void Configure(EntityTypeBuilder<GostVolume> b)
    {
        b.ConfigureBaseEntity();

        b.Property(x => x.Length).HasColumnType("decimal(9,3)");
        b.Property(x => x.Diameter).HasColumnType("decimal(9,3)");
        b.Property(x => x.Volume).HasColumnType("decimal(18,6)");

        b.HasIndex(x => new { x.GostStandardId, x.Length, x.Diameter }).IsUnique();

        b.HasOne(x => x.GostStandard)
            .WithMany(s => s.Rows)
            .HasForeignKey(x => x.GostStandardId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}