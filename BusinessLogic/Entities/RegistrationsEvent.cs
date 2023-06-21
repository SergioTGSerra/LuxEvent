using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class RegistrationsEvent
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? EventId { get; set; }

    public Guid? TicketId { get; set; }

    public virtual Event? Event { get; set; }

    public virtual Ticket? Ticket { get; set; }

    public virtual User? User { get; set; }
}
