using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string UserType { get; set; } = null!;

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<RegistrationsActivity> RegistrationsActivities { get; set; } = new List<RegistrationsActivity>();

    public virtual ICollection<RegistrationsEvent> RegistrationsEvents { get; set; } = new List<RegistrationsEvent>();
}
