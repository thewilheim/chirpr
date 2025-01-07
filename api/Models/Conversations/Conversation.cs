using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Models.Conversations
{
    public class Conversation
    {
        public long id { get; set; }
        public long user_one_id { get; set; }
        public long user_two_id { get; set; }

        public virtual User user_one { get; set; }
        public virtual User user_two { get; set; }
    }
}