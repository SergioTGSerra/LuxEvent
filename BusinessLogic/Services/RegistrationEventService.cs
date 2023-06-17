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
        var registrationsEvent = new RegistrationsEvent
        {
            UserId = userId,
            EventId = registrationEvent.EventId,
        };

        _dbContext.RegistrationsEvents.Add(registrationsEvent);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteRegistrationsEventAsync(Guid id)
    {
        var registrationsEvent = await _dbContext.RegistrationsEvents.FindAsync(id);
        if (registrationsEvent != null)
        {
            _dbContext.RegistrationsEvents.Remove(registrationsEvent);
            await _dbContext.SaveChangesAsync();
        }
    }
}