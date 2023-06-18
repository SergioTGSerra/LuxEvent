using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventReportsController : ControllerBase
{
    private readonly EventReportService _eventReportService;

    public EventReportsController(EventReportService eventReportService)
    {
        _eventReportService = eventReportService;
    }

    [HttpGet("event-count-by-category/{categoryId}")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<ActionResult<int>> GetEventCountByCategory(Guid categoryId)
    {
        var count = await _eventReportService.GetEventCountByCategory(categoryId);
        return Ok(count);
    }

    [HttpGet("most-popular-events/")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<ActionResult<IEnumerable<Event>>> GetMostPopularEvents()
    {
        var events = await _eventReportService.GetMostPopularEvents();
        return Ok(events);
    }

    [HttpGet("total-participants-count")]
    [Authorize(Roles = "User,Organizer,Admin")]
    public async Task<ActionResult<int>> GetTotalParticipantsCount()
    {
        var count = await _eventReportService.GetTotalParticipantsCount();
        return Ok(count);
    }
}
