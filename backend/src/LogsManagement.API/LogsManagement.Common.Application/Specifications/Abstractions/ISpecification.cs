using System.Linq.Expressions;

namespace LogsManagement.Common.Application.Specifications.Abstractions;

public interface ISpecification<T>
{
    Expression<Func<T, bool>>? Criteria { get; }

    IReadOnlyList<(Expression<Func<T, object>> Key, bool Desc)> Order { get; }

    int? Skip { get; }

    int? Take { get; }

    bool AsNoTracking { get; }

    bool AsNoTrackingWithIdentityResolution { get; }
}
