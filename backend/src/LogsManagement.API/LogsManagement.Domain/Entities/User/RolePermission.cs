using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.User;

/// <summary>
/// Связь роли с разрешением
/// </summary>
public class RolePermission : BaseEntity
{
    public Guid RoleId { get; set; }

    public Permission Permission { get; set; }

    // Навигационные свойства
    public Role Role { get; set; } = null!;
}