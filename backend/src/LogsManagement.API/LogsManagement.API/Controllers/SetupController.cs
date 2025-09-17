using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Application.Services;
using LogsManagement.Domain.Entities.Tenant;
using LogsManagement.Domain.Entities.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogsManagement.API.Controllers;

[ApiController]
[Route("api/setup")]
public sealed class SetupController : ControllerBase
{
    private readonly IUnitOfWorkFactory _uowFactory;
    private readonly IPasswordHasher _passwordHasher;

    public SetupController(IUnitOfWorkFactory uowFactory, IPasswordHasher passwordHasher)
    {
        _uowFactory = uowFactory;
        _passwordHasher = passwordHasher;
    }

    // POST: /api/setup/admin-tenant
    [HttpPost("admin-tenant")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateAdminTenant([FromBody] CreateTenantRequest request, CancellationToken ct)
    {
        await using var uow = await _uowFactory.CreateAsync(ct);
        var tenants = uow.GetRepository<Tenant>();

        // Ensure unique tenant Name and INN
        var existingByName = await tenants.FirstOrDefaultAsync(new Specification<Tenant>(t => t.Name == request.Name), ct: ct);
        if (existingByName is not null)
            return Conflict($"Tenant with name '{request.Name}' already exists.");

        var existingByInn = await tenants.FirstOrDefaultAsync(new Specification<Tenant>(t => t.Inn == request.Inn), ct: ct);
        if (existingByInn is not null)
            return Conflict($"Tenant with INN '{request.Inn}' already exists.");

        var tenant = new Tenant
        {
            Name = request.Name,
            DisplayName = request.DisplayName,
            Inn = request.Inn,
            ContactEmail = request.ContactEmail,
            ContactPhone = request.ContactPhone,
            IsActive = true
        };

        await tenants.AddAsync(tenant, ct);
        await uow.SaveChangesAsync(ct);

        return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, new { tenant.Id });
    }

    // GET helper for CreatedAtAction
    [HttpGet("tenant/{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTenant([FromRoute] Guid id, CancellationToken ct)
    {
        await using var uow = await _uowFactory.CreateAsync(ct);
        var tenants = uow.GetRepository<Tenant>();
        var tenant = await tenants.FirstOrDefaultAsync(new Specification<Tenant>(t => t.Id == id), ct: ct);
        if (tenant is null) return NotFound();
        return Ok(new
        {
            tenant.Id,
            tenant.Name,
            tenant.DisplayName,
            tenant.Inn,
            tenant.ContactEmail,
            tenant.ContactPhone,
            tenant.IsActive
        });
    }

    // POST: /api/setup/admin-user
    [HttpPost("admin-user")]
    [AllowAnonymous]
    public async Task<IActionResult> CreateAdminUser([FromBody] CreateAdminUserRequest request, CancellationToken ct)
    {
        await using var uow = await _uowFactory.CreateAsync(ct);
        var tenants = uow.GetRepository<Tenant>();
        var users = uow.GetRepository<User>();
        var roles = uow.GetRepository<Role>();

        // Validate tenant
        var tenant = await tenants.FirstOrDefaultAsync(new Specification<Tenant>(t => t.Id == request.TenantId && t.IsActive), ct: ct);
        if (tenant is null)
            return BadRequest("Specified tenant does not exist or is not active.");

        // Validate role
        var adminRole = await roles.FirstOrDefaultAsync(new Specification<Role>(r => r.Code == "administrator" && r.IsActive), ct: ct);
        if (adminRole is null)
            return BadRequest("Administrator role not found. Run database seeding for roles first.");

        // Ensure email uniqueness
        var existingUser = await users.FirstOrDefaultAsync(new Specification<User>(u => u.Email == request.Email), ct: ct);
        if (existingUser is not null)
            return Conflict($"User with email '{request.Email}' already exists.");

        var user = new User
        {
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            MiddleName = request.MiddleName,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            RoleId = adminRole.Id,
            TenantId = request.TenantId,
            IsActive = true,
            LastLoginAt = null
        };

        await users.AddAsync(user, ct);
        await uow.SaveChangesAsync(ct);

        return Created(string.Empty, new { user.Id });
    }

    public sealed record CreateTenantRequest(
        string Name,
        string DisplayName,
        string Inn,
        string? ContactEmail,
        string? ContactPhone);

    public sealed record CreateAdminUserRequest(
        Guid TenantId,
        string Email,
        string FirstName,
        string LastName,
        string? MiddleName,
        string Password);
}