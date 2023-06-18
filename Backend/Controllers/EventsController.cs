using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly EventService _eventService;

        public EventsController(EventService eventService)
        {
            _eventService = eventService;
        }
        
        [HttpGet("LoggedUser")]
        public async Task<ActionResult<List<Event>>> GetEventsLoggedUser()
        {
            
            var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            Guid.TryParse(userId, out Guid userIdGuid);

            var events = await _eventService.GetEventsByUser(userIdGuid);

            if (events == null || events.Count == 0)
            {
                return NotFound();
            }

            return events;
        }

        [HttpGet]
        [Authorize(Roles = "User,Organizer,Admin")]
        public async Task<ActionResult<List<Event>>> GetEvents()
        {
            var events = await _eventService.GetEvents();
            return Ok(events);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "User,Organizer,Admin")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            var @event = await _eventService.GetEventById(id);
            if (@event == null)
            {
                return NotFound();
            }
            return Ok(@event);
        }

        [HttpPost]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult<Event>> CreateEvent(Event newEvent)
        {
            await _eventService.CreateEvent(newEvent);
            return CreatedAtAction(nameof(GetEvent), new { id = newEvent.Id }, newEvent);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult> UpdateEvent(Guid id, Event updatedEvent)
        {
            if (id != updatedEvent.Id)
            {
                return BadRequest();
            }

            await _eventService.UpdateEvent(updatedEvent);
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizer,Admin")]
        public async Task<ActionResult> DeleteEvent(Guid id)
        {
            await _eventService.DeleteEvent(id);
            return NoContent();
        }
    }

}