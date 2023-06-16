using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class ActivityService
{
    private readonly ES2DbContext _dbContext;

    public ActivityService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Activity>> GetAllActivitiesAsync()
    {
        return await _dbContext.Activities.ToListAsync();
    }

    public async Task<Activity?> GetActivityByIdAsync(Guid id)
    {
        return await _dbContext.Activities.FindAsync(id);
    }

    public async Task CreateActivityAsync(Activity activity)
    {
        _dbContext.Activities.Add(activity);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateActivityAsync(Activity activity)
    {
        _dbContext.Entry(activity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteActivityAsync(Guid id)
    {
        var activity = await _dbContext.Activities.FindAsync(id);
        if (activity != null)
        {
            _dbContext.Activities.Remove(activity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
