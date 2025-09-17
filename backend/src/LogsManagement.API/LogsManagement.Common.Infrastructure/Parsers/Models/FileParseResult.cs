namespace LogsManagement.Common.Infrastructure.Parsers.Models;

/// <summary>
/// Результат парсинга файла
/// </summary>
/// <typeparam name="T">Тип распарсенных объектов</typeparam>
public class FileParseResult<T> where T : class
{
    public bool IsSuccess { get; init; }

    public IReadOnlyList<T> Data { get; init; } = [];

    public IReadOnlyList<ParseError> Errors { get; init; } = [];

    public FileMetadata Metadata { get; init; } = new();

    public static FileParseResult<T> Success(IEnumerable<T> data, FileMetadata? metadata = null)
    {
        return new FileParseResult<T>
        {
            IsSuccess = true,
            Data = data.ToList(),
            Metadata = metadata ?? new FileMetadata()
        };
    }

    public static FileParseResult<T> Failure(IEnumerable<ParseError> errors, FileMetadata? metadata = null)
    {
        return new FileParseResult<T>
        {
            IsSuccess = false,
            Errors = errors.ToList(),
            Metadata = metadata ?? new FileMetadata()
        };
    }
}

/// <summary>
/// Ошибка парсинга
/// </summary>
public class ParseError
{
    public int RowIndex { get; init; }

    public string ColumnName { get; init; } = string.Empty;

    public string Message { get; init; } = string.Empty;

    public string? Value { get; init; }

    public ParseErrorType Type { get; init; }
}

/// <summary>
/// Тип ошибки парсинга
/// </summary>
public enum ParseErrorType
{
    InvalidFormat,
    RequiredFieldMissing,
    ValidationFailed,
    ConversionError,
    UnknownColumn,
    DuplicateData
}

/// <summary>
/// Метаданные файла
/// </summary>
public record class FileMetadata
{
    public string FileName { get; init; } = string.Empty;

    public long FileSize { get; init; }

    public DateTime ParsedAt { get; init; } = DateTime.UtcNow;

    public int TotalRows { get; init; }
    
    public int SuccessfulRows { get; init; }
    
    public int ErrorRows { get; init; }
    
    public string FileType { get; init; } = string.Empty;
}