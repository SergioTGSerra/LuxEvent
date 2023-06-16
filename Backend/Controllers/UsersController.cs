using BusinessLogic.Entities;
using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
 public class UsersController : ControllerBase
 {
     private readonly UserService _userService;
 
     public UsersController(UserService userService)
     {
         _userService = userService;
     }
 
     [HttpGet("{id}")]
     public async Task<IActionResult> GetUserById(Guid id)
     {
         var user = await _userService.GetUserById(id);
         if (user == null)
         {
             return NotFound();
         }
 
         return Ok(user);
     }
 
     [HttpGet]
     public async Task<IActionResult> GetAllUsers()
     {
         var users = await _userService.GetAllUsers();
         return Ok(users);
     }
 
     [HttpPost]
     public async Task<IActionResult> CreateUser(User user)
     {
         await _userService.CreateUser(user);
         return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
     }
 
     [HttpPut("{id}")]
     public async Task<ActionResult<User>> UpdateUser(Guid id, UserModel userModel)
     {
         if (id != userModel.Id)
         {
             return BadRequest();
         }
         
         var existingUser = await _userService.GetUserById(id);
         if (existingUser == null)
         {
             return NotFound();
         }
 
         var updatedUser = await _userService.UpdateUser(userModel);
         return Ok(updatedUser);
     }
 
     [HttpDelete("{id}")]
     public async Task<IActionResult> DeleteUser(Guid id)
     {
         await _userService.DeleteUser(id);
         return NoContent();
     }
 }
}