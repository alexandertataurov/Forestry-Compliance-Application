using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Common.Application.Repositories;

public interface IRepository<TEntity> : IReadRepository<TEntity> where TEntity : BaseEntity
{
    Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default);

    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default);

    Task UpdateAsync(TEntity entity, CancellationToken ct = default);

    Task RemoveAsync(TEntity entity, CancellationToken ct = default);
}
