using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class ActivityService
{
    private readonly ES2DbContext dbContext;

    public ActivityService(ES2DbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<List<Activity>> GetActivitiesAsync()
    {
        return await dbContext.Activities.ToListAsync();
    }

    public async Task<Activity> GetActivityByIdAsync(Guid id)
    {
        return await dbContext.Activities.FindAsync(id);
    }

    public async Task CreateActivityAsync(Activity activity)
    {
        dbContext.Activities.Add(activity);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateActivityAsync(Activity activity)
    {
        dbContext.Entry(activity).State = EntityState.Modified;
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteActivityAsync(Guid id)
    {
        var activity = await dbContext.Activities.FindAsync(id);
        if (activity != null)
        {
            dbContext.Activities.Remove(activity);
            await dbContext.SaveChangesAsync();
        }
    }
}
