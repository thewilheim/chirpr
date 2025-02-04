using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using api.Models.Chirps;
using api.Models.Likes;
using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    [Index(nameof(email), nameof(username), IsUnique = true)]
    public class User
    {
        [Key]
        public long id { get; set; }
        public string? username { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        [Required]
        public required string email { get; set; }
        [Required]
        public required string password { get; set; }
        public string? profile_picture_url { get; set; }
        public string? bio { get; set; }
        public Privacy_Type privacy { get; set; } = Privacy_Type.Public;

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
        public ICollection<Chirp>? Chirps { get; set; }
        // Navigation property for the many-to-many relationship
        public ICollection<Follower>? Followers { get; set; }  // Users who are following this user
        public ICollection<Follower>? Following { get; set; }  // Users whom this user is following
        public ICollection<Rechirp>? Rechirps { get; set; }
        public ICollection<Like>? Likes { get; set; }
        public DateTime createdAt { get; set; }
    };


    public enum Privacy_Type
    {
        Private,
        Public,
        Friends
    }

    public class AuthTokens
    {
        public required string AccessToken { get; set; }
        public required string RefreshToken { get; set; }
    }
}