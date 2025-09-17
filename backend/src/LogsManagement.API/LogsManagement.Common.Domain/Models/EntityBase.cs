using LogsManagement.Common.Domain.Interfaces;

namespace LogsManagement.Common.Domain.Models;

/// <summary>
/// Базовая сущность (без обязательной мультитенантности)
/// </summary>
public abstract class BaseEntity : IEntity
{
    public Guid Id { get; set; }

    public Guid? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public Guid? UpdatedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
