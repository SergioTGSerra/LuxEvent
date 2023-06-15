using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class Ticket
{
    public Guid EventId { get; set; }

    public Guid TicketTypeId { get; set; }

    public decimal Price { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual TicketType TicketType { get; set; } = null!;
}
