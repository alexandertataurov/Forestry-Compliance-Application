using LogsManagement.Common.Infrastructure.Parsers.Attributes;

namespace LogsManagement.Common.Infrastructure.Parsers.Models;

/// <summary>
/// DTO для импорта таблицы объемов ГОСТ из CSV
/// </summary>
public class GostVolumeDto
{
    [Column("Length", IsRequired = true)]
    public decimal Length { get; set; }

    [Column("Diameter", IsRequired = true)]
    public decimal Diameter { get; set; }

    [Column("Volume", IsRequired = true)]
    public decimal Volume { get; set; }
}