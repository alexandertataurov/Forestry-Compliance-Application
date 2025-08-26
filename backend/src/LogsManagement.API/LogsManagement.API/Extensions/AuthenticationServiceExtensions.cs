using LogsManagement.Common.Application.Options;
using LogsManagement.Common.Application.Services;
using LogsManagement.Common.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

namespace LogsManagement.API.Extensions;

/// <summary>
/// Adds JWT authentication and authorization services.
/// </summary>
public static class AuthenticationServiceExtensions
{
    public static IServiceCollection AddAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtOptions>(configuration.GetSection("Jwt"));

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IPasswordHasher, PasswordHasher>();

        var jwt = configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
        var keyBytes = Encoding.UTF8.GetBytes(jwt.Key);
        var kid = Convert.ToHexString(SHA256.HashData(keyBytes))[..16];
        var key = new SymmetricSecurityKey(keyBytes) { KeyId = kid };

        // Fingerprint to verify same key between token issuer and validator
        var sha256 = Convert.ToHexString(SHA256.HashData(keyBytes));
        Console.WriteLine($"JWT key fingerprint (SHA256): {sha256[..16]}..., kid={kid}");

        // Enable detailed logs in Development only
        var envName = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        if (string.Equals(envName, "Development", StringComparison.OrdinalIgnoreCase))
        {
            IdentityModelEventSource.ShowPII = true;
        }

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.IncludeErrorDetails = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwt.Issuer,
                ValidAudience = jwt.Audience,
                IssuerSigningKey = key,
                ClockSkew = TimeSpan.FromMinutes(1),
                TryAllIssuerSigningKeys = true,
                ValidAlgorithms = [SecurityAlgorithms.HmacSha256]
            };
            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = ctx =>
                {
                    Console.WriteLine($"JWT auth failed: {ctx.Exception}");
                    return Task.CompletedTask;
                }
            };
        });

        services.AddAuthorization();
        return services;
    }
}