namespace api.Models.Chirps
{
    public class Rechirp
    {
        public long chirp_id { get; set; }
        public Chirp? chirp { get; set; }
        public long user_id { get; set; }
        public User? user { get; set; }
        public DateTime createdAt { get; set; }
    }
}