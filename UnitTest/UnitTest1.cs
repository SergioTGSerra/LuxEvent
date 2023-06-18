using BusinessLogic.Context;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.EntityFrameworkCore;

namespace UnitTest;

public class Tests
{
    private DbContextOptions<ES2DbContext> _dbContextOptions;
        /*Esse método é executado antes de cada teste e é usado para configurar o ambiente de teste. Nele, estão sendo criadas opções de contexto de banco de dados em memória e, em seguida, está sendo usado um contexto de banco de dados para adicionar alguns usuários de teste ao banco de dados em memória.*/
        [SetUp]
        public void Setup()
        {
            _dbContextOptions = new DbContextOptionsBuilder<ES2DbContext>()
                .UseInMemoryDatabase(databaseName: "test_database")
                .Options;

            using (var dbContext = new ES2DbContext(_dbContextOptions))
            {
                // Adicione alguns usuários de teste ao contexto do banco de dados em memória
                dbContext.Users.Add(new User { Id = Guid.NewGuid(), Name = "User 1", Username = "user1", Email = "user1@example.com", Password = "password1" });
                dbContext.Users.Add(new User { Id = Guid.NewGuid(), Name = "User 2", Username = "user2", Email = "user2@example.com", Password = "password2" });
                dbContext.Users.Add(new User { Id = Guid.NewGuid(), Name = "User 3", Username = "user3", Email = "user3@example.com", Password = "password3" });
                dbContext.SaveChanges();
            }
        }
        
        /*TearDown: Esse método é executado após cada teste e é usado para limpar o ambiente de teste. Nele, está sendo usado um contexto de banco de dados para excluir o banco de dados em memória.*/
        [TearDown]
        public void TearDown()
        {
            // Limpe o banco de dados em memória após cada teste
            using (var dbContext = new ES2DbContext(_dbContextOptions))
            {
                dbContext.Database.EnsureDeleted();
            }
        }

        /*GetUserById_ExistingId_ReturnsUser: Este é um teste para o método GetUserById da classe UserService. Ele verifica se o método retorna um usuário válido quando é fornecido um ID existente.*/
        [Test]
        public async Task GetUserById_ExistingId_ReturnsUser()
        {
            // Arrange
            using (var dbContext = new ES2DbContext(_dbContextOptions))
            {
                var userService = new UserService(dbContext);
                var existingUserId = dbContext.Users.First().Id;

                // Act
                var user = await userService.GetUserById(existingUserId);

                // Assert
                Assert.NotNull(user);
                Assert.AreEqual(existingUserId, user.Id);
            }
        }

        /*GetUserById_NonExistingId_ReturnsNull: Este é um teste para o método GetUserById da classe UserService. Ele verifica se o método retorna nulo quando é fornecido um ID que não existe.*/
        [Test]
        public async Task GetUserById_NonExistingId_ReturnsNull()
        {
            // Arrange
            using (var dbContext = new ES2DbContext(_dbContextOptions))
            {
                var userService = new UserService(dbContext);
                var nonExistingUserId = Guid.NewGuid();

                // Act
                var user = await userService.GetUserById(nonExistingUserId);

                // Assert
                Assert.Null(user);
            }
        }

        /*GetUserById_NonExistingId_ReturnsNull: Este é um teste para o método GetUserById da classe UserService. Ele verifica se o método retorna nulo quando é fornecido um ID que não existe.*/
        [Test]
        public async Task GetUserByUsernameAndPassword_ExistingCredentials_ReturnsUser()
        {
            // Arrange
            using (var dbContext = new ES2DbContext(_dbContextOptions))
            {
                var userService = new UserService(dbContext);
                var existingUsername = dbContext.Users.First().Username;
                var existingPassword = "password1"; // Assuming the first user's password is "password1"

                // Act
                var authModel = new AuthModel { Username = existingUsername, Password = existingPassword };
                var user = await userService.GetUserByUsernameAndPassword(authModel);

                // Assert
                Assert.NotNull(user);
                Assert.AreEqual(existingUsername, user.Username);
            }
        }
}