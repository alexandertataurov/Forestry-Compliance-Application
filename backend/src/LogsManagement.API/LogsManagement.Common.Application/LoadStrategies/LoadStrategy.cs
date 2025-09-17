using LogsManagement.Common.Domain.Models;
using LogsManagement.Common.Extensions;
using System.Linq.Expressions;

namespace LogsManagement.Common.Application.LoadStrategies;

public sealed class LoadStrategy<TEntity> : ILoadStrategy<TEntity> where TEntity : BaseEntity
{
    private readonly List<IncludePath> _paths = [];

    public IReadOnlyList<IncludePath> Paths => _paths;

    // ---- Типобезопасные входы (Expressions) ----
    public IncludeBuilder<TEntity, TProp> Include<TProp>(Expression<Func<TEntity, TProp>> nav)
        where TProp : BaseEntity
    {
        var segs = new List<string> { ExpressionPath.GetMember(nav).Name };

        _paths.Add(new IncludePath(segs));

        return new IncludeBuilder<TEntity, TProp>(this, segs);
    }

    public IncludeBuilder<TEntity, TElement> IncludeMany<TElement>(Expression<Func<TEntity, IEnumerable<TElement>>> nav)
        where TElement : BaseEntity
    {
        var segs = new List<string> { ExpressionPath.GetMember(nav).Name };

        _paths.Add(new IncludePath(segs));

        return new IncludeBuilder<TEntity, TElement>(this, segs);
    }

    // ---- Строковые входы (цепочки) ----
    public StringIncludeBuilder<TEntity> Include(string nav)
    {
        var segs = new List<string> { ValidateSegment(nav) };

        _paths.Add(new IncludePath(segs));

        return new StringIncludeBuilder<TEntity>(this, segs);
    }

    /// Добавить сразу полный путь "A.B.C"
    public LoadStrategy<TEntity> IncludePath(string dotPath)
    {
        var segs = dotPath.Split('.', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
        if (segs.Count == 0)
            throw new ArgumentException("Path is empty.", nameof(dotPath));

        foreach (var s in segs)
            ValidateSegment(s);

        _paths.Add(new IncludePath(segs));

        return this;
    }

    private static string ValidateSegment(string s)
    {
        if (string.IsNullOrWhiteSpace(s)) 
            throw new ArgumentException("Segment is empty.");
        
        if (s.Contains('.')) 
            throw new ArgumentException("Use Then(...) for chaining, segment must not contain '.'.");
        
        return s;
    }
}

public sealed class IncludeBuilder<TRoot, TCurrent>
    where TRoot : BaseEntity
    where TCurrent : BaseEntity
{
    private readonly LoadStrategy<TRoot> _plan;
    private readonly List<string> _segments;

    internal IncludeBuilder(LoadStrategy<TRoot> plan, List<string> segments)
    {
        _plan = plan;
        _segments = segments;
    }

    public IncludeBuilder<TRoot, TNext> Then<TNext>(Expression<Func<TCurrent, TNext>> nav)
        where TNext : BaseEntity
    {
        _segments.Add(ExpressionPath.GetMember(nav).Name);

        return new IncludeBuilder<TRoot, TNext>(_plan, _segments);
    }

    public IncludeBuilder<TRoot, TNext> ThenMany<TNext>(Expression<Func<TCurrent, IEnumerable<TNext>>> nav)
        where TNext : BaseEntity
    {
        _segments.Add(ExpressionPath.GetMember(nav).Name);

        return new IncludeBuilder<TRoot, TNext>(_plan, _segments);
    }

    public LoadStrategy<TRoot> Done() => _plan;
}

public sealed class StringIncludeBuilder<TEntity> where TEntity : BaseEntity
{
    private readonly LoadStrategy<TEntity> _plan;
    private readonly List<string> _segments;

    internal StringIncludeBuilder(LoadStrategy<TEntity> plan, List<string> segments)
    {
        _plan = plan;
        _segments = segments;
    }

    public StringIncludeBuilder<TEntity> Then(string nav)
    {
        if (string.IsNullOrWhiteSpace(nav))
            throw new ArgumentException("Segment is empty.", nameof(nav));

        if (nav.Contains('.'))
            throw new ArgumentException("Use Then(...) per segment; no dots.");

        _segments.Add(nav);

        return this;
    }

    public LoadStrategy<TEntity> Done() => _plan;
}