using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessLogic.Entities;
using BusinessLogic.Models;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase {
        private readonly IConfiguration _configuration;
        private UserService _userService;
        public AuthController(IConfiguration configuration, UserService userService)
        {
            _configuration = configuration;
            _userService = userService;

        }
        
        [HttpPost("token")]
        public async Task<IActionResult> GenerateToken([FromBody] AuthModel login) { 
            if (await IsValidUser(login)) {
                var token = GenerateJwtToken(await _userService.GetUserByUsernameAndPassword(login));
                return Ok(new { Token = token });
            }
            return Unauthorized();
        }
        
        private async Task<bool> IsValidUser(AuthModel login)
        {
            return await _userService.GetUserByUsernameAndPassword(login) != null;
        }

        
        private string GenerateJwtToken(User user) { 
            var claims = new[] { 
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.UserType),
                new Claim("UserId", user.Id.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"] ?? string.Empty));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddMinutes(Convert.ToDouble(_configuration["JwtSettings:TokenExpirationTimeInMinutes"]));
            var token = new JwtSecurityToken( _configuration["JwtSettings:Issuer"], _configuration["JwtSettings:Audience"],
                claims, expires: expires, signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}