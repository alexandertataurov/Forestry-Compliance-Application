using LogsManagement.Common.Application.Providers;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace LogsManagement.Common.Infrastructure.Providers;

/// <summary>
/// Реализация сервиса для работы с арендаторами
/// </summary>
public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    private const string TenantIdKey = "TenantId";
    private const string TenantIdClaim = "tenant_id";

    public TenantProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid? GetCurrentTenantId()
    {
        // 1. Сначала проверяем, не установлен ли TenantId вручную (для тестирования)
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.Items.ContainsKey(TenantIdKey) == true)
        {
            var manualTenantId = httpContext.Items[TenantIdKey] as Guid?;
            if (manualTenantId.HasValue)
            {
                return manualTenantId;
            }
        }

        // 2. Получаем из claims пользователя
        var user = GetCurrentUser();
        if (user?.Identity?.IsAuthenticated == true)
        {
            var tenantClaim = user.FindFirst(TenantIdClaim);
            if (tenantClaim != null && Guid.TryParse(tenantClaim.Value, out var tenantId))
            {
                return tenantId;
            }
        }

        return null;
    }

    public void SetCurrentTenantId(Guid? tenantId)
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
            if (tenantId.HasValue)
            {
                httpContext.Items[TenantIdKey] = tenantId.Value;
            }
            else
            {
                httpContext.Items.Remove(TenantIdKey);
            }
        }
    }

    public void ClearTenant()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        httpContext?.Items.Remove(TenantIdKey);
    }

    public bool BelongsToTenant(Guid tenantId)
    {
        var currentTenantId = GetCurrentTenantId();
        return currentTenantId.HasValue && currentTenantId.Value == tenantId;
    }

    public ClaimsPrincipal? GetCurrentUser()
    {
        return _httpContextAccessor.HttpContext?.User;
    }
}