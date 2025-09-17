namespace LogsManagement.Common.Infrastructure.Parsers.Attributes;

/// <summary>
/// Атрибут для маппинга свойств на колонки файла
/// </summary>
[AttributeUsage(AttributeTargets.Property)]
public class ColumnAttribute(string name, params string[] aliases) : Attribute
{
    public string Name { get; } = name ?? throw new ArgumentNullException(nameof(name));

    public string[] Aliases { get; } = aliases ?? [];

    public bool IsRequired { get; set; } = false;

    public string? DefaultValue { get; set; }
}