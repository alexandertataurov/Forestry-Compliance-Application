using LogsManagement.Domain.Enums;
using Microsoft.AspNetCore.Authorization;

namespace LogsManagement.API.Authorization;

/// <summary>
/// Атрибут для проверки разрешений
/// </summary>
public class RequirePermissionAttribute : AuthorizeAttribute
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="permission"></param>
    public RequirePermissionAttribute(Permission permission) : base(permission.ToString())
    {
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="permissions"></param>
    public RequirePermissionAttribute(params Permission[] permissions) 
        : base(string.Join(",", permissions.Select(p => p.ToString())))
    {
    }
}