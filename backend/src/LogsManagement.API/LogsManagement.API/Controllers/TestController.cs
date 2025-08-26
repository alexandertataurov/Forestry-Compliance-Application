using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using LogsManagement.API.Extensions;

namespace LogsManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    [HttpGet("trace")]
    public async Task<IActionResult> GenerateTrace()
    {
        using var activity = TelemetryExtensions.ApplicationActivitySource.StartActivity("TestController.GenerateTrace");
        
        _logger.LogInformation("🔍 Starting manual trace generation");
        
        activity?.SetTag("test.operation", "manual-trace");
        activity?.SetTag("test.timestamp", DateTimeOffset.UtcNow.ToString());
        activity?.SetTag("test.controller", "TestController");
        activity?.SetTag("test.action", "GenerateTrace");
        
        _logger.LogInformation("🔍 Generating test trace at {Timestamp}", DateTimeOffset.UtcNow);
        
        // Simulate some work
        activity?.AddEvent(new ActivityEvent("Starting processing"));
        await Task.Delay(100);
        
        // Add some events
        activity?.AddEvent(new ActivityEvent("Processing step 1"));
        await Task.Delay(50);
        activity?.AddEvent(new ActivityEvent("Processing step 2"));
        await Task.Delay(25);
        activity?.AddEvent(new ActivityEvent("Processing completed"));
        
        var result = new
        {
            Message = "Trace generated successfully",
            TraceId = Activity.Current?.TraceId.ToString(),
            SpanId = Activity.Current?.SpanId.ToString(),
            ParentId = Activity.Current?.ParentId?.ToString(),
            ActivityName = activity?.DisplayName,
            Timestamp = DateTimeOffset.UtcNow
        };
        
        _logger.LogInformation("✅ Manual trace completed: TraceId={TraceId}, SpanId={SpanId}", 
            result.TraceId, result.SpanId);
        
        return Ok(result);
    }

    [HttpGet("http-trace")]
    public async Task<IActionResult> GenerateHttpTrace([FromServices] IHttpClientFactory httpClientFactory)
    {
        using var activity = TelemetryExtensions.ApplicationActivitySource.StartActivity("TestController.GenerateHttpTrace");
        
        _logger.LogInformation("🌐 Starting HTTP client trace generation");
        
        activity?.SetTag("test.operation", "http-trace");
        activity?.SetTag("test.controller", "TestController");
        activity?.SetTag("test.action", "GenerateHttpTrace");
        
        var httpClient = httpClientFactory.CreateClient();
        
        try
        {
            // This will generate HTTP client traces
            activity?.AddEvent(new ActivityEvent("Starting HTTP request"));
            var response = await httpClient.GetAsync("https://httpbin.org/delay/1");
            activity?.AddEvent(new ActivityEvent("HTTP request completed"));
            
            var content = await response.Content.ReadAsStringAsync();
            
            var result = new
            {
                Message = "HTTP trace generated successfully",
                TraceId = Activity.Current?.TraceId.ToString(),
                SpanId = Activity.Current?.SpanId.ToString(),
                HttpStatus = response.StatusCode,
                ResponseLength = content.Length,
                Timestamp = DateTimeOffset.UtcNow
            };
            
            _logger.LogInformation("✅ HTTP trace completed: TraceId={TraceId}, Status={Status}", 
                result.TraceId, result.HttpStatus);
            
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Error during HTTP request");
            activity?.SetStatus(ActivityStatusCode.Error, ex.Message);
            activity?.AddEvent(new ActivityEvent("HTTP request failed", DateTimeOffset.UtcNow, 
                new ActivityTagsCollection([new("error.message", ex.Message)])));
            
            return StatusCode(500, new
            {
                Message = "HTTP trace generated with error",
                Error = ex.Message,
                TraceId = Activity.Current?.TraceId.ToString()
            });
        }
    }

    [HttpGet("simple")]
    public IActionResult SimpleTrace()
    {
        _logger.LogInformation("🎯 Simple endpoint called");
        
        return Ok(new
        {
            Message = "Simple endpoint - should generate automatic ASP.NET Core trace",
            TraceId = Activity.Current?.TraceId.ToString(),
            SpanId = Activity.Current?.SpanId.ToString(),
            Timestamp = DateTimeOffset.UtcNow
        });
    }
}