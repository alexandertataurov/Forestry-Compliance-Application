using LogsManagement.Common.Domain.Interfaces;

namespace LogsManagement.Common.Domain.Models;

/// <summary>
/// Базовая сущность с поддержкой мультитенантности
/// </summary>
public abstract class TenantEntity : BaseEntity, ITenantEntity
{
    /// <summary>
    /// Идентификатор арендатора (компании)
    /// </summary>
    public Guid TenantId { get; set; }
}
