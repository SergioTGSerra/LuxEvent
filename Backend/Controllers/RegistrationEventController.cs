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
        
        // Chame o serviço passando o userId
        await _registrationEventService.CreateRegistrationsEventAsync(registrationEvent, userIdGuid);

        return Ok();
    }
    

    [HttpDelete("{id}")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<IActionResult> DeleteRegistrationsEvent(Guid id)
    {
        await _registrationEventService.DeleteRegistrationsEventAsync(id);
        return Ok();
    }
}