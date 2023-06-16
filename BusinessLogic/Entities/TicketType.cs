using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class TicketType
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
}
