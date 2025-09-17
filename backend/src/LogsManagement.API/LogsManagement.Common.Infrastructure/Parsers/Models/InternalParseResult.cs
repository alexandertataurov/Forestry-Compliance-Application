namespace LogsManagement.Common.Infrastructure.Parsers.Models;

/// <summary>
/// Внутренний результат парсинга
/// </summary>
public class InternalParseResult<T> where T : class
{
    public bool IsSuccess { get; init; }

    public IReadOnlyList<T> Data { get; init; } = [];

    public IReadOnlyList<ParseError> Errors { get; init; } = [];

    public int TotalRows { get; init; }

    public int SuccessfulRows { get; init; }

    public int ErrorRows { get; init; }

    public static InternalParseResult<T> Success(IEnumerable<T> data, int totalRows)
    {
        var dataList = data.ToList();
        return new InternalParseResult<T>
        {
            IsSuccess = true,
            Data = dataList,
            TotalRows = totalRows,
            SuccessfulRows = dataList.Count,
            ErrorRows = totalRows - dataList.Count
        };
    }

    public static InternalParseResult<T> Failure(IEnumerable<ParseError> errors, int totalRows, int successfulRows)
    {
        return new InternalParseResult<T>
        {
            IsSuccess = false,
            Errors = errors.ToList(),
            TotalRows = totalRows,
            SuccessfulRows = successfulRows,
            ErrorRows = totalRows - successfulRows
        };
    }
}