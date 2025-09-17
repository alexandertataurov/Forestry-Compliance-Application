using LogsManagement.Domain.Entities.Tenant;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public class TenantConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        // Ключи и индексы
        builder.HasKey(t => t.Id);
        
        // Уникальные ограничения
        builder.HasIndex(t => t.Name)
            .IsUnique();
            
        builder.HasIndex(t => t.Inn)
            .IsUnique();
        
        // Свойства
        builder.Property(t => t.Name)
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(t => t.DisplayName)
            .HasMaxLength(200)
            .IsRequired();
            
        builder.Property(t => t.Inn)
            .HasMaxLength(12)
            .IsRequired();
            
        builder.Property(t => t.ContactEmail)
            .HasMaxLength(255);
            
        builder.Property(t => t.ContactPhone)
            .HasMaxLength(20);
        
        // Связи
        builder.HasMany(t => t.Users)
            .WithOne()
            .HasForeignKey(u => u.TenantId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}