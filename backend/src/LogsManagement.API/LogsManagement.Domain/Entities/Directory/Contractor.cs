using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Domain.Entities.Directory
{
    public class Contractor : BaseEntity
    {
        // Основная информация
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty; // Код подрядчика
        public string? Description { get; set; }
        
        // Контактная информация
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Website { get; set; }
        
        // Руководитель
        public string? ContactPerson { get; set; }
        public string? ContactPhone { get; set; }
        public string? ContactEmail { get; set; }
        
        // Документы
        public string? TaxNumber { get; set; } // ИНН
        public string? RegistrationNumber { get; set; } // ОГРН
        
        // Статус
        public bool IsActive { get; set; } = true;
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
    }
}
