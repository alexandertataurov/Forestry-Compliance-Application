using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Application.Services;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Domain.Entities.User;
using LogsManagement.Domain.Enums;
using Microsoft.Extensions.Caching.Memory;
using System.Reflection;

namespace LogsManagement.Common.Infrastructure.Services;

public class PermissionService : IPermissionService
{
    private readonly IUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IMemoryCache _cache;
    private static readonly Dictionary<Permission, string> _permissionCodes = GetPermissionCodes();

    public PermissionService(IUnitOfWorkFactory unitOfWorkFactory, IMemoryCache cache)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _cache = cache;
    }

    public async Task<IEnumerable<Permission>> GetUserPermissionsAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"user_permissions_{userId}";
        
        if (_cache.TryGetValue(cacheKey, out IEnumerable<Permission>? cachedPermissions))
            return cachedPermissions!;

        await using var uow = await _unitOfWorkFactory.CreateAsync(cancellationToken);
        var userRepo = uow.GetRepository<User>();

        // Создаем спецификацию для поиска пользователя
        var userSpec = new Specification<User>(u => u.Id == userId && u.IsActive);

        // Создаем LoadStrategy для включения Role и RolePermissions
        var loadStrategy = new LoadStrategy<User>()
            .Include(u => u.Role)
            .ThenMany(r => r.RolePermissions)
            .Done();

        var user = await userRepo.FirstOrDefaultAsync(
            userSpec, 
            loadStrategy, 
            ct: cancellationToken);

        var permissions = user?.Role?.RolePermissions
            ?.Select(rp => rp.Permission)
            ?.ToList() ?? [];

        _cache.Set(cacheKey, permissions, TimeSpan.FromMinutes(15));
        return permissions;
    }

    public async Task<bool> HasPermissionAsync(Guid userId, Permission permission, CancellationToken cancellationToken = default)
    {
        var permissions = await GetUserPermissionsAsync(userId, cancellationToken);
        return permissions.Contains(permission);
    }

    public async Task<bool> HasPermissionAsync(Guid userId, string permissionCode, CancellationToken cancellationToken = default)
    {
        var permission = _permissionCodes.FirstOrDefault(p => p.Value == permissionCode).Key;
        if (permission == default) return false;
        
        return await HasPermissionAsync(userId, permission, cancellationToken);
    }

    public async Task<IEnumerable<string>> GetUserPermissionCodesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var permissions = await GetUserPermissionsAsync(userId, cancellationToken);
        return permissions.Select(p => _permissionCodes.TryGetValue(p, out var code) ? code : p.ToString().ToLowerInvariant());
    }

    private static Dictionary<Permission, string> GetPermissionCodes()
    {
        var result = new Dictionary<Permission, string>();
        var fields = typeof(Permission).GetFields(BindingFlags.Public | BindingFlags.Static);

        foreach (var field in fields)
        {
            if (field.GetValue(null) is Permission permission)
            {
                var attr = field.GetCustomAttribute<PermissionMetadataAttribute>();
                result[permission] = attr?.Code ?? permission.ToString().ToLowerInvariant();
            }
        }

        return result;
    }
}