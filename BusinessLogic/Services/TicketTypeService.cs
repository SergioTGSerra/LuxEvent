using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class TicketTypeService
{
    private readonly ES2DbContext _dbContext;

    public TicketTypeService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<TicketType>> GetAllTicketTypesAsync()
    {
        return await _dbContext.TicketTypes.ToListAsync();
    }

    public async Task<TicketType?> GetTicketTypeByIdAsync(Guid id)
    {
        return await _dbContext.TicketTypes.FindAsync(id);
    }

    public async Task CreateTicketTypeAsync(TicketType ticketType)
    {
        _dbContext.TicketTypes.Add(ticketType);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateTicketTypeAsync(Guid id, TicketType ticketType)
    {
        var existingTicketType = await _dbContext.TicketTypes.FindAsync(id);
        if (existingTicketType == null)
        {
            throw new ArgumentException("Ticket type not found.");
        }

        existingTicketType.Nome = ticketType.Nome;

        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteTicketTypeAsync(Guid id)
    {
        var ticketType = await _dbContext.TicketTypes.FindAsync(id);
        if (ticketType == null)
        {
            throw new ArgumentException("Ticket type not found.");
        }

        _dbContext.TicketTypes.Remove(ticketType);
        await _dbContext.SaveChangesAsync();
    }
}