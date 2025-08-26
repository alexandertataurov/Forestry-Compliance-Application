using Microsoft.AspNetCore.Mvc;

namespace LogsManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogEntriesController : ControllerBase
{
    private readonly ILogger<LogEntriesController> _logger;

    public LogEntriesController(ILogger<LogEntriesController> logger)
    {
        _logger = logger;
    }
} 