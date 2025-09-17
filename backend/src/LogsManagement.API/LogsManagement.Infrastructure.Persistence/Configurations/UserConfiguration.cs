using LogsManagement.Domain.Entities.User;
using LogsManagement.Infrastructure.Persistence.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Ключи и индексы
        builder.HasKey(u => u.Id);

        builder.ConfigureBaseEntity();
        builder.ConfigureTenantEntity();

        // Уникальные ограничения
        builder.HasIndex(u => u.Email)
            .IsUnique();

        // Составной индекс для мультитенантности
        builder.HasIndex(u => new { u.TenantId, u.Email })
            .IsUnique();
            
        // Индекс для производительности
        builder.HasIndex(u => u.TenantId);
            
        builder.HasIndex(u => u.RoleId);
        
        // Свойства
        builder.Property(u => u.Email)
            .HasMaxLength(256)
            .IsRequired();
            
        builder.Property(u => u.FirstName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(u => u.LastName)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(u => u.MiddleName)
            .HasMaxLength(100);
            
        builder.Property(u => u.PasswordHash)
            .HasMaxLength(256)
            .IsRequired();
            
        builder.Property(u => u.RefreshToken)
            .HasMaxLength(500);
        
        // Связи
        builder.HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Игнорируем вычисляемое свойство
        builder.Ignore(u => u.FullName);
    }
}