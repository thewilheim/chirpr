using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using api.Data;
using api.DTOs;
using api.Models;
using IdentityApi;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly TokenGenerator _tokenGenerator;

        public UserService(AppDbContext context, TokenGenerator tokenGenerator)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
        }

        // Register a new user
        public async Task<User> RegisterAsync(User user)
        {
            if (string.IsNullOrEmpty(user.email) || string.IsNullOrEmpty(user.password) || string.IsNullOrEmpty(user.username))
                throw new ArgumentException("User details are incomplete.");

            // Hash the password
            user.password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.password, 11);
            user.RefreshToken = _tokenGenerator.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            // Save user to the database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        // Authenticate user
        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .FirstOrDefaultAsync(u => u.email == email);

            if (user == null || !BCrypt.Net.BCrypt.EnhancedVerify(password, user.password))
                throw new Exception("Authentication failed"); // Authentication failed


            user.RefreshToken = _tokenGenerator.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); // Refresh token valid for 7 days
            await _context.SaveChangesAsync();

            return user; // Return user on successful authentication
        }

        // Get a user by ID
        public async Task<User> GetByIdAsync(long id)
        {
            var user = await _context.Users
                .Include(u => u.Followers)
                .Include(u => u.Following)
                .FirstOrDefaultAsync(u => u.id == id);

            if (user != null)
            {
                user.Followers = user.Followers.Where(f => f.followedId == user.id).ToList();
                user.Following = user.Following.Where(f => f.followerId == user.id).ToList();
            }

            if (user == null) throw new Exception("Unable to find user profile");

            return user;
        }

        // Get all users
        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<int> DeleteUser(long id)
        {
            var userToRemove = await _context.Users.FirstOrDefaultAsync(u => u.id == id);

            if (userToRemove == null) throw new Exception("Unable to delete user profile");

            _context.Users.Remove(userToRemove);

            var result = await _context.SaveChangesAsync();

            return result;
        }

        public async Task<User> UpdateUser(UserUpdateDTO updatedUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.id == updatedUser.id);

            if (user == null) throw new Exception("Unable to update user profile");

            user.bio = updatedUser.bio;
            user.username = updatedUser.username;
            user.profile_picture_url = updatedUser.profile_picture_url;
            user.profile_banner_url = updatedUser.profile_banner_url;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<object> Refresh(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.email == email);
            if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
            {
                throw new Exception("Refresh token has expired");
            }

            var newAccessToken = _tokenGenerator.GenerateToken(user.email, user.id.ToString());
            var newRefreshToken = _tokenGenerator.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await _context.SaveChangesAsync();

            return new { user, accessToken = newAccessToken };
        }

        public async Task<int> Logout(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.email == email);
            if (user == null)
            {
                throw new Exception("Unable to logout user");
            }

            user.RefreshToken = null;
            await _context.SaveChangesAsync();

            return 1;
        }

        public async Task<User> Profile(string email)
        {
            var user = await _context.Users.Include(u => u.Followers).Include(u => u.Following).Include(u => u.Chirps).FirstOrDefaultAsync(u => u.email == email);
            if (user == null)
            {
                throw new Exception("Unable to find user profile");
            }

            return user;

        }

        public async Task<List<User>> Search(string query)
        {
            if(string.IsNullOrEmpty(query)) throw new Exception("query is empty");

            Console.WriteLine(query);

            var result = await _context.Users.Where(u => EF.Functions.Like(u.username.ToLower(), $"{query.ToLower()}%")).Take(5).ToListAsync();

            if(result == null) throw new Exception("unable to find any users");

            return result;
        }
    }
}