using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.User;

public class User : TenantEntity
{
    // Основная информация
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    
    // Аутентификация
    public string PasswordHash { get; set; } = string.Empty;
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    
    // Роли и права доступа
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = null!;
    
    public bool IsActive { get; set; } = true;
    public DateTime? LastLoginAt { get; set; }

    // Вычисляемое свойство для получения полного имени
    public string FullName => $"{LastName} {FirstName} {MiddleName}".Trim();
}
