using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations
{
    public sealed class BatchConfiguration : IEntityTypeConfiguration<Batch>
    {
        public void Configure(EntityTypeBuilder<Batch> builder)
        {
            builder.ConfigureBaseEntity();
            builder.ConfigureTenantEntity();

            builder.Property(x => x.TransportNumber)
                   .HasMaxLength(64)
                   .IsRequired();

            builder.Property(x => x.DriverFullName).HasMaxLength(256);
            builder.Property(x => x.Forestry).HasMaxLength(256);
            builder.Property(x => x.Quarter).HasMaxLength(64);
            builder.Property(x => x.Description).HasMaxLength(1024);

            builder.Property(rp => rp.TransportType)
                .HasConversion<string>()
                .HasMaxLength(50)
                .IsRequired();

            // Связь с оператором (пользователь)
            builder.HasOne(x => x.Operator)
                   .WithMany()
                   .HasForeignKey(x => x.OperatorId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Индексы
            builder.HasIndex(x => new { x.TenantId, x.CalculationId });
            builder.HasIndex(x => new { x.TenantId, x.Date });
        }
    }
}
