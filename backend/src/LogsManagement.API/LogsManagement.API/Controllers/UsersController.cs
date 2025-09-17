using LogsManagement.API.Authorization;
using LogsManagement.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace LogsManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    [HttpGet]
    [RequirePermission(Permission.ViewUsers)]
    public async Task<IActionResult> GetUsers()
    {
        // Логика получения пользователей
        return Ok();
    }

    [HttpPost]
    [RequirePermission(Permission.CreateUsers)]
    public async Task<IActionResult> CreateUser()
    {
        // Логика создания пользователя
        return Ok();
    }

    [HttpPut("{id}")]
    [RequirePermission(Permission.EditUsers)]
    public async Task<IActionResult> UpdateUser(Guid id)
    {
        // Логика обновления пользователя
        return Ok();
    }

    [HttpDelete("{id}")]
    [RequirePermission(Permission.DeleteUsers)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        // Логика удаления пользователя
        return Ok();
    }
}