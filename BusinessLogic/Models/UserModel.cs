namespace BusinessLogic.Models;

public class UserModel
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string Username { get; set; } = null!;
    
    public string Email { get; set; } = null!;

    public string UserType { get; set; } = null!;
}