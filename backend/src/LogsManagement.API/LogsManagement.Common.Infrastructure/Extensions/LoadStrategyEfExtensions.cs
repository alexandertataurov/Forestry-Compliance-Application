using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.Common.Infrastructure.Extensions;

public static class LoadStrategyEfExtensions
{
    public static IQueryable<TEntity> ApplyLoadStrategy<TEntity>(
        this IQueryable<TEntity> query,
        ILoadStrategy<TEntity>? strategy,
        bool splitQuery = false)
        where TEntity : BaseEntity
    {
        if (strategy is null || strategy.Paths.Count == 0) return query;

        if (splitQuery) query = query.AsSplitQuery();

        foreach (var path in strategy.Paths)
            query = query.Include(path.ToDotPath());

        return query;
    }
}
