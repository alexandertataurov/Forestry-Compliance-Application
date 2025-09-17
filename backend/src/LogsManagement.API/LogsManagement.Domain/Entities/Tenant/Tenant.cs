using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.Tenant;

/// <summary>
/// Арендатор (компания лесозаготовитель)
/// </summary>
public class Tenant : BaseEntity
{
    /// <summary>
    /// Уникальное имя компании (для URL, API ключей)
    /// </summary>
    public string Name { get; set; } = string.Empty;
    
    /// <summary>
    /// Отображаемое название компании
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;
    
    /// <summary>
    /// ИНН компании
    /// </summary>
    public string Inn { get; set; } = string.Empty;
    
    /// <summary>
    /// Активность арендатора
    /// </summary>
    public bool IsActive { get; set; } = true;
    
    /// <summary>
    /// Email для связи
    /// </summary>
    public string? ContactEmail { get; set; }
    
    /// <summary>
    /// Телефон для связи
    /// </summary>
    public string? ContactPhone { get; set; }
    
    /// <summary>
    /// 
    /// </summary>
    public List<User.User> Users { get; set; } = [];
}