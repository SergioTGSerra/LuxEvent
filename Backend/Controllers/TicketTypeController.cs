using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketTypesController : ControllerBase
    {
        private readonly TicketTypeService _ticketTypeService;

        public TicketTypesController(TicketTypeService ticketTypeService)
        {
            _ticketTypeService = ticketTypeService;
        }

        [HttpGet]
        public async Task<ActionResult<List<TicketType>>> GetAllTicketTypes()
        {
            var ticketTypes = await _ticketTypeService.GetAllTicketTypesAsync();
            return Ok(ticketTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TicketType>> GetTicketTypeById(Guid id)
        {
            var ticketType = await _ticketTypeService.GetTicketTypeByIdAsync(id);
            if (ticketType == null)
            {
                return NotFound();
            }

            return Ok(ticketType);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTicketType(TicketType ticketType)
        {
            await _ticketTypeService.CreateTicketTypeAsync(ticketType);
            return CreatedAtAction(nameof(GetTicketTypeById), new { id = ticketType.Id }, ticketType);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicketType(Guid id, TicketType ticketType)
        {
            try
            {
                await _ticketTypeService.UpdateTicketTypeAsync(id, ticketType);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketType(Guid id)
        {
            try
            {
                await _ticketTypeService.DeleteTicketTypeAsync(id);
                return NoContent();
            }
            catch (ArgumentException)
            {
                return NotFound();
            }
        }
    }
}