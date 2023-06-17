using BusinessLogic.Context;
using BusinessLogic.Entities;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class TicketService
{
    private readonly ES2DbContext _dbContext;

    public TicketService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Ticket>> GetAllTickets()
    {
        return await _dbContext.Tickets.ToListAsync();
    }

    public async Task<Ticket> GetTicketById(Guid id)
    {
        return await _dbContext.Tickets.FindAsync(id);
    }

    public async Task CreateTicket(Ticket ticket)
    {
        _dbContext.Tickets.Add(ticket);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateTicket(Ticket ticket)
    {
        _dbContext.Entry(ticket).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteTicket(Guid id)
    {
        var ticket = await _dbContext.Tickets.FindAsync(id);
        if (ticket != null)
        {
            _dbContext.Tickets.Remove(ticket);
            await _dbContext.SaveChangesAsync();
        }
    }
}