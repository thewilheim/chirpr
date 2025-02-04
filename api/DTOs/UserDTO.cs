namespace api.Models
{
    public class UserDTO
    {
        public long id { get; set; }
        public string? username { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public required string email { get; set; }
        public string? profile_picture_url { get; set; }
        public string? bio { get; set; }
        public int numberOfFollowers { get; set; }
        public int numberOfFollowing { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime createdAt { get; set; }
    }
}