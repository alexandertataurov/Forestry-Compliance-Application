using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Application.Models;
using LogsManagement.Common.Application.Repositories;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Domain.Models;
using LogsManagement.Common.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.Common.Infrastructure.Repositories;

public class EfRepository<TEntity>(DbContext db) : IRepository<TEntity> where TEntity : BaseEntity
{
    private readonly DbContext _db = db;

    public async Task<List<TEntity>> ListAsync(
        ISpecification<TEntity>? spec = null,
        ILoadStrategy<TEntity>? load = null,
        QueryOptions? options = null,
        CancellationToken ct = default)
    {
        return await _db.Set<TEntity>()
            .GetQuery(spec, load, options)
            .ToListAsync(ct);
    }

    public async Task<int> CountAsync(ISpecification<TEntity>? spec = null, CancellationToken ct = default)
    {
        var q = _db.Set<TEntity>().AsQueryable();
        if (spec?.Criteria is not null)
            q = q.Where(spec.Criteria);

        return await q.CountAsync(ct);
    }

    public async Task<TEntity?> FirstOrDefaultAsync(
        ISpecification<TEntity>? spec = null,
        ILoadStrategy<TEntity>? load = null,
        QueryOptions? options = null,
        CancellationToken ct = default)
    {
        return await _db.Set<TEntity>()
            .GetQuery(spec, load, options)
            .FirstOrDefaultAsync(ct);
    }

    public async Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default)
    {
        await _db.Set<TEntity>().AddAsync(entity, ct);

        return entity;
    }

    public Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken ct = default)
        => _db.Set<TEntity>().AddRangeAsync(entities, ct);

    public Task UpdateAsync(TEntity entity, CancellationToken ct = default)
    {
        _db.Set<TEntity>().Update(entity);

        return Task.CompletedTask;
    }

    public Task RemoveAsync(TEntity entity, CancellationToken ct = default)
    {
        _db.Set<TEntity>().Remove(entity);

        return Task.CompletedTask;
    }
}
