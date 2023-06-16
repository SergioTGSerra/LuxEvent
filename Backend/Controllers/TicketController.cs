using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TicketsController : ControllerBase
{
    private readonly TicketService _ticketService;

    public TicketsController(TicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpPost]
    public IActionResult CreateTicket(Guid eventId, Guid ticketTypeId, decimal price)
    {
        var ticket = _ticketService.CreateTicket(eventId, ticketTypeId, price);
        return Ok(ticket);
    }

    [HttpGet("{ticketId}")]
    public IActionResult GetTicket(Guid ticketId)
    {
        var ticket = _ticketService.GetTicket(ticketId);
        if (ticket == null)
            return NotFound();

        return Ok(ticket);
    }

    [HttpGet]
    public IActionResult GetAllTickets()
    {
        var tickets = _ticketService.GetAllTickets();
        return Ok(tickets);
    }

    [HttpPut("{ticketId}")]
    public IActionResult UpdateTicket(Guid ticketId, decimal price)
    {
        _ticketService.UpdateTicket(ticketId, price);
        return NoContent();
    }

    [HttpDelete("{ticketId}")]
    public IActionResult DeleteTicket(Guid ticketId)
    {
        _ticketService.DeleteTicket(ticketId);
        return NoContent();
    }
}
