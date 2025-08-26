using LogsManagement.Common.Application.Models.Auth;
using LogsManagement.Common.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace LogsManagement.API.Controllers;

/// <summary>
/// Authentication and authorization controller
/// </summary>
/// <param name="authService">Authentication service</param>
[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>
    /// Вход в систему
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await authService.LoginAsync(request);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Регистрация нового пользователя
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var response = await authService.RegisterAsync(request);
            return CreatedAtAction(nameof(Register), response);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Обновление токена доступа
    /// </summary>
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var response = await authService.RefreshTokenAsync(request.RefreshToken);
            return Ok(response);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Выход из системы
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
        {
            await authService.LogoutAsync(userId);
        }

        return Ok(new { message = "Успешный выход из системы" });
    }

    /// <summary>
    /// Получение информации о текущем пользователе
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        // Group claims by type and handle multiple permission claims
        var claimsGroups = User.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(
                g => g.Key,
                g => g.Count() == 1 ? (object)g.First().Value : g.Select(c => c.Value).ToArray()
            );

        return Ok(new
        {
            id = claimsGroups.GetValueOrDefault(ClaimTypes.NameIdentifier),
            email = claimsGroups.GetValueOrDefault(ClaimTypes.Email),
            firstName = claimsGroups.GetValueOrDefault(ClaimTypes.GivenName),
            lastName = claimsGroups.GetValueOrDefault(ClaimTypes.Surname),
            role = claimsGroups.GetValueOrDefault(ClaimTypes.Role),
            roleName = claimsGroups.GetValueOrDefault("RoleName"),
            isActive = claimsGroups.GetValueOrDefault("IsActive"),
            permissions = claimsGroups.GetValueOrDefault("permission") // will be string[] if multiple, string if single
        });
    }
}

/// <summary>
/// Refresh token request model
/// </summary>
/// <param name="RefreshToken">The refresh token</param>
public sealed record RefreshTokenRequest(string RefreshToken);