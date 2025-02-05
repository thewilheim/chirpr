using System.Text.Json.Serialization;
using api.Models;
using api.Models.Chirps;

namespace api.DTOs
{
    public class ChirpDTO
    {
        public long id { get; set; }
        public string content { get; set; }
        public string? media_url { get; set; }
        public long user_id { get; set; }
        public UserDTO user { get; set; }  // Map to UserDTO to exclude sensitive data
        public long parent_id { get; set; }
        public int privacy { get; set; }
        [JsonIgnore]
        public ICollection<Rechirp>? Rechirps { get; set; }
        public int numberOfLikes { get; set; }
        public int numberOfRechirps {get; set;} 
        public int numberOfReplies { get; set; }
        public bool isFollowingUser { get; set; }
        public bool hasLikedChirp { get; set; }
        public DateTime createdAt { get; set; }
    }
}