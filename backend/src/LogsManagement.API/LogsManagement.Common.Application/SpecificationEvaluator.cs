using LogsManagement.Common.Application.Specifications.Abstractions;

namespace LogsManagement.Common.Application
{
    public static class SpecificationEvaluator
    {
        public static IQueryable<TEntity> Apply<TEntity>(this IQueryable<TEntity> query, ISpecification<TEntity>? spec)
        {
            if (spec is null) return query;

            if (spec.Criteria is not null)
                query = query.Where(spec.Criteria);

            if (spec.Order.Count > 0)
            {
                IOrderedQueryable<TEntity>? ordered = null;
                for (int i = 0; i < spec.Order.Count; i++)
                {
                    var (key, desc) = spec.Order[i];
                    ordered = i == 0
                        ? (desc ? query.OrderByDescending(key) : query.OrderBy(key))
                        : (desc ? ordered!.ThenByDescending(key) : ordered!.ThenBy(key));
                }
                query = ordered!;
            }

            if (spec.Skip.HasValue) query = query.Skip(spec.Skip.Value);
            if (spec.Take.HasValue) query = query.Take(spec.Take.Value);

            return query;
        }
    }
}
