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

    public async Task<List<Event>> GetEvents()
    {
        return await _dbContext.Events.ToListAsync();
    }

    public async Task<Event?> GetEventById(Guid eventId)
    {
        return await _dbContext.Events.FindAsync(eventId);
    }

    public async Task CreateEvent(Event newEvent)
    {
        _dbContext.Events.Add(newEvent);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateEvent(Event updatedEvent)
    {
        _dbContext.Entry(updatedEvent).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteEvent(Guid eventId)
    {
        var eventToDelete = await _dbContext.Events.FindAsync(eventId);
        if (eventToDelete != null)
        {
            _dbContext.Events.Remove(eventToDelete);
            await _dbContext.SaveChangesAsync();
        }
    }
    
    public async Task<List<Event>> GetEventsByUser(Guid userId)
    {
        return await _dbContext.Events.Where(e => e.CreatedBy == userId).ToListAsync();
    }

}