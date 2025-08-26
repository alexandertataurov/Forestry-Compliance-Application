namespace LogsManagement.Common.Application.UnitOfWork;

public interface IUnitOfWorkFactory
{
    Task<IUnitOfWork> CreateAsync(CancellationToken ct = default);
}
