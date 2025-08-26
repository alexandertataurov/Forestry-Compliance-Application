using LogsManagement.Common.Domain.Models;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Extensions
{
    public static class ModelBuilderExtensions
    {
        public static void ConfigureBaseEntity<TEntity>(this EntityTypeBuilder<TEntity> builder)
            where TEntity : BaseEntity
        {
            // Настройка базовых свойств для всех сущностей
            builder.HasKey(e => e.Id);

            builder.Property(e => e.CreatedAt)
                .IsRequired(false);

            builder.Property(e => e.UpdatedAt)
                .IsRequired(false);

            builder.Property(e => e.CreatedBy)
                .IsRequired(false);

            builder.Property(e => e.UpdatedBy)
                .IsRequired(false);
        }
    }
}
