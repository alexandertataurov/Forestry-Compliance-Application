using LogsManagement.Common.Application.Repositories;
using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Common.Domain.Models;
using LogsManagement.Common.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Collections.Concurrent;
using System.Data;

namespace LogsManagement.Common.Infrastructure.UnitOfWork;

public sealed class EfUnitOfWork<TContext>(TContext db) : IUnitOfWork where TContext : DbContext
{
    private readonly TContext _db = db;

    private readonly ConcurrentDictionary<Type, object> _repos = [];

    private IDbContextTransaction? _tx;

    public IRepository<TEntity> GetRepository<TEntity>() where TEntity : BaseEntity
    {
        return (IRepository<TEntity>)_repos.GetOrAdd(typeof(TEntity), _ => new EfRepository<TEntity>(_db));
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);

    public async Task<IUnitOfWorkTransaction> BeginTransactionAsync(IsolationLevel isolation = IsolationLevel.ReadCommitted, CancellationToken ct = default)
    {
        if (_tx != null)
            throw new InvalidOperationException("Transaction already started.");

        _tx = await _db.Database.BeginTransactionAsync(isolation, ct);

        return new TxHandle(this);
    }

    private sealed class TxHandle(EfUnitOfWork<TContext> owner) : IUnitOfWorkTransaction
    {
        private readonly EfUnitOfWork<TContext> _owner = owner;

        private bool _completed;

        public async Task CommitAsync(CancellationToken ct = default)
        {
            if (_owner._tx == null)
                return;

            await _owner._db.SaveChangesAsync(ct);

            await _owner._tx.CommitAsync(ct);

            _completed = true;
        }

        public async Task RollbackAsync(CancellationToken ct = default)
        {
            if (_owner._tx == null)
                return;

            await _owner._tx.RollbackAsync(ct);

            _completed = true;
        }

        public async ValueTask DisposeAsync()
        {
            try
            {
                if (!_completed && _owner._tx != null)
                    await _owner._tx.RollbackAsync();
            }
            finally
            {
                if (_owner._tx != null)
                {
                    await _owner._tx.DisposeAsync();

                    _owner._tx = null;
                }
            }
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_tx != null)
        {
            await _tx.RollbackAsync();
            await _tx.DisposeAsync();

            _tx = null;
        }

        await _db.DisposeAsync();
    }
}
