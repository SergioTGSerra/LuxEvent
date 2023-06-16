using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class EventService
{
    private readonly ES2DbContext _dbContext;

    public EventService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .ToListAsync();
    }

    public async Task<Event?> GetEventByIdAsync(Guid eventId)
    {
        return await _dbContext.Events
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == eventId);
    }

    public async Task<Event> CreateEvent(Event ev)
    {
        ev.Id = Guid.NewGuid();
        _dbContext.Events.Add(ev);
        await _dbContext.SaveChangesAsync();
        return ev;
    }

    public async Task<bool> UpdateEventAsync(Guid eventId, Event updatedEvent)
    {
        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == eventId);
        if (existingEvent == null)
        {
            return false;
        }

        existingEvent.Name = updatedEvent.Name;
        existingEvent.Description = updatedEvent.Description;
        // Update other properties as needed

        await _dbContext.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteEventAsync(Guid eventId)
    {
        var existingEvent = await _dbContext.Events.FirstOrDefaultAsync(e => e.Id == eventId);
        if (existingEvent == null)
        {
            return false;
        }

        _dbContext.Events.Remove(existingEvent);
        await _dbContext.SaveChangesAsync();
        return true;
    }
}