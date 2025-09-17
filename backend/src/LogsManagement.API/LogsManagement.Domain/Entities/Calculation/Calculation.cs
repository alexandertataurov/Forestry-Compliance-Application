using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Entities.Gost;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation;

public class Calculation : TenantEntity
{
    public required Guid GostStandardId { get; set; }

    public required LogType LogType { get; set; }

    public List<Batch> Batches { get; set; } = [];

    public GostStandard? GostStandard { get; set; }
}
