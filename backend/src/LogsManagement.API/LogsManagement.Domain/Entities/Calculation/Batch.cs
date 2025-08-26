using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation;

public sealed class Batch : BaseEntity
{
    public Guid? CalculationId { get; set; }

    #region Batch Info

    public required DateTime Date { get; set; }

    public required decimal LogLengthMeters { get; set; }

    public string? OperatorFullName { get; set; } // possible future use for user reference

    #endregion

    #region Transport Info

    public string? DriverFullName { get; set; } // possible future use for user reference

    public TransportType TransportType { get; set; }

    public required string TransportNumber { get; set; }

    #endregion

    #region Location Info

    public string? Forestry { get; set; } // nullable to allow for batches without a specific forestry reference

    public string? Quarter { get; set; } // nullable to allow for batches without a specific quarter reference

    //public Location? Location { get; set; } // nullable to allow for batches without a specific location

    #endregion

    public string? Description { get; set; }

    public List<LogEntry> LogEntries { get; set; } = [];
}
