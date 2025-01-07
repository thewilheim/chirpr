using System;

namespace api.DTOs
{
    public class ConversationDTO
    {
        public long id { get; set; }
        public UserDetailsSimpleDTO other_user { get; set; }
    }
}