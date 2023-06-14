using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class EventTicketType
{
    public Guid EventId { get; set; }

    public Guid TickerTypeId { get; set; }

    public decimal Price { get; set; }

    public virtual Event Event { get; set; } = null!;

    public virtual TicketType TickerType { get; set; } = null!;
}
