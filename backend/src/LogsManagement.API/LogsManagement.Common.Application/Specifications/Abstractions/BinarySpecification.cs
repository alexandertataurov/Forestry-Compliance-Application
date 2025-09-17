using LogsManagement.Common.Domain.Interfaces;
using System.Linq.Expressions;

namespace LogsManagement.Common.Application.Specifications.Abstractions;

public abstract class BinarySpecification<TEntity>(Specification<TEntity> left, Specification<TEntity> right) 
    : Specification<TEntity> where TEntity : IEntity
{
    protected readonly Specification<TEntity> Left = left ?? throw new ArgumentNullException(nameof(left));
    protected readonly Specification<TEntity> Right = right ?? throw new ArgumentNullException(nameof(right));

    private Expression<Func<TEntity, bool>>? _cached;

    // Как именно объединять тела выражений — определяет наследник
    protected abstract Expression MergeBody(Expression leftBody, Expression rightBody);

    public override Expression<Func<TEntity, bool>>? Criteria
    {
        get
        {
            if (_cached is not null) return _cached;

            var lc = Left.Criteria;
            var rc = Right.Criteria;

            if (lc is null) return rc;
            if (rc is null) return lc;

            var p = lc.Parameters[0];
            var rb = ParamRebinder.Rebind(rc, p);
            _cached = Expression.Lambda<Func<TEntity, bool>>(MergeBody(lc.Body, rb.Body), p);
            return _cached;
        }
    }

    // Локальный помощник ребиндинга (совместим с любым TEntity)
    private sealed class ParamRebinder : ExpressionVisitor
    {
        private readonly ParameterExpression _from, _to;
        private ParamRebinder(ParameterExpression from, ParameterExpression to) { _from = from; _to = to; }

        public static LambdaExpression Rebind(LambdaExpression lambda, ParameterExpression toParam)
        {
            var rb = new ParamRebinder(lambda.Parameters[0], toParam);
            var body = rb.Visit(lambda.Body)!;
            return Expression.Lambda(body, toParam);
        }

        protected override Expression VisitParameter(ParameterExpression node)
            => node == _from ? _to : base.VisitParameter(node);
    }
}
