using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.Gost;

/// <summary>
/// Таблица объемов по ГОСТ для расчета объема круглых лесоматериалов
/// </summary>
public class GostVolume : BaseEntity
{
    public required Guid GostStandardId { get; set; }
    public GostStandard? GostStandard { get; set; }

    // Длина бревна (м)
    public required decimal Length { get; set; }

    // Диаметр (см)
    public required decimal Diameter { get; set; }

    // Объём по таблице (м³)
    public required decimal Volume { get; set; }

    public bool IsActive { get; set; } = true;
}