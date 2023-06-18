using BusinessLogic.Context;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class RegistrationActivityService
{
    private readonly ES2DbContext _dbContext;

    public RegistrationActivityService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task CreateRegistrationsActivityAsync(RegistrationActivityModel registrationActivity, Guid? userId)
    {
        // Obter o EventId com base no ActivityId
        var activity = await _dbContext.Activities.FindAsync(registrationActivity.ActivityId);
        if (activity == null)
        {
            throw new Exception("A atividade não foi encontrada.");
        }

        // Verificar se o usuário está inscrito no evento relacionado
        bool eventExists = await _dbContext.RegistrationsEvents
            .AnyAsync(e => e.EventId == activity.EventId && e.UserId == userId);

        if (!eventExists)
        {
            throw new Exception("O usuário não está inscrito no evento relacionado.");
        }

        bool activityExists = await _dbContext.RegistrationsActivities
            .AnyAsync(a => a.ActivityId == registrationActivity.ActivityId && a.UserId == userId);

        if (!activityExists)
        {
            var registrationsActivity = new RegistrationsActivity
            {
                UserId = userId,
                ActivityId = registrationActivity.ActivityId,
            };

            _dbContext.RegistrationsActivities.Add(registrationsActivity);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task DeleteRegistrationsActivityAsync(RegistrationActivityModel registrationActivity, Guid? userId)
    {
        var registrationsActivity = await _dbContext.RegistrationsActivities
            .FirstOrDefaultAsync(a => a.ActivityId == registrationActivity.ActivityId && a.UserId == userId);

        if (registrationsActivity != null)
        {
            _dbContext.RegistrationsActivities.Remove(registrationsActivity);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<List<RegistrationActivityModel>> GetRegistrationsActivitiesByUserAsync(Guid userId)
    {
        var registrationsActivities = await _dbContext.RegistrationsActivities
            .Include(a => a.Activity) // Carrega a atividade relacionada
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var registrationActivityModels = registrationsActivities.Select(a => new RegistrationActivityModel
        {
            ActivityId = a.ActivityId,
            EventId = a.Activity != null ? a.Activity.EventId : null,
            // Outros campos que você desejar incluir
        }).ToList();

        return registrationActivityModels;
    }
}