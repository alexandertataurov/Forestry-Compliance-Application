namespace LogsManagement.Domain.Enums;

/// <summary>
/// Основные разрешения в системе
/// </summary>
public enum Permission
{
    // Управление пользователями
    [PermissionMetadata("users.view", "Просмотр пользователей")]
    ViewUsers = 1,
    
    [PermissionMetadata("users.create", "Создание пользователей")]
    CreateUsers = 2,
    
    [PermissionMetadata("users.edit", "Редактирование пользователей")]
    EditUsers = 3,
    
    [PermissionMetadata("users.delete", "Удаление пользователей")]
    DeleteUsers = 4,

    // Управление расчетами
    [PermissionMetadata("calculations.view", "Просмотр расчетов")]
    ViewCalculations = 5,
    
    [PermissionMetadata("calculations.create", "Создание расчетов")]
    CreateCalculations = 6,
    
    [PermissionMetadata("calculations.edit", "Редактирование расчетов")]
    EditCalculations = 7,
    
    [PermissionMetadata("calculations.delete", "Удаление расчетов")]
    DeleteCalculations = 8,
    
    [PermissionMetadata("calculations.approve", "Утверждение расчетов")]
    ApproveCalculations = 9,

    // Управление партиями
    [PermissionMetadata("batches.view", "Просмотр партий")]
    ViewBatches = 10,
    
    [PermissionMetadata("batches.create", "Создание партий")]
    CreateBatches = 11,
    
    [PermissionMetadata("batches.edit", "Редактирование партий")]
    EditBatches = 12,
    
    [PermissionMetadata("batches.delete", "Удаление партий")]
    DeleteBatches = 13,

    // Управление журналами
    [PermissionMetadata("logs.view", "Просмотр журналов")]
    ViewLogs = 14,
    
    [PermissionMetadata("logs.create", "Создание записей в журналах")]
    CreateLogs = 15,
    
    [PermissionMetadata("logs.edit", "Редактирование записей журналов")]
    EditLogs = 16,
    
    [PermissionMetadata("logs.delete", "Удаление записей журналов")]
    DeleteLogs = 17,

    // Административные разрешения
    [PermissionMetadata("admin.system", "Системное администрирование")]
    SystemAdmin = 18,
    
    [PermissionMetadata("admin.audit", "Просмотр аудита")]
    ViewAudit = 19,
    
    [PermissionMetadata("admin.settings", "Управление настройками")]
    ManageSettings = 20
}

/// <summary>
/// Метаданные для разрешений
/// </summary>
[AttributeUsage(AttributeTargets.Field)]
public class PermissionMetadataAttribute : Attribute
{
    public string Code { get; }
    public string Description { get; }

    public PermissionMetadataAttribute(string code, string description)
    {
        Code = code;
        Description = description;
    }
}