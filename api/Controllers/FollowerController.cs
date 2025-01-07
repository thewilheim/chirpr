using api.Data;
using api.Models;
using api.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [Route("/api/v1/[controller]")]
    public class FollowerController : Controller
    {
        private readonly ILogger<FollowerController> _logger;
        private readonly IFollowerService _followerService;
        private readonly IMapper _mapper;

        public FollowerController(IFollowerService followerService, ILogger<FollowerController> logger, IMapper mapper)
        {
            _logger = logger;
            _followerService = followerService;
        }

        [HttpPost("follow")]
        public async Task<IActionResult> FollowUser([FromBody] Follower follower)
        {
             var result = await _followerService.FollowUser(follower);
             if(result == null) return BadRequest();
            return Ok(result);
        }

        [HttpPost("unfollow")]
        public async Task<IActionResult> UnFollowUser([FromBody] Follower follower)
        {
            var result = await _followerService.UnfollowUser(follower);
            if(result == null) return BadRequest();
            return Ok();
        }

        [HttpGet("following/{id}")]
        public async Task<IActionResult> Following (long id)
        {
            var following = await _followerService.GetFollowing(id);

            return Ok(following);
        }

        [HttpGet("followers/{id}")]
        public async Task<IActionResult> Followers (long id)
        {
            var followers = await _followerService.GetFollowers(id);

            return Ok(followers);
        }

        [HttpGet("suggested/{id}")]
        public async Task<IActionResult> GetSuggestedFollowers (long id)
        {
            var suggestedUsers = await _followerService.GetSuggestedFollowers(id);

            if(suggestedUsers == null) return BadRequest();

            return Ok(suggestedUsers);
        }
    }
}