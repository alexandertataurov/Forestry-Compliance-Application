using LogsManagement.Common.Infrastructure.Parsers.Abstractions;
using LogsManagement.Common.Infrastructure.Parsers.Models;
using Microsoft.Extensions.Logging;
using ClosedXML.Excel;

namespace LogsManagement.Common.Infrastructure.Parsers;

/// <summary>
/// Парсер Excel файлов (требует пакет ClosedXML)
/// </summary>
/// <typeparam name="T">Тип объекта для парсинга</typeparam>
public class ExcelFileParser<T> : BaseFileParser<T> where T : class, new()
{
    private readonly ExcelParserOptions _options;

    public ExcelFileParser(ILogger<ExcelFileParser<T>> logger, ExcelParserOptions? options = null) 
        : base(logger)
    {
        _options = options ?? new ExcelParserOptions();
    }

    public override IEnumerable<string> SupportedExtensions => [".xlsx", ".xlsm"];

    protected override async Task<InternalParseResult<T>> ParseStreamAsync(Stream stream, CancellationToken cancellationToken)
    {
        var errors = new List<ParseError>();
        var items = new List<T>();

        try
        {
            // Используем Task.Run для выполнения синхронного кода в асинхронном контексте
            return await Task.Run(() =>
            {
                using var workbook = new XLWorkbook(stream);
                
                if (workbook.Worksheets.Count == 0)
                {
                    errors.Add(new ParseError
                    {
                        Message = "Excel файл не содержит листов",
                        Type = ParseErrorType.InvalidFormat
                    });
                    return InternalParseResult<T>.Failure(errors, 0, 0);
                }

                // Выбираем лист по имени или индексу
                var worksheet = string.IsNullOrEmpty(_options.WorksheetName)
                    ? workbook.Worksheets.ElementAtOrDefault(_options.WorksheetIndex)
                    : workbook.Worksheets.FirstOrDefault(ws => ws.Name.Equals(_options.WorksheetName, StringComparison.OrdinalIgnoreCase));

                if (worksheet == null)
                {
                    var identifier = string.IsNullOrEmpty(_options.WorksheetName) 
                        ? $"индексом {_options.WorksheetIndex}" 
                        : $"именем '{_options.WorksheetName}'";
                        
                    errors.Add(new ParseError
                    {
                        Message = $"Лист с {identifier} не найден",
                        Type = ParseErrorType.InvalidFormat
                    });
                    return InternalParseResult<T>.Failure(errors, 0, 0);
                }

                var usedRange = worksheet.RangeUsed();
                if (usedRange == null)
                {
                    Logger.LogInformation("Excel файл пуст или лист '{WorksheetName}' не содержит данных", 
                        worksheet.Name);
                    return InternalParseResult<T>.Success([], 0);
                }

                var totalRows = usedRange.RowCount();
                Logger.LogInformation("Найдено {TotalRows} строк в листе '{WorksheetName}'", 
                    totalRows, worksheet.Name);

                var columnMapping = GetColumnMapping();
                var headerMapping = _options.HasHeader 
                    ? CreateHeaderMappingFromWorksheet(worksheet, columnMapping, usedRange)
                    : CreateDefaultHeaderMappingFromWorksheet(usedRange, columnMapping);

                if (headerMapping.Count == 0)
                {
                    errors.Add(new ParseError
                    {
                        Message = "Не найдено соответствие между заголовками Excel и свойствами объекта",
                        Type = ParseErrorType.InvalidFormat
                    });
                    return InternalParseResult<T>.Failure(errors, totalRows, 0);
                }

                var startRow = _options.HasHeader ? _options.HeaderRow + 1 : usedRange.FirstRow().RowNumber();
                var endRow = _options.MaxRows > 0 
                    ? Math.Min(usedRange.LastRow().RowNumber(), startRow + _options.MaxRows - 1)
                    : usedRange.LastRow().RowNumber();

                for (var rowNumber = startRow; rowNumber <= endRow; rowNumber++)
                {
                    // Проверяем токен отмены
                    if (cancellationToken.IsCancellationRequested)
                    {
                        Logger.LogInformation("Парсинг прерван по запросу отмены на строке {RowNumber}", rowNumber);
                        cancellationToken.ThrowIfCancellationRequested();
                    }

                    try
                    {
                        var row = worksheet.Row(rowNumber);
                        
                        // Проверяем, не пустая ли строка
                        if (_options.SkipEmptyRows && IsEmptyRow(row, headerMapping, usedRange))
                        {
                            Logger.LogDebug("Пропускаем пустую строку {RowNumber}", rowNumber);
                            continue;
                        }

                        var parseResult = ParseClosedXmlRowToObject(row, headerMapping, columnMapping, rowNumber, usedRange);
                        
                        if (parseResult.Item != null)
                        {
                            items.Add(parseResult.Item);
                        }

                        errors.AddRange(parseResult.Errors);
                    }
                    catch (Exception ex)
                    {
                        Logger.LogWarning(ex, "Ошибка парсинга строки {RowNumber} в Excel", rowNumber);
                        errors.Add(new ParseError
                        {
                            RowIndex = rowNumber,
                            Message = $"Ошибка парсинга строки: {ex.Message}",
                            Type = ParseErrorType.InvalidFormat
                        });
                    }
                }

                Logger.LogInformation("Парсинг Excel завершен. Обработано строк: {ProcessedRows}, Успешно: {SuccessCount}, Ошибок: {ErrorCount}",
                    endRow - startRow + 1, items.Count, errors.Count);

                return InternalParseResult<T>.Success(items, totalRows);
            }, cancellationToken);
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Критическая ошибка при парсинге Excel файла");
            errors.Add(new ParseError
            {
                Message = $"Ошибка чтения Excel файла: {ex.Message}",
                Type = ParseErrorType.InvalidFormat
            });
            return InternalParseResult<T>.Failure(errors, 0, 0);
        }
    }

    private Dictionary<string, int> CreateHeaderMappingFromWorksheet(IXLWorksheet worksheet, 
        Dictionary<string, System.Reflection.PropertyInfo> columnMapping, IXLRange usedRange)
    {
        var mapping = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var headerRow = worksheet.Row(_options.HeaderRow);

        Logger.LogDebug("Создание маппинга заголовков из {ColumnCount} колонок в строке {HeaderRow}", 
            usedRange.ColumnCount(), _options.HeaderRow);

        for (var col = usedRange.FirstColumn().ColumnNumber(); col <= usedRange.LastColumn().ColumnNumber(); col++)
        {
            var headerValue = headerRow.Cell(col).GetString().Trim();
            
            if (!string.IsNullOrWhiteSpace(headerValue))
            {
                // Ищем точное совпадение или по алиасам в columnMapping
                var matchedProperty = columnMapping.Keys.FirstOrDefault(key => 
                    string.Equals(key, headerValue, StringComparison.OrdinalIgnoreCase));

                if (matchedProperty != null)
                {
                    mapping[matchedProperty] = col;
                    Logger.LogDebug("Найдено соответствие: заголовок '{HeaderValue}' -> свойство '{PropertyName}'", 
                        headerValue, matchedProperty);
                }
                else
                {
                    Logger.LogDebug("Не найдено соответствие для заголовка '{HeaderValue}'", headerValue);
                }
            }
        }

        Logger.LogInformation("Создан маппинг для {MappedCount} из {TotalCount} заголовков", 
            mapping.Count, usedRange.ColumnCount());

        return mapping;
    }

    private Dictionary<string, int> CreateDefaultHeaderMappingFromWorksheet(IXLRange usedRange, 
        Dictionary<string, System.Reflection.PropertyInfo> columnMapping)
    {
        var mapping = new Dictionary<string, int>();
        var columnIndex = usedRange.FirstColumn().ColumnNumber();

        Logger.LogDebug("Создание маппинга по умолчанию для {PropertyCount} свойств", columnMapping.Count);

        foreach (var propertyName in columnMapping.Keys)
        {
            if (columnIndex <= usedRange.LastColumn().ColumnNumber())
            {
                mapping[propertyName] = columnIndex;
                Logger.LogDebug("Маппинг по умолчанию: свойство '{PropertyName}' -> колонка {ColumnIndex}", 
                    propertyName, columnIndex);
                columnIndex++;
            }
            else
            {
                Logger.LogWarning("Недостаточно колонок в Excel для свойства '{PropertyName}'", propertyName);
                break;
            }
        }

        return mapping;
    }

    private bool IsEmptyRow(IXLRow row, Dictionary<string, int> headerMapping, IXLRange usedRange)
    {
        foreach (var columnIndex in headerMapping.Values)
        {
            if (columnIndex >= usedRange.FirstColumn().ColumnNumber() && 
                columnIndex <= usedRange.LastColumn().ColumnNumber())
            {
                var cellValue = row.Cell(columnIndex).Value;
                if (string.IsNullOrWhiteSpace(cellValue.ToString()))
                {
                    return false;
                }
            }
        }
        return true;
    }

    private (T? Item, List<ParseError> Errors) ParseClosedXmlRowToObject(
        IXLRow row, 
        Dictionary<string, int> headerMapping, 
        Dictionary<string, System.Reflection.PropertyInfo> columnMapping, 
        int rowNumber,
        IXLRange usedRange)
    {
        var item = new T();
        var errors = new List<ParseError>();

        foreach (var kvp in headerMapping)
        {
            var propertyName = kvp.Key;
            var columnIndex = kvp.Value;

            if (!columnMapping.TryGetValue(propertyName, out var property))
            {
                Logger.LogDebug("Свойство '{PropertyName}' не найдено в маппинге колонок", propertyName);
                continue;
            }

            try
            {
                var cell = row.Cell(columnIndex);
                var cellValue = cell.Value;
                
                // ClosedXML автоматически определяет типы данных
                if (property.PropertyType == typeof(DateTime) || property.PropertyType == typeof(DateTime?))
                {
                    if (cell.TryGetValue(out DateTime dateTime))
                    {
                        property.SetValue(item, dateTime);
                        continue;
                    }
                }
                else if (property.PropertyType == typeof(decimal) || property.PropertyType == typeof(decimal?))
                {
                    if (cell.TryGetValue(out decimal decimalValue))
                    {
                        property.SetValue(item, decimalValue);
                        continue;
                    }
                }
                else if (property.PropertyType == typeof(double) || property.PropertyType == typeof(double?))
                {
                    if (cell.TryGetValue(out double doubleValue))
                    {
                        property.SetValue(item, doubleValue);
                        continue;
                    }
                }
                else if (property.PropertyType == typeof(int) || property.PropertyType == typeof(int?))
                {
                    if (cell.TryGetValue(out int intValue))
                    {
                        property.SetValue(item, intValue);
                        continue;
                    }
                }
                else if (property.PropertyType == typeof(bool) || property.PropertyType == typeof(bool?))
                {
                    if (cell.TryGetValue(out bool boolValue))
                    {
                        property.SetValue(item, boolValue);
                        continue;
                    }
                }

                // Общее преобразование через строку
                var stringValue = cell.GetString();
                var convertedValue = ConvertValue(stringValue, property.PropertyType, out var success);

                if (success)
                {
                    property.SetValue(item, convertedValue);
                }
                else
                {
                    errors.Add(new ParseError
                    {
                        RowIndex = rowNumber,
                        ColumnName = propertyName,
                        Message = $"Не удалось преобразовать значение '{stringValue}' к типу {property.PropertyType.Name}",
                        Value = stringValue,
                        Type = ParseErrorType.ConversionError
                    });
                }
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Ошибка установки значения для свойства '{PropertyName}' в строке {RowNumber}", 
                    propertyName, rowNumber);
                
                errors.Add(new ParseError
                {
                    RowIndex = rowNumber,
                    ColumnName = propertyName,
                    Message = $"Ошибка установки значения: {ex.Message}",
                    Type = ParseErrorType.ConversionError
                });
            }
        }

        return errors.Any() ? (default(T), errors) : (item, errors);
    }
}

/// <summary>
/// Настройки парсера Excel
/// </summary>
public class ExcelParserOptions
{
    /// <summary>
    /// Индекс листа для парсинга (0-based)
    /// </summary>
    public int WorksheetIndex { get; set; } = 0;

    /// <summary>
    /// Имя листа для парсинга (если указано, то WorksheetIndex игнорируется)
    /// </summary>
    public string? WorksheetName { get; set; }

    /// <summary>
    /// Содержит ли первая строка заголовки
    /// </summary>
    public bool HasHeader { get; set; } = true;

    /// <summary>
    /// Номер строки с заголовками (1-based)
    /// </summary>
    public int HeaderRow { get; set; } = 1;

    /// <summary>
    /// Максимальное количество строк для обработки (0 = без ограничений)
    /// </summary>
    public int MaxRows { get; set; } = 0;

    /// <summary>
    /// Пропускать пустые строки
    /// </summary>
    public bool SkipEmptyRows { get; set; } = true;
}