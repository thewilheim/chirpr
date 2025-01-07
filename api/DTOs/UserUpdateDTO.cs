using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs
{
    public class UserUpdateDTO
    {
        public long id { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? profile_picture_url { get; set; }
        public string? bio { get; set; }
    }
}