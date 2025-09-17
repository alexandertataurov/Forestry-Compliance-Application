namespace LogsManagement.Application.Services.Interfaces;

public interface IVolumeCalculator
{
    /// <summary>
    /// Рассчитать объём бревна по ГОСТ-таблице.
    /// Сначала ищется точное совпадение (Length, Diameter). Если нет — fallback на цилиндрическую формулу.
    /// Округление по умолчанию до 0.001 м³.
    /// </summary>
    Task<decimal> CalculateVolumeAsync(Guid gostStandardId, decimal diameterCm, decimal lengthM, int precision = 3, CancellationToken ct = default);

    /// <summary>
    /// Пакетный расчёт объёмов.
    /// </summary>
    Task<IReadOnlyDictionary<(decimal Diameter, decimal Length), decimal>> CalculateVolumesAsync(Guid gostStandardId, IReadOnlyList<(decimal Diameter, decimal Length)> items, int precision = 3, CancellationToken ct = default);
}
