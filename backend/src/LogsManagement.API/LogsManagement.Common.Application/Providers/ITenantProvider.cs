using System.Security.Claims;

namespace LogsManagement.Common.Application.Providers;

/// <summary>
/// Сервис для работы с текущим арендатором
/// </summary>
public interface ITenantProvider
{
    /// <summary>
    /// Получить ID текущего арендатора из claims пользователя
    /// </summary>
    Guid? GetCurrentTenantId();
    
    /// <summary>
    /// Установить ID текущего арендатора (для тестирования)
    /// </summary>
    void SetCurrentTenantId(Guid? tenantId);
    
    /// <summary>
    /// Очистить контекст арендатора
    /// </summary>
    void ClearTenant();
    
    /// <summary>
    /// Проверить, принадлежит ли пользователь указанному арендатору
    /// </summary>
    bool BelongsToTenant(Guid tenantId);
    
    /// <summary>
    /// Получить текущего пользователя
    /// </summary>
    ClaimsPrincipal? GetCurrentUser();
}
