using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.User;

/// <summary>
/// Роль пользователя с набором разрешений
/// </summary>
public class Role : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty; // Уникальный код роли
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsSystemRole { get; set; } = false; // Системные роли нельзя удалять

    // Связи
    public List<RolePermission> RolePermissions { get; set; } = [];
    public List<User> Users { get; set; } = [];
}