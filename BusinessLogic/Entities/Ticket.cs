using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class Ticket
{
    public Guid Id { get; set; }

    public Guid? EventId { get; set; }

    public Guid? TicketTypeId { get; set; }

    public decimal Price { get; set; }

    public virtual Event? Event { get; set; }

    public virtual TicketType? TicketType { get; set; }
}
