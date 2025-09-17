using LogsManagement.Common.Infrastructure.Parsers.Abstractions;
using LogsManagement.Common.Infrastructure.Parsers.Models;
using Microsoft.Extensions.Logging;
using System.Globalization;
using System.Text;

namespace LogsManagement.Common.Infrastructure.Parsers;

/// <summary>
/// Парсер CSV файлов
/// </summary>
/// <typeparam name="T">Тип объекта для парсинга</typeparam>
public class CsvFileParser<T> : BaseFileParser<T> where T : class, new()
{
    private readonly CsvParserOptions _options;

    public CsvFileParser(ILogger<CsvFileParser<T>> logger, CsvParserOptions? options = null) 
        : base(logger)
    {
        _options = options ?? new CsvParserOptions();
    }

    public override IEnumerable<string> SupportedExtensions => [".csv", ".txt"];

    protected override async Task<InternalParseResult<T>> ParseStreamAsync(Stream stream, CancellationToken cancellationToken)
    {
        var errors = new List<ParseError>();
        var items = new List<T>();
        var totalRows = 0;

        using var reader = new StreamReader(stream, _options.Encoding);
        var columnMapping = GetColumnMapping();
        Dictionary<string, int>? headerMapping = null;

        var rowIndex = 0;
        
        while (!reader.EndOfStream && !cancellationToken.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line))
                continue;

            totalRows++;

            try
            {
                var columns = ParseCsvLine(line);

                if (rowIndex == 0 && _options.HasHeader)
                {
                    headerMapping = CreateHeaderMapping(columns, columnMapping);
                    rowIndex++;
                    continue;
                }

                if (headerMapping == null && _options.HasHeader)
                {
                    errors.Add(new ParseError
                    {
                        RowIndex = rowIndex + 1,
                        Message = "Не найден заголовок",
                        Type = ParseErrorType.InvalidFormat
                    });
                    rowIndex++;
                    continue;
                }

                var parseResult = ParseRowToObject(columns, headerMapping ?? CreateDefaultHeaderMapping(columnMapping), columnMapping, rowIndex + 1);
                
                if (parseResult.Item != null)
                {
                    items.Add(parseResult.Item);
                }

                errors.AddRange(parseResult.Errors);
            }
            catch (Exception ex)
            {
                Logger.LogWarning(ex, "Ошибка парсинга строки {RowIndex}", rowIndex + 1);
                errors.Add(new ParseError
                {
                    RowIndex = rowIndex + 1,
                    Message = $"Ошибка парсинга строки: {ex.Message}",
                    Type = ParseErrorType.InvalidFormat
                });
            }

            rowIndex++;
        }

        return errors.Any(e => e.Type == ParseErrorType.InvalidFormat) && !items.Any()
            ? InternalParseResult<T>.Failure(errors, totalRows, items.Count)
            : InternalParseResult<T>.Success(items, totalRows);
    }

    private string[] ParseCsvLine(string line)
    {
        var columns = new List<string>();
        var current = new StringBuilder();
        var inQuotes = false;

        for (var i = 0; i < line.Length; i++)
        {
            var ch = line[i];

            if (ch == _options.QuoteChar && !inQuotes)
            {
                inQuotes = true;
            }
            else if (ch == _options.QuoteChar && inQuotes)
            {
                if (i + 1 < line.Length && line[i + 1] == _options.QuoteChar)
                {
                    current.Append(_options.QuoteChar);
                    i++; // Пропускаем следующую кавычку
                }
                else
                {
                    inQuotes = false;
                }
            }
            else if (ch == _options.Delimiter && !inQuotes)
            {
                columns.Add(current.ToString());
                current.Clear();
            }
            else
            {
                current.Append(ch);
            }
        }

        columns.Add(current.ToString());
        return columns.ToArray();
    }

    private Dictionary<string, int> CreateHeaderMapping(string[] headers, Dictionary<string, System.Reflection.PropertyInfo> columnMapping)
    {
        var mapping = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

        for (var i = 0; i < headers.Length; i++)
        {
            var header = headers[i].Trim();
            
            if (columnMapping.ContainsKey(header))
            {
                mapping[header] = i;
            }
        }

        return mapping;
    }

    private Dictionary<string, int> CreateDefaultHeaderMapping(Dictionary<string, System.Reflection.PropertyInfo> columnMapping)
    {
        var mapping = new Dictionary<string, int>();
        var index = 0;

        foreach (var column in columnMapping.Keys)
        {
            mapping[column] = index++;
        }

        return mapping;
    }

    private (T? Item, List<ParseError> Errors) ParseRowToObject(
        string[] columns, 
        Dictionary<string, int> headerMapping, 
        Dictionary<string, System.Reflection.PropertyInfo> columnMapping, 
        int rowIndex)
    {
        var item = new T();
        var errors = new List<ParseError>();

        foreach (var kvp in headerMapping)
        {
            var columnName = kvp.Key;
            var columnIndex = kvp.Value;

            if (!columnMapping.TryGetValue(columnName, out var property))
                continue;

            var value = columnIndex < columns.Length ? columns[columnIndex] : null;

            try
            {
                var convertedValue = ConvertValue(value, property.PropertyType, out var success);

                if (success)
                {
                    property.SetValue(item, convertedValue);
                }
                else
                {
                    errors.Add(new ParseError
                    {
                        RowIndex = rowIndex,
                        ColumnName = columnName,
                        Message = $"Не удалось преобразовать значение '{value}' к типу {property.PropertyType.Name}",
                        Value = value,
                        Type = ParseErrorType.ConversionError
                    });
                }
            }
            catch (Exception ex)
            {
                errors.Add(new ParseError
                {
                    RowIndex = rowIndex,
                    ColumnName = columnName,
                    Message = $"Ошибка установки значения: {ex.Message}",
                    Value = value,
                    Type = ParseErrorType.ConversionError
                });
            }
        }

        return errors.Any() ? (null, errors) : (item, errors);
    }
}

/// <summary>
/// Настройки парсера CSV
/// </summary>
public class CsvParserOptions
{
    public char Delimiter { get; set; } = ';';

    public char QuoteChar { get; set; } = '"';

    public bool HasHeader { get; set; } = true;

    public Encoding Encoding { get; set; } = Encoding.UTF8;
}