using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.Gost;

public sealed class GostStandard : TenantEntity
{
    // Уникальный код стандарта в рамках арендатора/системы (например, "GOST-2708-75")
    public required string Code { get; set; }

    // Человеко-читаемое имя (например, "ГОСТ 2708-75")
    public required string Name { get; set; }

    public string? Description { get; set; }

    // Системный (глобальный) стандарт, доступный всем
    public bool IsSystem { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<GostVolume> Rows { get; set; } = [];
}