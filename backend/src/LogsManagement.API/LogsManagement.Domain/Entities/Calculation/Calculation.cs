using LogsManagement.Common.Domain.Models;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Domain.Entities.Calculation
{
    public class Calculation : BaseEntity
    {
        public required Gost Gost { get; set; }

        public required LogType LogType { get; set; }

        public List<Batch> Batches { get; set; } = [];
    }
}
