namespace LogsManagement.Common.Domain.Interfaces
{
    public interface IEntity : ICreateInfo, IUpdateInfo
    {
        public Guid Id { get; set; }
    }
}
