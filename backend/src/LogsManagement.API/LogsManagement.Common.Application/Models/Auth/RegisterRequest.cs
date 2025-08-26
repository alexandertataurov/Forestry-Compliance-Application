using LogsManagement.Domain.Entities.User;

namespace LogsManagement.Common.Application.Models.Auth;

public sealed record RegisterRequest(
    string Email,
    string FirstName,
    string LastName,
    string? MiddleName,
    string Password,
    string RoleCode = "field_worker"); // Default role code