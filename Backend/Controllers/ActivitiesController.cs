using BusinessLogic.Entities;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ActivitiesController : ControllerBase
    {
        private readonly ActivityService _activityService;

        public ActivitiesController(ActivityService activityService)
        {
            _activityService = activityService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetAllActivities()
        {
            var activities = await _activityService.GetAllActivitiesAsync();
            return Ok(activities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivityById(Guid id)
        {
            var activity = await _activityService.GetActivityByIdAsync(id);
            if (activity == null)
            {
                return NotFound();
            }
            return Ok(activity);
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await _activityService.CreateActivityAsync(activity);
            return CreatedAtAction(nameof(GetActivityById), new { id = activity.Id }, activity);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, Activity activity)
        {
            if (id != activity.Id)
            {
                return BadRequest();
            }

            await _activityService.UpdateActivityAsync(activity);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            await _activityService.DeleteActivityAsync(id);
            return NoContent();
        }
    }
}