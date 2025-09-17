using LogsManagement.Common.Domain.Interfaces;

namespace LogsManagement.Common.Application.LoadStrategies;

public interface ILoadStrategy<TEntity> where TEntity : IEntity
{
    IReadOnlyList<IncludePath> Paths { get; }
}

public sealed class IncludePath
{
    internal IncludePath(List<string> segments)
    {
        Segments = segments;
    }

    
    public IReadOnlyList<string> Segments { get; }

    public string ToDotPath() => string.Join(".", Segments);
}
