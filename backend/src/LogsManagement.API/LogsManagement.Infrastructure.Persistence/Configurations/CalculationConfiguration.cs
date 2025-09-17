using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public class CalculationConfiguration : IEntityTypeConfiguration<Calculation>
{
    public void Configure(EntityTypeBuilder<Calculation> builder)
    {
        builder.ConfigureBaseEntity();
        builder.ConfigureTenantEntity();

        builder.Property(rp => rp.LogType)
            .HasConversion<string>()
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.GostStandardId).IsRequired();

        builder.HasOne(x => x.GostStandard)
            .WithMany()
            .HasForeignKey(x => x.GostStandardId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(x => x.Batches)
            .WithOne()
            .HasForeignKey(x => x.CalculationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}