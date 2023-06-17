using BusinessLogic.Context;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class RegistrationEventService
{
    private readonly ES2DbContext _dbContext;

    public RegistrationEventService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreateRegistrationsEventAsync(RegistrationEventModel registrationEvent, Guid? userId)
    {
        bool exists = await _dbContext.RegistrationsEvents
            .AnyAsync(e => e.EventId == registrationEvent.EventId && e.UserId == userId);

        if (!exists)
        {
            var registrationsEvent = new RegistrationsEvent
            {
                UserId = userId,
                EventId = registrationEvent.EventId,
            };

            _dbContext.RegistrationsEvents.Add(registrationsEvent);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteRegistrationsEventAsync(RegistrationEventModel registrationEvent, Guid? userId)
    {
        var registrationsEvent = await _dbContext.RegistrationsEvents
            .FirstOrDefaultAsync(e => e.EventId == registrationEvent.EventId && e.UserId == userId);

        if (registrationsEvent != null)
        {
            _dbContext.RegistrationsEvents.Remove(registrationsEvent);
            await _dbContext.SaveChangesAsync();
        }
    }
    
    public async Task<List<RegistrationEventModel>> GetRegistrationsEventsByUserAsync(Guid userId)
    {
        var registrationsEvents = await _dbContext.RegistrationsEvents
            .Where(e => e.UserId == userId)
            .ToListAsync();

        var registrationEventModels = registrationsEvents.Select(e => new RegistrationEventModel
        {
            EventId = e.EventId,
            // Outros campos que você desejar incluir
        }).ToList();

        return registrationEventModels;
    }

}