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
        var user = await _dbContext.Users.FirstOrDefaultAsync(user => user.Username == model.Username);
        if (user != null && BCrypt.Net.BCrypt.Verify(model.Password, user.Password)) return user;
        return null;
    }

    public async Task<IEnumerable<User>> GetAllUsers()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task CreateUser(User user)
    {
        // Verificar se o nome de usuário já existe
        var existingUsername = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
        if (existingUsername != null)
        {
            throw new Exception("Username already exists.");
        }

        // Verificar se o email já existe
        var existingEmail = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == user.Email);
        if (existingEmail != null)
        {
            throw new Exception("Email already exists.");
        }

        user.Password = HashPassword(user.Password);
        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<User> UpdateUser(UserModel userModel)
    {
        var existingUser = await _dbContext.Users.FindAsync(userModel.Id);
        
        if (existingUser == null)
        {
            return null;
        }

        // Atualize apenas as propriedades necessárias
        existingUser.Name = userModel.Name;
        existingUser.Email = userModel.Email;
        existingUser.UserType = userModel.UserType;

        await _dbContext.SaveChangesAsync();
        return existingUser;
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
    
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }
}