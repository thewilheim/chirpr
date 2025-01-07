

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace api.Models
{
    public class Follower
    {
        public long followerId { get; set; }  // ID of the follower (User)
        [JsonIgnore]
        public User? followerUser { get; set; }  // The follower (User)
        public long followedId { get; set; }  // ID of the followed user (User)
        [JsonIgnore]
        public User? followedUser { get; set; }  // The followed user (User)

        [JsonIgnore]
        public DateTime createdAt { get; set; }
    }
}