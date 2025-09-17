using LogsManagement.Domain.Enums;

namespace LogsManagement.Application.Services.Models
{
    public sealed class BatchCreateModel
    {
        public required DateTime Date { get; set; }
        public required Guid OperatorId { get; set; }

        // Transport
        public string? DriverFullName { get; set; }
        public required TransportType TransportType { get; set; }
        public required string TransportNumber { get; set; }

        // Location
        public string? Forestry { get; set; }
        public string? Quarter { get; set; }

        public string? Description { get; set; }

        public required List<LogCreateModel> Logs { get; set; } = new();
    }

    public sealed class LogCreateModel
    {
        public required decimal Diameter { get; set; } // см
        
        public required decimal Length { get; set; }   // м

        public required QualityGrade Quality { get; set; }
    }
}