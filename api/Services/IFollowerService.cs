using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models;

namespace api.Services
{
    public interface IFollowerService
    {
        Task<Follower> FollowUser(Follower follower);
        Task<Follower> UnfollowUser(Follower follower);
        Task<List<UserDTO?>> GetFollowing(long id);
        Task<List<UserDTO?>> GetFollowers(long id);
        Task<List<UserDetailsSimpleDTO>> GetSuggestedFollowers(long id);
    }
}