using LogsManagement.Domain.Entities.User;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LogsManagement.Infrastructure.Persistence.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        // Ключи и индексы
        builder.HasKey(r => r.Id);
        
        // Уникальные ограничения
        builder.HasIndex(r => r.Code)
            .IsUnique();
            
        builder.HasIndex(r => r.Name)
            .IsUnique();
        
        // Свойства
        builder.Property(r => r.Name)
            .HasMaxLength(100)
            .IsRequired();
            
        builder.Property(r => r.Code)
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(r => r.Description)
            .HasMaxLength(500);
        
        // Связи
        builder.HasMany(r => r.RolePermissions)
            .WithOne(rp => rp.Role)
            .HasForeignKey(rp => rp.RoleId)
            .OnDelete(DeleteBehavior.Cascade);
            
        builder.HasMany(r => r.Users)
            .WithOne(u => u.Role)
            .HasForeignKey(u => u.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}