using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Application.Models.Auth;
using LogsManagement.Common.Application.Services;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Domain.Entities.User;
using Microsoft.Extensions.Logging;
using System.Security.Claims;

namespace LogsManagement.Common.Infrastructure.Services;

public sealed class AuthService : IAuthService
{
    private readonly IUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IJwtService _jwtService;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        IUnitOfWorkFactory unitOfWorkFactory,
        IJwtService jwtService,
        IPasswordHasher passwordHasher,
        ILogger<AuthService> logger)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _jwtService = jwtService;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        await using var uow = await _unitOfWorkFactory.CreateAsync(cancellationToken);
        var userRepository = uow.GetRepository<User>();

        var strategy = new Specification<User>(
            u => u.Email == request.Email && u.IsActive);

        // Include Role for permission checks
        var loadStrategy = new LoadStrategy<User>()
            .Include(u => u.Role)
            .ThenMany(r => r.RolePermissions)
            .Done();

        var user = await userRepository.FirstOrDefaultAsync(strategy, loadStrategy, ct: cancellationToken);

        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
            throw new UnauthorizedAccessException("Неверный email или пароль");
        }

        var (accessToken, refreshToken) = GenerateTokens(user);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;

        await uow.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} logged in successfully", user.Id);

        return new AuthResponse(
            accessToken,
            refreshToken,
            DateTime.UtcNow.AddHours(1),
            MapToUserInfo(user));
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        await using var uow = await _unitOfWorkFactory.CreateAsync(cancellationToken);
        var userRepository = uow.GetRepository<User>();
        var roleRepository = uow.GetRepository<Role>();

        var strategy = new Specification<User>(u => u.Email == request.Email);
        var existingUser = await userRepository.FirstOrDefaultAsync(strategy, ct: cancellationToken);

        if (existingUser != null)
        {
            throw new InvalidOperationException("Пользователь с таким email уже существует");
        }

        // Get default role or the specified role
        var roleStrategy = new Specification<Role>(r => r.Code == request.RoleCode && r.IsActive);
        var role = await roleRepository.FirstOrDefaultAsync(roleStrategy, ct: cancellationToken);

        if (role == null)
        {
            // Use default role if not specified
            roleStrategy = new Specification<Role>(r => r.Code == "field_worker" && r.IsActive);
            role = await roleRepository.FirstOrDefaultAsync(roleStrategy, ct: cancellationToken);
        }

        if (role == null)
        {
            throw new InvalidOperationException("Роль не найдена");
        }

        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            MiddleName = request.MiddleName,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            RoleId = role.Id,
            IsActive = true
        };

        var (accessToken, refreshToken) = GenerateTokens(user, role);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        user.LastLoginAt = DateTime.UtcNow;

        await userRepository.AddAsync(user, cancellationToken);
        await uow.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("User {UserId} registered successfully", user.Id);

        return new AuthResponse(
            accessToken,
            refreshToken,
            DateTime.UtcNow.AddHours(1),
            MapToUserInfo(user, role));
    }

    public async Task<AuthResponse> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        await using var uow = await _unitOfWorkFactory.CreateAsync(cancellationToken);
        var userRepository = uow.GetRepository<User>();

        var strategy = new Specification<User>(u =>
            u.RefreshToken == refreshToken &&
            u.RefreshTokenExpiryTime > DateTime.UtcNow &&
            u.IsActive)
        {
            AsNoTracking = false
        };

        var loadStrategy = new LoadStrategy<User>()
            .Include(u => u.Role)
            .Done();

        var user = await userRepository.FirstOrDefaultAsync(strategy, loadStrategy, ct: cancellationToken);

        if (user == null)
        {
            throw new UnauthorizedAccessException("Недействительный refresh token");
        }

        var (accessToken, newRefreshToken) = GenerateTokens(user);

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);

        await uow.SaveChangesAsync(cancellationToken);

        return new AuthResponse(
            accessToken,
            newRefreshToken,
            DateTime.UtcNow.AddHours(1),
            MapToUserInfo(user));
    }

    public async Task LogoutAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        await using var uow = await _unitOfWorkFactory.CreateAsync(cancellationToken);
        var userRepository = uow.GetRepository<User>();

        var strategy = new Specification<User>(u => u.Id == userId)
        {
            AsNoTracking = false
        };

        var user = await userRepository.FirstOrDefaultAsync(strategy, ct: cancellationToken);
        if (user != null)
        {
            user.RefreshToken = null;
            user.RefreshTokenExpiryTime = null;
            await uow.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation("User {UserId} logged out", userId);
    }

    public Task<bool> ValidateTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return Task.FromResult(_jwtService.ValidateToken(token));
    }

    private (string accessToken, string refreshToken) GenerateTokens(User user, Role? role = null)
    {
        var userRole = role ?? user.Role;
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.GivenName, user.FirstName),
            new(ClaimTypes.Surname, user.LastName),
            new("IsActive", user.IsActive.ToString())
        };

        if (userRole != null)
        {
            claims.Add(new Claim(ClaimTypes.Role, userRole.Code));
            claims.Add(new Claim("RoleName", userRole.Name));
            
            // Add permissions as claims
            if (userRole.RolePermissions?.Any() == true)
            {
                foreach (var permission in userRole.RolePermissions)
                {
                    claims.Add(new Claim("permission", permission.Permission.ToString()));
                }
            }
        }

        var accessToken = _jwtService.GenerateAccessToken(claims);
        var refreshTokenValue = _jwtService.GenerateRefreshToken();

        return (accessToken, refreshTokenValue);
    }

    private static UserInfo MapToUserInfo(User user, Role? role = null) => new(
        user.Id,
        user.Email,
        user.FirstName,
        user.LastName,
        user.MiddleName,
        role?.Code ?? user.Role?.Code ?? "unknown",
        user.IsActive);
}