using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public sealed class LogEntryConfiguration : IEntityTypeConfiguration<LogEntry>
{
    public void Configure(EntityTypeBuilder<LogEntry> builder)
    {
        builder.ConfigureBaseEntity();
        builder.ConfigureTenantEntity();

        builder.HasOne(e => e.Batch)
               .WithMany(b => b.LogEntries)
               .HasForeignKey(e => e.BatchId)
               .OnDelete(DeleteBehavior.Cascade)
               .IsRequired();

        builder.Property(x => x.Diameter).HasPrecision(9, 3).IsRequired(); // см
        builder.Property(x => x.Length).HasPrecision(9, 3).IsRequired();   // м
        builder.Property(x => x.Volume).HasPrecision(18, 3).IsRequired();  // м³

        builder.HasIndex(x => new { x.TenantId, x.BatchId });
    }
}