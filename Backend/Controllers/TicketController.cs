using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly TicketService _ticketService;

    public TicketsController(TicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Ticket>>> GetAllTickets()
    {
        var tickets = await _ticketService.GetAllTickets();
        return Ok(tickets);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Ticket>> GetTicketById(Guid id)
    {
        var ticket = await _ticketService.GetTicketById(id);
        if (ticket == null)
        {
            return NotFound();
        }
        return Ok(ticket);
    }

    [HttpPost]
    public async Task<ActionResult> CreateTicket(Ticket ticket)
    {
        await _ticketService.CreateTicket(ticket);
        return CreatedAtAction(nameof(GetTicketById), new { id = ticket.Id }, ticket);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateTicket(Guid id, Ticket ticket)
    {
        if (id != ticket.Id)
        {
            return BadRequest();
        }

        await _ticketService.UpdateTicket(ticket);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteTicket(Guid id)
    {
        await _ticketService.DeleteTicket(id);
        return NoContent();
    }
}
