using LogsManagement.Common.Domain.Interfaces;
using System.Linq.Expressions;

namespace LogsManagement.Common.Application.Specifications.Abstractions;

public class Specification<TEntity> : ISpecification<TEntity> where TEntity : IEntity
{
    public Specification(Expression<Func<TEntity, bool>>? expression = default)
    {
        Criteria = expression;
    }

    public virtual Expression<Func<TEntity, bool>>? Criteria { get; protected set; }

    public IReadOnlyList<(Expression<Func<TEntity, object>> Key, bool Desc)> Order => _order;


    public int? Skip { get; set; }

    public int? Take { get; set; }


    public bool AsNoTracking { get; set; }

    public bool AsNoTrackingWithIdentityResolution { get; set; }


    protected readonly List<(Expression<Func<TEntity, object>>, bool)> _order = [];

    protected void OrderBy(Expression<Func<TEntity, object>> key) => _order.Add((key, false));

    protected void OrderByDesc(Expression<Func<TEntity, object>> key) => _order.Add((key, true));

    protected void Paging(int? skip, int? take) { Skip = skip; Take = take; }

    protected void NoTracking() => AsNoTracking = true;

    protected void NoTrackingIdentity() => AsNoTrackingWithIdentityResolution = true;

    public static ISpecification<TEntity> operator &(Specification<TEntity> left, Specification<TEntity> right)
        => new AndSpecification<TEntity>(left, right);

    public static ISpecification<TEntity> operator |(Specification<TEntity> left, Specification<TEntity> right)
        => new OrSpecification<TEntity>(left, right);

    public static ISpecification<TEntity> operator !(Specification<TEntity> tartget) => new NotSpecification<TEntity>(tartget);

}
