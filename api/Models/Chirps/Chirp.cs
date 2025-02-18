using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using api.Models.Chirps;
using api.Models.Likes;
using api.Models.Views;

namespace api.Models
{
    public class Chirp
    {
        [Key]
        [JsonIgnore]
        public long id { get; set; }
        public required string content { get; set; }
        public string? media_url { get; set; }
        public long user_id { get; set; }
        public User? user {get; set;}
        public long parent_id { get; set; }
        public Privacy_Type privacy { get; set; } = Privacy_Type.Public;
        
        [JsonIgnore]
        public ICollection<Rechirp>? Rechirps { get; set; }
        [JsonIgnore]
        public ICollection<Like>? Likes {get; set;}
        public ICollection<View>? Views {get; set;}
        [JsonIgnore]
        public DateTime createdAt { get; set; }
    }
}