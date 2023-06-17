using System.Security.Claims;
using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RegistrationsEventController : ControllerBase
{
    private readonly RegistrationEventService _registrationEventService;

    public RegistrationsEventController(RegistrationEventService registrationEventService)
    {
        _registrationEventService = registrationEventService;
    }

    [HttpPost]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> CreateRegistrationsEvent(RegistrationEventModel registrationEvent)
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            await _registrationEventService.CreateRegistrationsEventAsync(registrationEvent, userIdGuid);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao criar o RegistrationEvent: {ex.Message}");
        }
    }


    [HttpDelete("{id}")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> DeleteRegistrationsEvent(Guid id)
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            var registrationEvent = new RegistrationEventModel { EventId = id };
            await _registrationEventService.DeleteRegistrationsEventAsync(registrationEvent, userIdGuid);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao excluir o RegistrationEvent: {ex.Message}");
        }
    }
    
    [HttpGet]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> GetRegistrationsEventsByUser()
    {
        // Obter o ID do usuário autenticado
        var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

        Guid.TryParse(userId, out Guid userIdGuid);

        try
        {
            var registrationEvents = await _registrationEventService.GetRegistrationsEventsByUserAsync(userIdGuid);
            return Ok(registrationEvents);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Ocorreu um erro ao obter os RegistrationEvents do usuário: {ex.Message}");
        }
    }
}