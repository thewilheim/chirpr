namespace api.Models.Views
{
    public class View
    {
        public long ChirpId { get; set; }
        public long UserId { get; set; }

        public Chirp? Chirp { get; set; }
        public DateTime TimeStamp { get; set; }
    }
}