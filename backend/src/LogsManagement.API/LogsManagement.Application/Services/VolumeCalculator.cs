using LogsManagement.Application.Services.Interfaces;
using LogsManagement.Common.Application.Specifications.Abstractions;
using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Domain.Entities.Gost;

namespace LogsManagement.Application.Services;

public sealed class VolumeCalculator : IVolumeCalculator
{
    private readonly IUnitOfWorkFactory _unitOfWorkFactory;

    public VolumeCalculator(IUnitOfWorkFactory unitOfWorkFactory)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    public async Task<decimal> CalculateVolumeAsync(Guid gostStandardId, decimal diameterCm, decimal lengthM, int precision = 3, CancellationToken ct = default)
    {
        await using var uow = await _unitOfWorkFactory.CreateAsync(ct);
        var volumeRepository = uow.GetRepository<GostVolume>();

        var specification = new Specification<GostVolume>(x =>
            x.GostStandardId == gostStandardId
            && x.IsActive
            && x.Diameter == diameterCm
            && x.Length == lengthM)
        { 
            AsNoTracking = true
        };

        var row = await volumeRepository.FirstOrDefaultAsync(specification, ct: ct);
        decimal volume;
        if (row is not null)
        {
            volume = row.Volume;
        }
        else
        {
            // Fallback: цилиндрическая формула: V = π * (d/200)^2 * L
            // d (см) -> r (м) = d / 200
            var r = diameterCm / 200m;
            var pi = (decimal)Math.PI;
            volume = pi * r * r * lengthM;
        }

        return Math.Round(volume, precision, MidpointRounding.AwayFromZero);
    }

    public async Task<IReadOnlyDictionary<(decimal Diameter, decimal Length), decimal>> 
        CalculateVolumesAsync(Guid gostStandardId, IReadOnlyList<(decimal Diameter, decimal Length)> items, int precision = 3, CancellationToken ct = default)
    {
        var diameterSet = items.Select(i => i.Diameter).ToHashSet();
        var lengthSet = items.Select(i => i.Length).ToHashSet();

        await using var uow = await _unitOfWorkFactory.CreateAsync(ct);
        var volumeRepository = uow.GetRepository<GostVolume>();

        var specification = new Specification<GostVolume>(x =>
            x.GostStandardId == gostStandardId
            && x.IsActive
            && diameterSet.Contains(x.Diameter)
            && diameterSet.Contains(x.Length))
        {
            AsNoTracking = true
        };

        var voluems = await volumeRepository.ListAsync(specification, ct: ct);
        var volumeDict = voluems.ToDictionary(v => (v.Diameter, v.Length), v => v.Volume);

        var result = new Dictionary<(decimal Diameter, decimal Length), decimal>(items.Count);
        foreach (var item in items)
        {
            if (volumeDict.TryGetValue(item, out var volume))
            {
                result[item] = Math.Round(volume, precision, MidpointRounding.AwayFromZero);
            }
            else
            {
                // Fallback: цилиндрическая формула: V = π * (d/200)^2 * L
                // d (см) -> r (м) = d / 200
                var r = item.Diameter / 200m;
                var pi = (decimal)Math.PI;
                volume = pi * r * r * item.Length;
                result[item] = Math.Round(volume, precision, MidpointRounding.AwayFromZero);
            }
        }

        return result;
    }
}