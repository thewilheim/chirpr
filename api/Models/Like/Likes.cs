using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.Likes
{
    public class Like
    {
        // TODO: remove id and have PK be user_id and chirp_id to prevent same user being able to like the same chirp multiple times
        public long chirp_id { get; set; }
        public Chirp chirp {get; set;}
        public long user_id { get; set; }
        public User user {get; set;}
        public DateTime createdAt { get; set; }
    }
}