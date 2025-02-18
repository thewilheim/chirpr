using System.Security.Claims;
using api.Data;
using api.DTOs;
using api.Models;
using api.Services;
using api.Swaggerhub;
using AutoMapper;
using Azure.Core;
using IdentityApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
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

        private string GetUserEmailFromClaim()
        {
            return User.Claims.FirstOrDefault(claim => claim.Type.Contains(ClaimTypes.Email)).Value;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var newUser = await _userService.RegisterAsync(user);

            if (newUser != null)
            {
                var token = _tokenGenerator.GenerateToken(user.email, user.id.ToString());
                return Ok(new { user = _mapper.Map<UserDTO>(newUser), accessToken = token });
            }

            return BadRequest();
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            var authenticatedUser = await _userService.AuthenticateAsync(user.email, user.password);

            if (authenticatedUser == null) return Unauthorized("Invalid credtials");

            var token = _tokenGenerator.GenerateToken(authenticatedUser.email, authenticatedUser.id.ToString());

            var mappedUser = _mapper.Map<UserDTO>(authenticatedUser);

            return Ok(new { user = mappedUser, accessToken = token });

        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userEmail = GetUserEmailFromClaim();
            var result = await _userService.Logout(userEmail);

            if (result == null)
            {
                return Unauthorized();
            }

            return Ok("logged out");
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
            return Ok(_mapper.Map<UserDTO>(user));
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var loggedInUserEmail = GetUserEmailFromClaim();
            if (loggedInUserEmail != null)
            {
                var user = await _userService.Profile(loggedInUserEmail);
                return Ok(_mapper.Map<UserDTO>(user));
            }

            return NotFound();
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
            if (result == null) return NotFound("User not found");
            return Ok(_mapper.Map<UserDTO>(result));
        }

        [HttpGet("refresh/{email}")]
        public async Task<IActionResult> Refresh(string email)
        {
            var result = await _userService.Refresh(email);

            return Ok(result);

        }

    }
}