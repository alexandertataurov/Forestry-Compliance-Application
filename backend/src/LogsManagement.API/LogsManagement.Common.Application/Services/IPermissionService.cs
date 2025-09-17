using LogsManagement.Domain.Enums;

namespace LogsManagement.Common.Application.Services;

public interface IPermissionService
{
    Task<IEnumerable<Permission>> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<bool> HasPermissionAsync(Guid userId, Permission permission, CancellationToken cancellationToken = default);
    Task<bool> HasPermissionAsync(Guid userId, string permissionCode, CancellationToken cancellationToken = default);
    Task<IEnumerable<string>> GetUserPermissionCodesAsync(Guid userId, CancellationToken cancellationToken = default);
}