using LogsManagement.Common.Application.Enums;

namespace LogsManagement.Common.Application.Models;

public sealed class QueryOptions
{
    /// Подсказка по трекингу (провайдер-независимая).
    public TrackingBehavior Tracking { get; init; } = TrackingBehavior.Default;

    /// Просьба разбить граф Include-ов на несколько запросов.
    /// В EF это маппится на AsSplitQuery().
    public bool PreferSplitQuery { get; init; } = true;

    // Сюда легко добавлять нейтральные опции в будущем:
    // public int? CommandTimeoutSeconds { get; init; }
    // public string? Tag { get; init; } // EF TagWith
}
