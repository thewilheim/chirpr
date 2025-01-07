using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class FollowerService : IFollowerService
    {
        private readonly AppDbContext _context;

        public FollowerService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Follower> FollowUser(Follower follower)
        {
            if(follower == null) return null;

            await _context.Followers.AddAsync(follower);
            await _context.SaveChangesAsync();

            return follower;
        }

        public async Task<Follower> UnfollowUser(Follower follower)
        {
            if(follower == null) return null;

            if (follower.followerId == 0 || follower.followedId == 0)
            {
                return null;
            }

            var record = await _context.Followers.FirstOrDefaultAsync(x => x.followerId == follower.followerId && x.followedId == follower.followedId);
            
            if(record == null){
                return null;
            }
            
            _context.Followers.Remove(record);
            await _context.SaveChangesAsync();
            
            return record;
        }

        public async Task<List<UserDTO>> GetFollowers(long id)
        {
        return await _context.Followers
                            .Where(x => x.followedId == id)
                            .Include(f => f.followerUser)
                            .Select(f => new UserDTO 
                            {
                                id = f.followerUser.id,
                                username = f.followerUser.username,
                                first_name = f.followerUser.first_name,
                                last_name = f.followerUser.last_name,
                                email = f.followerUser.email,
                                profile_picture_url = f.followerUser.profile_picture_url
                            })
                            .ToListAsync();
        }

        public async Task<List<UserDTO>> GetFollowing(long id)
        {
            return await _context.Followers
                                .Where(x => x.followerId == id)
                                .Include(f => f.followedUser)  // Ensure followedUser is included
                                .Select(f => new UserDTO
                                {
                                    id = f.followedUser.id,
                                    email = f.followedUser.email,
                                    username = f.followedUser.username,
                                    first_name = f.followedUser.first_name,
                                    last_name = f.followedUser.last_name,
                                    profile_picture_url = f.followedUser.profile_picture_url
                                })
                                .ToListAsync();
        }

        public async Task<List<UserDetailsSimpleDTO>> GetSuggestedFollowers(long id)
        {
            var followedUserIds = await _context.Followers
                .Where(f => f.followerId == id)
                .Select(f => f.followedId)
                .ToListAsync();
            var randomUsers = await _context.Users
                .Where(u => !followedUserIds.Contains(u.id) && u.id != id)
                .OrderBy(u => Guid.NewGuid()) // Randomize results
                .Take(3) // Limit to 10 suggestions
                .Select(f => new UserDetailsSimpleDTO
                    {
                        id = f.id,
                        username = f.username,
                        profile_picture_url = f.profile_picture_url,
                    })
                .ToListAsync();

            return randomUsers;
        }
    }
}