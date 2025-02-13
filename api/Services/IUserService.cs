using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public interface IUserService
    {
        Task<User> RegisterAsync(User user);
        Task<User> AuthenticateAsync(string email, string password);
        Task<User> GetByIdAsync(long id);
        Task<IEnumerable<User>> GetAllUsersAsync();

        Task<int> DeleteUser(long id);
        Task<User?> UpdateUser(UserUpdateDTO updatedUser);
        Task<object?> Refresh(string email);
        Task<int?> Logout(string email); 
        Task<User?> Profile(string email);
    }
}