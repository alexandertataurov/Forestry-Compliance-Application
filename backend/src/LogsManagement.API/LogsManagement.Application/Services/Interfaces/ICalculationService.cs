using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Application.Services.Interfaces
{
    public interface ICalculationService
    {
        Task<Calculation> CreateCalculationAsync(Guid gostStandardId, LogType logType, CancellationToken ct = default);

        Task<Batch> AddBatchAsync(Guid calculationId, Models.BatchCreateModel model, CancellationToken ct = default);

        Task<Calculation?> GetCalculationAsync(Guid calculationId, CancellationToken ct = default);
    }
}