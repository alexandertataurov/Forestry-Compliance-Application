using System.Security.Claims;

namespace LogsManagement.Common.Application.Services;

public interface IJwtService
{
    string GenerateAccessToken(IEnumerable<Claim> claims);

    string GenerateRefreshToken();

    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);

    bool ValidateToken(string token);
}