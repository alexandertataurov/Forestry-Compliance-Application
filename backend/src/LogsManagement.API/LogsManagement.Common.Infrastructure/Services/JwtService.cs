using LogsManagement.Common.Application.Options;
using LogsManagement.Common.Application.Services;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace LogsManagement.Common.Infrastructure.Services;

public sealed class JwtService : IJwtService
{
    private readonly JwtSecurityTokenHandler _tokenHandler;
    private readonly JwtOptions _options;

    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    public string GenerateAccessToken(IEnumerable<Claim> claims)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.Key);
        var kid = Convert.ToHexString(SHA256.HashData(keyBytes))[..16];
        var signingKey = new SymmetricSecurityKey(keyBytes) { KeyId = kid };

        var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes),
            signingCredentials: credentials);

        return _tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.Key);
        var kid = Convert.ToHexString(SHA256.HashData(keyBytes))[..16];
        var signingKey = new SymmetricSecurityKey(keyBytes) { KeyId = kid };

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = false,
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.Zero,
            TryAllIssuerSigningKeys = true,
            ValidAlgorithms = [SecurityAlgorithms.HmacSha256]
        };

        try
        {
            var principal = _tokenHandler.ValidateToken(token, tokenValidationParameters, out var validatedToken);
            if (validatedToken is not JwtSecurityToken jwtToken ||
                !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                return null;
            }
            return principal;
        }
        catch
        {
            return null;
        }
    }

    public bool ValidateToken(string token)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_options.Key);
        var kid = Convert.ToHexString(SHA256.HashData(keyBytes))[..16];
        var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes) { KeyId = kid };

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = _options.Issuer,
            ValidAudience = _options.Audience,
            IssuerSigningKey = symmetricSecurityKey,
            ClockSkew = TimeSpan.Zero,
            TryAllIssuerSigningKeys = true,
            ValidAlgorithms = [SecurityAlgorithms.HmacSha256]
        };

        try
        {
            _tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
            return true;
        }
        catch
        {
            return false;
        }
    }
}