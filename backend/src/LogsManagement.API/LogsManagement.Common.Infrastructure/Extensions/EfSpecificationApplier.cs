using LogsManagement.Common.Application;
using LogsManagement.Common.Application.Enums;
using LogsManagement.Common.Application.LoadStrategies;
using LogsManagement.Common.Application.Models;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace LogsManagement.Common.Infrastructure.Extensions;

public static class EfSpecificationApplier
{
    public static IQueryable<TEntity> GetQuery<TEntity>(
        this IQueryable<TEntity> source,
        ISpecification<TEntity>? spec = null,
        ILoadStrategy<TEntity>? load = null,
        QueryOptions? options = null)
        where TEntity : BaseEntity
    {
        var q = source;

        // tracking
        switch (options?.Tracking)
        {
            case TrackingBehavior.NoTracking:
                q = q.AsNoTracking(); break;
            case TrackingBehavior.IdentityResolution:
                q = q.AsNoTrackingWithIdentityResolution(); break;
        }

        // filter/order/paging — чистым LINQ-эвальюатором из Application
        q = SpecificationEvaluator.Apply(q, spec);

        // includes по плану
        if (load is not null && load.Paths.Count > 0)
        {
            if (options?.PreferSplitQuery == true)
                q = q.AsSplitQuery();

            foreach (var p in load.Paths.DistinctBy(x => x.ToDotPath()))
            {
                var path = p.ToDotPath();
                if (!string.IsNullOrEmpty(path))
                    q = q.Include(path);
            }
        }

        return q;
    }
}
