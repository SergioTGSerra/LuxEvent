﻿using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class Activity
{
    public Guid Id { get; set; }

    public Guid? EventId { get; set; }

    public string Nome { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateOnly Date { get; set; }

    public virtual Event? Event { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
