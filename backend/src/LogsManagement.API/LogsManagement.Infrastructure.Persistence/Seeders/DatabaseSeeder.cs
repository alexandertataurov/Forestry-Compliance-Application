using LogsManagement.Common.Application.Services;
using LogsManagement.Domain.Entities.User;
using LogsManagement.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace LogsManagement.Infrastructure.Persistence.Seeders;

/// <summary>
/// Сидер для инициализации начальных данных в базе данных
/// </summary>
public static class DatabaseSeeder
{
    /// <summary>
    /// Выполняет инициализацию всех начальных данных
    /// </summary>
    /// <param name="context">Контекст базы данных</param>
    /// <param name="serviceProvider">Провайдер сервисов для получения зависимостей</param>
    public static async Task SeedAsync(LogsManagementDbContext context, IServiceProvider serviceProvider)
    {
        await SeedRolesAsync(context);
        await SeedRolePermissionsAsync(context);
        await SeedDefaultAdminUserAsync(context, serviceProvider);
        
        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Создает системные роли
    /// </summary>
    private static async Task SeedRolesAsync(LogsManagementDbContext context)
    {
        var systemRoles = new[]
        {
            new Role 
            { 
                Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                Name = "Полевой работник", 
                Code = "field_worker", 
                Description = "Работник выполняющий полевые измерения и создание журналов",
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Role 
            { 
                Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                Name = "Обработчик данных", 
                Code = "data_processor",
                Description = "Специалист по обработке и анализу данных измерений",
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Role 
            { 
                Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                Name = "Проверяющий данных", 
                Code = "data_verifier",
                Description = "Специалист по проверке и верификации данных",
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Role 
            { 
                Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
                Name = "Менеджер", 
                Code = "manager",
                Description = "Менеджер проекта с правами управления пользователями",
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Role 
            { 
                Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
                Name = "Администратор", 
                Code = "administrator",
                Description = "Системный администратор с полными правами доступа",
                IsSystemRole = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        foreach (var role in systemRoles)
        {
            var existingRole = await context.Set<Role>()
                .FirstOrDefaultAsync(r => r.Code == role.Code);

            if (existingRole == null)
            {
                context.Set<Role>().Add(role);
            }
            else
            {
                // Обновляем системные роли при необходимости
                existingRole.Name = role.Name;
                existingRole.Description = role.Description;
                existingRole.IsActive = role.IsActive;
                existingRole.UpdatedAt = DateTime.UtcNow;
            }
        }

        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Назначает разрешения ролям
    /// </summary>
    private static async Task SeedRolePermissionsAsync(LogsManagementDbContext context)
    {
        var rolePermissionsMap = new Dictionary<string, Permission[]>
        {
            // Полевой работник - базовые права на создание и просмотр журналов и партий
            ["field_worker"] =
            [
                Permission.ViewLogs,
                Permission.CreateLogs,
                Permission.ViewBatches,
                Permission.CreateBatches,
                Permission.CreateCalculations,
            ],

            // Обработчик данных - расширенные права на работу с данными
            ["data_processor"] =
            [
                Permission.ViewLogs,
                Permission.CreateLogs,
                Permission.EditLogs,
                Permission.ViewBatches,
                Permission.CreateBatches,
                Permission.EditBatches,
                Permission.ViewCalculations,
                Permission.CreateCalculations,
                Permission.EditCalculations
            ],

            // Проверяющий данных - права на проверку и утверждение
            ["data_verifier"] =
            [
                Permission.ViewLogs,
                Permission.ViewBatches,
                Permission.ViewCalculations,
                Permission.EditCalculations,
                Permission.ApproveCalculations,
                Permission.ViewUsers
            ],

            // Менеджер - управление пользователями и просмотр отчетов
            ["manager"] =
            [
                Permission.ViewLogs,
                Permission.ViewBatches,
                Permission.ViewCalculations,
                Permission.ViewUsers,
                Permission.CreateUsers,
                Permission.EditUsers,
                Permission.ViewAudit
            ],

            // Администратор - все разрешения
            ["administrator"] = Enum.GetValues<Permission>()
        };

        foreach (var (roleCode, permissions) in rolePermissionsMap)
        {
            var role = await context.Set<Role>()
                .Include(r => r.RolePermissions)
                .FirstOrDefaultAsync(r => r.Code == roleCode);

            if (role == null) continue;

            // Удаляем существующие разрешения для обновления
            context.Set<RolePermission>().RemoveRange(role.RolePermissions);
            await context.SaveChangesAsync();

            // Добавляем новые разрешения
            var newPermissions = permissions.Select(permission => new RolePermission
            {
                Id = Guid.NewGuid(),
                RoleId = role.Id,
                Permission = permission,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            context.Set<RolePermission>().AddRange(newPermissions);
        }

        await context.SaveChangesAsync();
    }

    /// <summary>
    /// Создает администратора по умолчанию
    /// </summary>
    private static async Task SeedDefaultAdminUserAsync(LogsManagementDbContext context, IServiceProvider serviceProvider)
    {
        const string adminEmail = "admin@logsmanagement.com";
        const string defaultPassword = "Admin123!";

        var existingAdmin = await context.Users
            .FirstOrDefaultAsync(u => u.Email == adminEmail);

        if (existingAdmin != null) return;

        var adminRole = await context.Set<Role>()
            .FirstOrDefaultAsync(r => r.Code == "administrator");

        if (adminRole == null)
        {
            throw new InvalidOperationException("Роль администратора не найдена. Убедитесь, что роли созданы перед созданием пользователей.");
        }

        var passwordHasher = serviceProvider.GetRequiredService<IPasswordHasher>();
        var hashedPassword = passwordHasher.HashPassword(defaultPassword);

        var adminUser = new User
        {
            Id = Guid.Parse("AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"),
            Email = adminEmail,
            FirstName = "Системный",
            LastName = "Администратор",
            PasswordHash = hashedPassword,
            RoleId = adminRole.Id,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();

        // Логируем создание администратора (можно добавить логгер через DI)
        Console.WriteLine($"✅ Создан администратор по умолчанию:");
        Console.WriteLine($"   Email: {adminEmail}");
        Console.WriteLine($"   Password: {defaultPassword}");
        Console.WriteLine($"   ⚠️  Смените пароль после первого входа!");
    }
}