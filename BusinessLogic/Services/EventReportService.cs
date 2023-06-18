using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class EventReportService
{
    private readonly ES2DbContext _dbContext;

    public EventReportService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<int> GetEventCountByCategory(Guid categoryId)
    {
        return await _dbContext.Events.CountAsync(e => e.CategoryId == categoryId);
    }

    public async Task<IEnumerable<Event>> GetMostPopularEvents()
    {
        return await _dbContext.Events.OrderByDescending(e => e.RegistrationsEvents.Count)
            .Take(10)
            .ToListAsync();
    }

    public async Task<int> GetTotalParticipantsCount()
    {
        return await _dbContext.RegistrationsEvents.CountAsync();
    }
}