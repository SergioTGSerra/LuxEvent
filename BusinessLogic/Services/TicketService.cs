using BusinessLogic.Context;
using BusinessLogic.Entities;

namespace BusinessLogic.Services;

public class TicketService
{
    private readonly ES2DbContext _dbContext;

    public TicketService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public Ticket CreateTicket(Guid eventId, Guid ticketTypeId, decimal price)
    {
        var ticket = new Ticket
        {
            Id = Guid.NewGuid(),
            EventId = eventId,
            TicketTypeId = ticketTypeId,
            Price = price
        };

        _dbContext.Tickets.Add(ticket);
        _dbContext.SaveChanges();

        return ticket;
    }

    public Ticket GetTicket(Guid ticketId)
    {
        return _dbContext.Tickets.FirstOrDefault(t => t.Id == ticketId);
    }

    public IEnumerable<Ticket> GetAllTickets()
    {
        return _dbContext.Tickets.ToList();
    }

    public void UpdateTicket(Guid ticketId, decimal price)
    {
        var ticket = _dbContext.Tickets.FirstOrDefault(t => t.Id == ticketId);
        if (ticket != null)
        {
            ticket.Price = price;
            _dbContext.SaveChanges();
        }
    }

    public void DeleteTicket(Guid ticketId)
    {
        var ticket = _dbContext.Tickets.FirstOrDefault(t => t.Id == ticketId);
        if (ticket != null)
        {
            _dbContext.Tickets.Remove(ticket);
            _dbContext.SaveChanges();
        }
    }
}