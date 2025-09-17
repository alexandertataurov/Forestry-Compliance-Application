using LogsManagement.Common.Application.Specifications.Abstractions;

namespace LogsManagement.Application.Specifications.Calculation;

public sealed class CalculationByIdSpec(Guid id) 
    : Specification<Domain.Entities.Calculation.Calculation>(x => x.Id == id)
{
}