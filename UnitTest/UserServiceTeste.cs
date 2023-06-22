using BusinessLogic.Context;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.EntityFrameworkCore;

namespace UnitTest;

    [TestFixture]
    public class UserServiceTests
    {
        private ES2DbContext _dbContext;
        private UserService _userService;

        [SetUp]
        public void SetUp()
        {
            // Configurar o DbContext usando um banco de dados em memória
            var options = new DbContextOptionsBuilder<ES2DbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _dbContext = new ES2DbContext(options);

            // Inicializar UserService com o DbContext em memória
            _userService = new UserService(_dbContext);
        }

        [TearDown]
        public void TearDown()
        {
            // Limpar o banco de dados em memória após cada teste
            _dbContext.Database.EnsureDeleted();
        }

        [Test]
        public async Task GetUserById_ExistingId_ReturnsUser()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Name = "John Doe" };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            // Act
            var result = await _userService.GetUserById(userId);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(userId, result.Id);
        }

        [Test]
        public async Task GetUserById_NonExistingId_ReturnsNull()
        {
            // Arrange
            var nonExistingId = Guid.NewGuid();

            // Act
            var result = await _userService.GetUserById(nonExistingId);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task GetUserByUsernameAndPassword_ExistingUser_ReturnsUser()
        {
            // Arrange
            var username = "johndoe";
            var password = "password";
            var hashedPassword = _userService.HashPassword(password);
            var user = new User { Username = username, Password = hashedPassword };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            var authModel = new AuthModel { Username = username, Password = password };

            // Act
            var result = await _userService.GetUserByUsernameAndPassword(authModel);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(username, result.Username);
        }

        [Test]
        public async Task GetUserByUsernameAndPassword_NonExistingUser_ReturnsNull()
        {
            // Arrange
            var authModel = new AuthModel { Username = "nonexistinguser", Password = "password" };

            // Act
            var result = await _userService.GetUserByUsernameAndPassword(authModel);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task GetAllUsers_ReturnsAllUsers()
        {
            // Arrange
            var users = new List<User>
            {
                new User { Name = "User 1" },
                new User { Name = "User 2" },
                new User { Name = "User 3" }
            };
            _dbContext.Users.AddRange(users);
            _dbContext.SaveChanges();

            // Act
            var result = await _userService.GetAllUsers();

            // Assert
            Assert.AreEqual(users.Count, result.Count());
        }

        [Test]
        public async Task CreateUser_ValidUser_CreatesUser()
        {
            // Arrange
            var user = new User { Username = "johndoe", Password = "password" };

            // Act
            await _userService.CreateUser(user);

            // Assert
            var createdUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == user.Username);
            Assert.IsNotNull(createdUser);
        }

        [Test]
        public void CreateUser_ExistingUsername_ThrowsException()
        {
            // Arrange
            var existingUser = new User { Username = "existinguser", Password = "password" };
            _dbContext.Users.Add(existingUser);
            _dbContext.SaveChanges();
            var userWithExistingUsername = new User { Username = "existinguser", Password = "password2" };

            // Act & Assert
            Assert.ThrowsAsync<Exception>(async () => await _userService.CreateUser(userWithExistingUsername));
        }

        [Test]
        public async Task UpdateUser_ExistingUser_UpdatesUser()
        {
            // Arrange
            var existingUser = new User { Id = Guid.NewGuid(), Name = "John Doe", Email = "john@example.com" };
            _dbContext.Users.Add(existingUser);
            _dbContext.SaveChanges();
            var userModel = new UserModel { Id = existingUser.Id, Name = "Updated Name", Email = "updated@example.com", UserType = "Admin" };

            // Act
            var result = await _userService.UpdateUser(userModel);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(userModel.Name, result.Name);
            Assert.AreEqual(userModel.Email, result.Email);
            Assert.AreEqual(userModel.UserType, result.UserType);
        }

        [Test]
        public async Task UpdateUser_NonExistingUser_ReturnsNull()
        {
            // Arrange
            var userModel = new UserModel { Id = Guid.NewGuid(), Name = "John Doe", Email = "john@example.com", UserType = "Admin" };

            // Act
            var result = await _userService.UpdateUser(userModel);

            // Assert
            Assert.IsNull(result);
        }

        [Test]
        public async Task DeleteUser_ExistingUser_RemovesUser()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var user = new User { Id = userId, Name = "John Doe" };
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();

            // Act
            await _userService.DeleteUser(userId);

            // Assert
            var deletedUser = await _dbContext.Users.FindAsync(userId);
            Assert.IsNull(deletedUser);
        }

        [Test]
        public async Task DeleteUser_NonExistingUser_DoesNotThrowException()
        {
            // Arrange
            var nonExistingId = Guid.NewGuid();

            // Act & Assert
            Assert.DoesNotThrowAsync(async () => await _userService.DeleteUser(nonExistingId));
        }
    }