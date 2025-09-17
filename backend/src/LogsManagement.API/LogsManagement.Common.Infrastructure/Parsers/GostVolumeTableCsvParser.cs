using LogsManagement.Common.Infrastructure.Parsers.Abstractions;
using LogsManagement.Common.Infrastructure.Parsers.Models;
using Microsoft.Extensions.Logging;

namespace LogsManagement.Common.Infrastructure.Parsers;

/// <summary>
/// Парсер для загрузки таблицы объемов ГОСТ из CSV файла
/// </summary>
public class GostVolumeTableCsvParser : CsvFileParser<GostVolumeDto>
{
    public GostVolumeTableCsvParser(ILogger<GostVolumeTableCsvParser> logger) 
        : base(logger, new CsvParserOptions
        {
            Delimiter = ',',
            HasHeader = true,
            Encoding = System.Text.Encoding.UTF8
        })
    {
    }

    public override async Task<ValidationResult> ValidateAsync(IEnumerable<GostVolumeDto> items)
    {
        var errors = new List<ValidationError>();
        var itemsList = items.ToList();

        Logger.LogInformation("Валидация {Count} записей таблицы ГОСТ", itemsList.Count);

        for (var i = 0; i < itemsList.Count; i++)
        {
            var item = itemsList[i];

            // Валидация объема
            if (item.Volume <= 0)
            {
                errors.Add(new ValidationError
                {
                    ItemIndex = i,
                    PropertyName = nameof(GostVolumeDto.Volume),
                    Message = "Объем должен быть больше 0",
                    Value = item.Volume,
                    Type = ValidationErrorType.OutOfRange
                });
            }

            // Проверка разумности объема (не должен превышать геометрический объем цилиндра)
            var maxVolume = Math.PI * Math.Pow((double)item.Diameter / 200, 2) * (double)item.Length;
            if (item.Volume > (decimal)maxVolume)
            {
                errors.Add(new ValidationError
                {
                    ItemIndex = i,
                    PropertyName = nameof(GostVolumeDto.Volume),
                    Message = $"Объем {item.Volume:F3} превышает максимально возможный {maxVolume:F3} для данных размеров",
                    Value = item.Volume,
                    Type = ValidationErrorType.BusinessRule
                });
            }
        }

        // Проверка на дубликаты (одинаковые длина и диаметр)
        var duplicates = itemsList
            .Select((item, index) => new { item, index })
            .GroupBy(x => new { x.item.Length, x.item.Diameter })
            .Where(g => g.Count() > 1)
            .SelectMany(g => g.Skip(1))
            .ToList();

        foreach (var duplicate in duplicates)
        {
            errors.Add(new ValidationError
            {
                ItemIndex = duplicate.index,
                PropertyName = $"{nameof(GostVolumeDto.Length)}, {nameof(GostVolumeDto.Diameter)}",
                Message = "Дублирующаяся запись в таблице ГОСТ",
                Value = $"L:{duplicate.item.Length}, D:{duplicate.item.Diameter}",
                Type = ValidationErrorType.Duplicate
            });
        }

        Logger.LogInformation("Валидация завершена. Ошибок: {ErrorCount}", errors.Count);

        return errors.Count != 0
            ? ValidationResult.Failure(errors) 
            : ValidationResult.Success();
    }
}