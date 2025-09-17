using LogsManagement.Application.Services.Interfaces;
using LogsManagement.Application.Services.Models;
using LogsManagement.Application.Specifications.Calculation;
using LogsManagement.Common.Application.UnitOfWork;
using LogsManagement.Domain.Entities.Calculation;
using LogsManagement.Domain.Enums;

namespace LogsManagement.Application.Services
{
    public sealed class CalculationService : ICalculationService
    {
        private readonly IUnitOfWorkFactory _uowFactory;
        private readonly IVolumeCalculator _volumeCalculator;

        public CalculationService(IUnitOfWorkFactory uowFactory, IVolumeCalculator volumeCalculator)
        {
            _uowFactory = uowFactory;
            _volumeCalculator = volumeCalculator;
        }

        public async Task<Calculation> CreateCalculationAsync(Guid gostStandardId, LogType logType, CancellationToken ct = default)
        {
            await using var uow = await _uowFactory.CreateAsync(ct);
            var calcRepo = uow.GetRepository<Calculation>();

            var calc = new Calculation
            {
                Id = Guid.NewGuid(),
                GostStandardId = gostStandardId,
                LogType = logType
            };

            await calcRepo.AddAsync(calc, ct);
            await uow.SaveChangesAsync(ct);
            return calc;
        }

        public async Task<Batch> AddBatchAsync(Guid calculationId, BatchCreateModel model, CancellationToken ct = default)
        {
            await using var uow = await _uowFactory.CreateAsync(ct);
            var calcRepo = uow.GetRepository<Calculation>();
            var batchRepo = uow.GetRepository<Batch>();
            var logRepo = uow.GetRepository<LogEntry>();

            var calc = await calcRepo.FirstOrDefaultAsync(new CalculationByIdSpec(calculationId), ct: ct);
            if (calc is null)
                throw new InvalidOperationException($"Calculation {calculationId} not found.");

            await using var tx = await uow.BeginTransactionAsync(ct: ct);

            var batch = new Batch
            {
                Id = Guid.NewGuid(),
                CalculationId = calculationId,
                Date = model.Date,
                OperatorId = model.OperatorId,
                DriverFullName = model.DriverFullName,
                TransportType = model.TransportType,
                TransportNumber = model.TransportNumber,
                Forestry = model.Forestry,
                Quarter = model.Quarter,
                Description = model.Description
            };

            await batchRepo.AddAsync(batch, ct);

            var logDimensionSet = model.Logs.Select(log => (log.Diameter, log.Length)).ToList();
            var volumes = await _volumeCalculator.CalculateVolumesAsync(calc.GostStandardId, logDimensionSet, 3, ct);

            foreach (var log in model.Logs)
            {
                var volume = volumes.TryGetValue((log.Diameter, log.Length), out var vol) ? vol : 0m;
                if(volume <= 0)
                    throw new InvalidOperationException($"Cannot calculate volume for log with Diameter {log.Diameter} and Length {log.Length}");

                var entry = new LogEntry
                {
                    Id = Guid.NewGuid(),
                    BatchId = batch.Id,
                    Diameter = log.Diameter,
                    Length = log.Length,
                    Volume = volume,
                    Quality = log.Quality
                };

                await logRepo.AddAsync(entry, ct);
            }

            await tx.CommitAsync(ct);
            return batch;
        }

        public async Task<Calculation?> GetCalculationAsync(Guid calculationId, CancellationToken ct = default)
        {
            await using var uow = await _uowFactory.CreateAsync(ct);
            var calcRepo = uow.GetRepository<Calculation>();

            var spec = new CalculationByIdSpec(calculationId);

            var calculation = await calcRepo.FirstOrDefaultAsync(spec, ct: ct);

            return calculation;
        }
    }
}