using LogsManagement.Common.Application.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.Common.Infrastructure.UnitOfWork;

public sealed class EfUnitOfWorkFactory<TContext>(IDbContextFactory<TContext> dbFactory) : IUnitOfWorkFactory
    where TContext : DbContext
{
    private readonly IDbContextFactory<TContext> _dbFactory = dbFactory;

    public async Task<IUnitOfWork> CreateAsync(CancellationToken ct = default)
    {
        var db = await _dbFactory.CreateDbContextAsync(ct);

        return new EfUnitOfWork<TContext>(db);
    }
}
