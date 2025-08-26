using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation;

public class LogEntry : BaseEntity
{
    public Guid? BatchId { get; set; }

    // Основные измерения
    public decimal Diameter { get; set; }
    public decimal Length { get; set; }

    // Качество и классификация
    public QualityGrade Quality { get; set; }
}
