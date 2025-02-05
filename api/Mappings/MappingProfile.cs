using System.Security.Claims;
using api.Data;
using api.DTOs;
using api.Models;
using api.Models.Conversations;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>()
                .ForMember(dest => dest.numberOfFollowers, opt => opt.MapFrom(src => src.Followers.Count))
                .ForMember(dest => dest.numberOfFollowing, opt => opt.MapFrom(src => src.Following.Count));

            CreateMap<Chirp, ChirpDTO>()
                .ForMember(dest => dest.user, opt => opt.MapFrom(src => src.user))
                .ForMember(dest => dest.numberOfLikes, opt => opt.MapFrom(src => src.Likes.Count))
                .ForMember(dest => dest.numberOfRechirps, opt => opt.MapFrom(src => src.Rechirps.Count))
                .ForMember(dest => dest.isFollowingUser, opt => opt.MapFrom<IsFollowingResolver>())
                .ForMember(dest => dest.hasLikedChirp, opt => opt.MapFrom<HasLikedChirpResolver>())
                .ForMember(dest => dest.numberOfReplies, opt => opt.MapFrom<NumberOfRepliesResolver>());
                
            CreateMap<Conversation, ConversationDTO>()
                .ForMember(dest => dest.other_user, opt => opt.MapFrom((src, _, _, context) =>
                    src.user_one_id == (long)context.Items["current_user_id"]
                        ? new UserDetailsSimpleDTO
                        {
                            id = src.user_two.id,
                            username = src.user_two.username,
                            profile_picture_url = src.user_two.profile_picture_url
                        }
                        : new UserDetailsSimpleDTO
                        {
                            id = src.user_one.id,
                            username = src.user_one.username,
                            profile_picture_url = src.user_one.profile_picture_url
                        }
                ));
        }
    }

    public class IsFollowingResolver : IValueResolver<Chirp, ChirpDTO, bool>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _context;

        public IsFollowingResolver(IHttpContextAccessor httpContextAccessor, AppDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public bool Resolve(Chirp source, ChirpDTO destination, bool destMember, ResolutionContext context)
        {
            // Get the logged-in user ID from the HTTP context
            var currentUserEmail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email);

            if (currentUserEmail == null)
            {
                return false;
            }

            // Check if the logged-in user is following the chirp's user
            var user = _context.Users.FirstOrDefault(u => u.email == currentUserEmail.Value);
            if (user == null)
            {
                return false; // Return false if the user is not found
            }

            return _context.Followers.Any(f => f.followerId == user.id && f.followedId == source.user_id);
        }
    }

    public class NumberOfRepliesResolver : IValueResolver<Chirp, ChirpDTO, int>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _context;

        public NumberOfRepliesResolver(IHttpContextAccessor httpContextAccessor, AppDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public int Resolve(Chirp source, ChirpDTO destination, int destMember, ResolutionContext context)
        {
            return _context.Chirps.Where(c => c.parent_id == source.id).Count();
        }
    }
    }


    public class HasLikedChirpResolver : IValueResolver<Chirp, ChirpDTO, bool>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppDbContext _context;

        public HasLikedChirpResolver(IHttpContextAccessor httpContextAccessor, AppDbContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        public bool Resolve(Chirp source, ChirpDTO destination, bool destMember, ResolutionContext context)
        {
            // Get the logged-in user ID from the HTTP context
            var currentUserEmail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email);

            if (currentUserEmail == null)
            {
                return false;
            }

            // Check if the logged-in user is following the chirp's user
            var user = _context.Users.FirstOrDefault(u => u.email == currentUserEmail.Value);
            if (user == null)
            {
                return false; // Return false if the user is not found
            }

            return _context.Likes.Any(l => l.user.id == user.id && l.chirp_id == source.id);
        }
    }

