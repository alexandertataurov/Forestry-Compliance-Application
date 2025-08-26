using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Domain.Interfaces;
using System.Linq.Expressions;

namespace LogsManagement.Common.Application.Specifications;

public sealed class AndSpecification<TEntity>(Specification<TEntity> left, Specification<TEntity> right) 
    : BinarySpecification<TEntity>(left, right) where TEntity : IEntity
{
    protected override Expression MergeBody(Expression leftBody, Expression rightBody)
        => Expression.AndAlso(leftBody, rightBody);
}
