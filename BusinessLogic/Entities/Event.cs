using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class Event
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateOnly Date { get; set; }

    public string Local { get; set; } = null!;

    public int Maxparticipants { get; set; }

    public Guid? CreatedBy { get; set; }

    public Guid? CategoryId { get; set; }

    public virtual ICollection<Activity> Activities { get; set; } = new List<Activity>();

    public virtual Category? Category { get; set; }

    public virtual User? CreatedByNavigation { get; set; }

    public virtual ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
