namespace LogsManagement.Common.Infrastructure.Parsers.Models;

/// <summary>
/// Результат валидации данных
/// </summary>
public class ValidationResult
{
    public bool IsValid { get; init; }

    public IReadOnlyList<ValidationError> Errors { get; init; } = [];

    public static ValidationResult Success()
    {
        return new ValidationResult { IsValid = true };
    }

    public static ValidationResult Failure(IEnumerable<ValidationError> errors)
    {
        return new ValidationResult
        {
            IsValid = false,
            Errors = errors.ToList()
        };
    }
}

/// <summary>
/// Ошибка валидации
/// </summary>
public class ValidationError
{
    public int ItemIndex { get; init; }

    public string PropertyName { get; init; } = string.Empty;

    public string Message { get; init; } = string.Empty;

    public object? Value { get; init; }

    public ValidationErrorType Type { get; init; }
}

/// <summary>
/// Тип ошибки валидации
/// </summary>
public enum ValidationErrorType
{
    Required,
    InvalidFormat,
    OutOfRange,
    Duplicate,
    BusinessRule,
    Reference
}