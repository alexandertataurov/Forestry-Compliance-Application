using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Domain.Interfaces;
using System.Linq.Expressions;

namespace LogsManagement.Common.Application.Specifications;

internal class NotSpecification<TEntity>(Specification<TEntity> inner) : Specification<TEntity> where TEntity : IEntity
{
    private readonly Specification<TEntity> _inner = inner;
    private Expression<Func<TEntity, bool>>? _cached;

    public override Expression<Func<TEntity, bool>>? Criteria
    {
        get
        {
            if (_cached is not null)
                return _cached;

            var c = _inner.Criteria;
            if (c is null)
                return null;

            var p = c.Parameters[0];
            _cached = Expression.Lambda<Func<TEntity, bool>>(Expression.Not(c.Body), p);

            return _cached;
        }
    }
}
