namespace LogsManagement.Common.Application.Options;

public sealed class JwtOptions
{
    public string Key { get; set; } = "your-super-secret-jwt-key-minimum-32-characters-long-for-production";
    public string Issuer { get; set; } = "LogsManagement";
    public string Audience { get; set; } = "LogsManagement.Client";
    public int ExpiryMinutes { get; set; } = 60;
}