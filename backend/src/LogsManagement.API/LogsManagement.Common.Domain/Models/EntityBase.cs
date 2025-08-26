using LogsManagement.Common.Domain.Interfaces;

namespace LogsManagement.Common.Domain.Models;

public class BaseEntity : IEntity
{
    public Guid Id { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
