namespace LogsManagement.Common.Application.Enums;

public enum TrackingBehavior
{
    Default = 0,           // пусть провайдер решит (обычно с трекингом)
    NoTracking = 1,        // не отслеживать сущности
    IdentityResolution = 2 // EF: AsNoTrackingWithIdentityResolution()
}
