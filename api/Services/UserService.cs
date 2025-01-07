using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

            // Register a new user
        public async Task<User> RegisterAsync(User user)
        {
            if (string.IsNullOrEmpty(user.email) || string.IsNullOrEmpty(user.password) || string.IsNullOrEmpty(user.username))
                throw new ArgumentException("User details are incomplete.");

            // Hash the password
            user.password = BCrypt.Net.BCrypt.EnhancedHashPassword(user.password, 11);

            // Save user to the database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            
            return user;
        }

            // Authenticate user
        public async Task<User> AuthenticateAsync(string email, string password)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.email == email);
            
            if (user == null || !BCrypt.Net.BCrypt.EnhancedVerify(password, user.password))
                return null; // Authentication failed
            
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

            _context.Users.Remove(userToRemove);

            var result = await _context.SaveChangesAsync();

            return result;
        }

        public async Task<User?> UpdateUser(UserUpdateDTO updatedUser)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.id == updatedUser.id);

            if(user == null) return null;

            user.bio = updatedUser.bio;
            user.first_name = updatedUser.first_name;
            user.last_name = updatedUser.last_name;
            user.profile_picture_url = updatedUser.profile_picture_url;

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return user;
        }
    }
}