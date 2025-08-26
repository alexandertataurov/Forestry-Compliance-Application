using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public class CalculationConfiguration : IEntityTypeConfiguration<Calculation>
{
    public void Configure(EntityTypeBuilder<Calculation> builder)
    {
        builder.ToTable("Calculations");

        builder.ConfigureBaseEntity();

        builder.Property(x => x.Gost)
            .IsRequired();

        builder.Property(x => x.LogType)
            .IsRequired();

        // Configure relationship with Batches
        builder.HasMany(x => x.Batches)
            .WithOne()
            .HasForeignKey(x => x.CalculationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}