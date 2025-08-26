using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Application.Models;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Domain.Models;

namespace LogsManagement.Common.Application.Repositories;

public interface IReadRepository<TEntity> where TEntity : BaseEntity
{
    Task<List<TEntity>> ListAsync(
        ISpecification<TEntity>? spec = null,
        ILoadStrategy<TEntity>? load = null,
        QueryOptions? options = null,
        CancellationToken ct = default);

    Task<int> CountAsync(ISpecification<TEntity>? spec = null, CancellationToken ct = default);

    Task<TEntity?> FirstOrDefaultAsync(
        ISpecification<TEntity>? spec = null,
        ILoadStrategy<TEntity>? load = null,
        QueryOptions? options = null,
        CancellationToken ct = default);
}
