using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation;

public class LogEntry : TenantEntity
{
    public required Guid BatchId { get; set; }

    public Batch? Batch { get; set; }

    public required decimal Diameter { get; set; }
    
    public required decimal Length { get; set; }

    public required decimal Volume { get; set; }

    // Качество и классификация
    public required QualityGrade Quality { get; set; }
}
