using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.Directory;

public sealed class Forestry : TenantEntity
{
    // Основная информация
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty; // Код лесничества
    public string? Description { get; set; }
    
    // Адрес и контакты
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    
    // Руководитель
    public string? ManagerName { get; set; }
    public string? ManagerPhone { get; set; }
    
    // Статус
    public bool IsActive { get; set; } = true;
}
