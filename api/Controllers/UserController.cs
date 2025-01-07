using System.Security.Claims;
using api.Data;
using api.DTOs;
using api.Models;
using api.Services;
using api.Swaggerhub;
using AutoMapper;
using IdentityApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Filters;

namespace api.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]

    public class UserController : ControllerBase
    {

        private readonly ILogger<UserController> _logger;
        private readonly TokenGenerator _tokenGenerator;
        private readonly IMapper _mapper;
        private readonly IUserService _userService;

        private readonly IConfiguration _configuration;
        public UserController(IUserService userService, ILogger<UserController> logger, IMapper mapper, TokenGenerator tokenGenerator, IConfiguration configuration)
        {
            _userService = userService;
            _logger = logger;
            _mapper = mapper;
            _tokenGenerator = tokenGenerator;
            _configuration = configuration;
        }


        [HttpPost("register")]
        [SwaggerRequestExample(typeof(User), typeof(UserRegisterExample))]
        [ProducesResponseType(typeof(UserDTO), 201)]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            try
            {
                var newUser = await _userService.RegisterAsync(user);
                var token = _tokenGenerator.GenerateToken(user.email, user.id.ToString());

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = false,       // Prevent JavaScript from accessing the cookie
                    Secure = true,        // Set to true in production with HTTPS
                    Expires = DateTime.UtcNow.AddHours(1),
                    Path = "/",  // Make sure the cookie is set for the whole domain
                    SameSite = SameSiteMode.None,
                    Domain = _configuration["AppSettings:Domain"]

                };

                Response.Cookies.Append("AuthToken", token, cookieOptions);
                return CreatedAtAction(nameof(GetById), new { id = user.id }, _mapper.Map<UserDTO>(newUser));
            }
            catch (System.Exception error)
            {

                _logger.LogInformation(error.Message);
                return BadRequest(error.Message);
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var authenticatedUser = await _userService.AuthenticateAsync(user.email, user.password);

            if (authenticatedUser == null) return Unauthorized("Invalid credtials");

            var token = _tokenGenerator.GenerateToken(authenticatedUser.email, authenticatedUser.id.ToString());

            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,       // Prevent JavaScript from accessing the cookie
                Secure = true,        // Set to true in production with HTTPS
                Expires = DateTime.UtcNow.AddHours(1),
                Path = "/",  // Make sure the cookie is set for the whole domain
                 SameSite = SameSiteMode.None,
                Domain = _configuration["AppSettings:Domain"]
            };

            Response.Cookies.Append("AuthToken", token, cookieOptions);

            return Ok(_mapper.Map<UserDTO>(authenticatedUser));

        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = false,       
                Secure = true,        
                Expires = DateTime.UtcNow.AddDays(-1), // Set to past date to expire cookie
                Path = "/",  
                SameSite = SameSiteMode.None,
                Domain = _configuration["AppSettings:Domain"]
            };

            // Use Delete instead of Append with empty string
            Response.Cookies.Delete("AuthToken", cookieOptions);

            return Ok();
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();

            return Ok(_mapper.Map<UserDTO[]>(users));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var user = await _userService.GetByIdAsync(id);
            return Ok(_mapper.Map<UserWithFollowDataDTO>(user));
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            try
            {
                await _userService.DeleteUser(id);
                return Ok();
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UserUpdateDTO updatedUser)
        {
            var result = await _userService.UpdateUser(updatedUser);
            if(result == null) return NotFound("User not found");
            return Ok(_mapper.Map<UserDTO>(result));
        }

    }
}