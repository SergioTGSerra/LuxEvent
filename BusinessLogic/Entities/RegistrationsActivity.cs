using System;
using System.Collections.Generic;

namespace BusinessLogic.Entities;

public partial class RegistrationsActivity
{
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }

    public Guid? ActivityId { get; set; }

    public virtual Activity? Activity { get; set; }

    public virtual User? User { get; set; }
}
