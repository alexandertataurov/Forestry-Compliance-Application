using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.User;

/// <summary>
/// Роль пользователя с набором разрешений
/// </summary>
public class Role : BaseEntity
{
    public required string Name { get; set; }
    
    public required string Code { get; set; } = string.Empty; // Уникальный код роли
    
    public string? Description { get; set; }
    
    public required bool IsActive { get; set; }

    public required bool IsSystemRole { get; set; } // Системные роли нельзя удалять

    // Связи
    public List<RolePermission> RolePermissions { get; set; } = [];

    public List<User> Users { get; set; } = [];
}