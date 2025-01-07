using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class UserDetailsSimpleDTO
    {
        public long id { get; set; }
        public string username { get; set; }
        public string profile_picture_url { get; set; }
    }
}