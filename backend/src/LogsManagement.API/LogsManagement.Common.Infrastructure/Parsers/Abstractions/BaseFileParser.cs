using LogsManagement.Common.Infrastructure.Parsers.Attributes;
using LogsManagement.Common.Infrastructure.Parsers.Models;
using Microsoft.Extensions.Logging;
using System.Reflection;

namespace LogsManagement.Common.Infrastructure.Parsers.Abstractions;

/// <summary>
/// Базовый абстрактный класс для парсеров файлов
/// </summary>
/// <typeparam name="T">Тип объекта, в который парсится файл</typeparam>
public abstract class BaseFileParser<T> : IFileParser<T> where T : class, new()
{
    protected readonly ILogger<BaseFileParser<T>> Logger;

    protected BaseFileParser(ILogger<BaseFileParser<T>> logger)
    {
        Logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public abstract IEnumerable<string> SupportedExtensions { get; }

    public async Task<FileParseResult<T>> ParseAsync(Stream stream, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            var fileExtension = Path.GetExtension(fileName).ToLowerInvariant();
            
            if (!SupportedExtensions.Contains(fileExtension))
            {
                var error = new ParseError
                {
                    Message = $"Неподдерживаемый тип файла: {fileExtension}. Поддерживаемые: {string.Join(", ", SupportedExtensions)}",
                    Type = ParseErrorType.InvalidFormat
                };
                return FileParseResult<T>.Failure([error]);
            }

            var metadata = new FileMetadata
            {
                FileName = fileName,
                FileSize = stream.Length,
                FileType = fileExtension
            };

            Logger.LogInformation("Начало парсинга файла {FileName} размером {FileSize} байт", fileName, stream.Length);

            var parseResult = await ParseStreamAsync(stream, cancellationToken);

            metadata = metadata with
            {
                TotalRows = parseResult.TotalRows,
                SuccessfulRows = parseResult.SuccessfulRows,
                ErrorRows = parseResult.ErrorRows
            };

            if (parseResult.IsSuccess && parseResult.Data.Any())
            {
                var validationResult = await ValidateAsync(parseResult.Data);
                
                if (!validationResult.IsValid)
                {
                    var validationErrors = validationResult.Errors.Select(e => new ParseError
                    {
                        RowIndex = e.ItemIndex,
                        ColumnName = e.PropertyName,
                        Message = e.Message,
                        Value = e.Value?.ToString(),
                        Type = ParseErrorType.ValidationFailed
                    });

                    var allErrors = parseResult.Errors.Concat(validationErrors).ToList();
                    return FileParseResult<T>.Failure(allErrors, metadata);
                }
            }

            var result = parseResult.IsSuccess
                ? FileParseResult<T>.Success(parseResult.Data, metadata)
                : FileParseResult<T>.Failure(parseResult.Errors, metadata);

            Logger.LogInformation("Парсинг файла {FileName} завершен. Успешно: {SuccessCount}, Ошибок: {ErrorCount}",
                fileName, metadata.SuccessfulRows, metadata.ErrorRows);

            return result;
        }
        catch (Exception ex)
        {
            Logger.LogError(ex, "Ошибка при парсинге файла {FileName}", fileName);
            
            var error = new ParseError
            {
                Message = $"Критическая ошибка парсинга: {ex.Message}",
                Type = ParseErrorType.InvalidFormat
            };
            
            return FileParseResult<T>.Failure([error]);
        }
    }

    public virtual Task<ValidationResult> ValidateAsync(IEnumerable<T> items)
    {
        // Базовая валидация - можно переопределить в наследниках
        return Task.FromResult(ValidationResult.Success());
    }

    /// <summary>
    /// Абстрактный метод для парсинга потока данных
    /// </summary>
    protected abstract Task<InternalParseResult<T>> ParseStreamAsync(
        Stream stream, 
        CancellationToken cancellationToken);

    /// <summary>
    /// Получение маппинга колонок для типа T на основе атрибутов
    /// </summary>
    protected Dictionary<string, PropertyInfo> GetColumnMapping()
    {
        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance)
            .Where(p => p.CanWrite);

        var mapping = new Dictionary<string, PropertyInfo>(StringComparer.OrdinalIgnoreCase);

        foreach (var property in properties)
        {
            // Сначала проверяем атрибут ColumnAttribute
            var columnAttr = property.GetCustomAttribute<ColumnAttribute>();
            if (columnAttr != null)
            {
                mapping[columnAttr.Name] = property;
                
                // Добавляем альтернативные имена
                foreach (var alias in columnAttr.Aliases)
                {
                    mapping[alias] = property;
                }
            }
            else
            {
                // Используем имя свойства как имя колонки
                mapping[property.Name] = property;
            }
        }

        return mapping;
    }

    /// <summary>
    /// Безопасное преобразование значения к нужному типу
    /// </summary>
    protected object? ConvertValue(string? value, Type targetType, out bool success)
    {
        success = true;

        if (string.IsNullOrWhiteSpace(value))
        {
            if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return null;
            }

            if (targetType.IsValueType)
            {
                success = false;
                return null;
            }

            return targetType == typeof(string) ? string.Empty : null;
        }

        try
        {
            var underlyingType = Nullable.GetUnderlyingType(targetType) ?? targetType;

            if (underlyingType == typeof(string))
                return value.Trim();

            if (underlyingType == typeof(DateTime))
            {
                if (DateTime.TryParse(value, out var dateTime))
                    return dateTime;
                success = false;
                return null;
            }

            if (underlyingType == typeof(decimal))
            {
                if (decimal.TryParse(value.Replace(',', '.'), out var decimalValue))
                    return decimalValue;
                success = false;
                return null;
            }

            if (underlyingType == typeof(int))
            {
                if (int.TryParse(value, out var intValue))
                    return intValue;
                success = false;
                return null;
            }

            if (underlyingType == typeof(bool))
            {
                value = value.ToLowerInvariant().Trim();
                if (value is "true" or "1" or "да" or "yes")
                    return true;
                if (value is "false" or "0" or "нет" or "no")
                    return false;
                success = false;
                return null;
            }

            return Convert.ChangeType(value, underlyingType);
        }
        catch
        {
            success = false;
            return null;
        }
    }
}