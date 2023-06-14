using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class TicketType
{
    public Guid Id { get; set; }

    public string Nome { get; set; } = null!;

    public virtual ICollection<EventTicketType> EventTicketTypes { get; set; } = new List<EventTicketType>();
}
