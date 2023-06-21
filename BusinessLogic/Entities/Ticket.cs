using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class Ticket
{
    public Guid Id { get; set; }

    public Guid? EventId { get; set; }

    public Guid? TicketTypeId { get; set; }

    public decimal Price { get; set; }

    public int? MaxParticipants { get; set; }

    public virtual Event? Event { get; set; }

    public virtual ICollection<RegistrationsEvent> RegistrationsEvents { get; set; } = new List<RegistrationsEvent>();

    public virtual TicketType? TicketType { get; set; }
}
