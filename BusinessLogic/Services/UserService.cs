using BusinessLogic.Context;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using Microsoft.EntityFrameworkCore;

namespace BusinessLogic.Services;

public class UserService
{
    private readonly ES2DbContext _dbContext;

    public UserService(ES2DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserById(Guid id)
    {
        return await _dbContext.Users.FindAsync(id);
    }
    
    public async Task<User?> GetUserByUsernameAndPassword(AuthModel model)
    {
        return await _dbContext.Users
            .FirstOrDefaultAsync(user => user.Username == model.Username && user.Password == model.Password);
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task CreateUser(User user)
    {
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateUser(User user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteUser(Guid id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user != null)
        {
            _dbContext.Users.Remove(user);
            await _dbContext.SaveChangesAsync();
        }
    }
}