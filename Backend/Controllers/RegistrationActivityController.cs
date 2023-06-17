using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationsActivityController : ControllerBase
{
    private readonly RegistrationActivityService _registrationActivityService;

    public RegistrationsActivityController(RegistrationActivityService registrationActivityService)
    {
        _registrationActivityService = registrationActivityService;
    }

    [HttpPost]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> CreateRegistrationsActivity(RegistrationActivityModel registrationActivity)
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            await _registrationActivityService.CreateRegistrationsActivityAsync(registrationActivity, userIdGuid);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao criar a RegistrationActivity: {ex.Message}");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> DeleteRegistrationsActivity(Guid id)
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            var registrationActivity = new RegistrationActivityModel { ActivityId = id };
            await _registrationActivityService.DeleteRegistrationsActivityAsync(registrationActivity, userIdGuid);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao excluir a RegistrationActivity: {ex.Message}");
        }
    }

    [HttpGet]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> GetRegistrationsActivitiesByUser()
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            var registrationActivities = await _registrationActivityService.GetRegistrationsActivitiesByUserAsync(userIdGuid);
            return Ok(registrationActivities);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao obter as RegistrationActivities do usuário: {ex.Message}");
        }
    }
}