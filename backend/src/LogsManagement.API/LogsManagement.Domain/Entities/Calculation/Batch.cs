using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation;

public sealed class Batch : TenantEntity
{
    public Guid? CalculationId { get; set; }

    #region Batch Info

    public required DateTime Date { get; set; }

    public required Guid OperatorId { get; set; } 

    /// <summary>
    /// 
    /// </summary>
    public User.User? Operator { get; set; }

    #endregion

    #region Transport Info

    public string? DriverFullName { get; set; }

    public required TransportType TransportType { get; set; }

    public required string TransportNumber { get; set; }

    #endregion

    #region Location Info

    public string? Forestry { get; set; } 

    public string? Quarter { get; set; }

    #endregion

    public string? Description { get; set; }

    public List<LogEntry> LogEntries { get; set; } = [];
}
