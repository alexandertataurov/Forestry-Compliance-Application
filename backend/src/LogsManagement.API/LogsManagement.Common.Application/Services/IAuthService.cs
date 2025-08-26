using LogsManagement.Common.Application.Models.Auth;

namespace LogsManagement.Common.Application.Services;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    
    Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    
    Task<AuthResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default);
    
    Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default);

    Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default);
}