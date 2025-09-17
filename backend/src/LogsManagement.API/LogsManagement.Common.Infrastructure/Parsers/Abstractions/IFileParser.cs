using LogsManagement.Common.Infrastructure.Parsers.Models;

namespace LogsManagement.Common.Infrastructure.Parsers.Abstractions;

/// <summary>
/// Интерфейс для парсера файлов
/// </summary>
/// <typeparam name="T">Тип объекта, в который парсится файл</typeparam>
public interface IFileParser<T> where T : class
{
    /// <summary>
    /// Поддерживаемые расширения файлов
    /// </summary>
    IEnumerable<string> SupportedExtensions { get; }

    /// <summary>
    /// Парсинг файла из потока
    /// </summary>
    /// <param name="stream">Поток данных файла</param>
    /// <param name="fileName">Имя файла для определения типа</param>
    /// <param name="cancellationToken">Токен отмены</param>
    /// <returns>Результат парсинга</returns>
    Task<FileParseResult<T>> ParseAsync(Stream stream, string fileName, CancellationToken cancellationToken = default);

    /// <summary>
    /// Валидация данных после парсинга
    /// </summary>
    /// <param name="items">Элементы для валидации</param>
    /// <returns>Результат валидации</returns>
    Task<ValidationResult> ValidateAsync(IEnumerable<T> items);
}