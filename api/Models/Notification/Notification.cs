using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models.Notification
{
    public class Notification
    {
        public Guid Id { get; set; }
        public Notification_Type Action_Type { get; set; }
        public long Sending_User_Id { get; set; }
        public User? Sending_User { get; set; }
        public int Recieving_User_Id { get; set; }
        public bool Has_Viewed { get; set; } = false;
    }

    public enum Notification_Type 
    {
        Like,
        Follow,
        Comment
    }
}