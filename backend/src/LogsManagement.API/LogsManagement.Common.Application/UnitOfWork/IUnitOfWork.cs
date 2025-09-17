using LogsManagement.Common.Application.Repositories;
using LogsManagement.Common.Domain.Models;
using System.Data;

namespace LogsManagement.Common.Application.UnitOfWork;

public interface IUnitOfWork : IAsyncDisposable
{
    IRepository<TEntity> GetRepository<TEntity>() where TEntity : BaseEntity;

    /// Сохранить изменения текущего контекста
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    /// Транзакция поверх текущего контекста
    Task<IUnitOfWorkTransaction> BeginTransactionAsync(
        IsolationLevel isolation = IsolationLevel.ReadCommitted,
        CancellationToken ct = default);
}

public interface IUnitOfWorkTransaction : IAsyncDisposable
{
    Task CommitAsync(CancellationToken ct = default);

    Task RollbackAsync(CancellationToken ct = default);
}
