using LogsManagement.Domain.Entities.User;

namespace LogsManagement.Common.Application.Models.Auth;

public sealed record AuthResponse(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt,
    UserInfo User);

public sealed record UserInfo(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    string? MiddleName,
    string RoleCode, // Changed from UserRole enum to string
    bool IsActive);