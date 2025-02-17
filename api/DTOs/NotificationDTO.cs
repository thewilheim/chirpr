using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;
using api.Models.Notification;

namespace api.DTOs
{
    public class NotificationDTO
    {
        public Guid Id { get; set; }
        public Notification_Type Action_Type { get; set; }
        public long Sending_User_Id { get; set; }
        public UserDTO? Sending_User { get; set; }
        public int Recieving_User_Id { get; set; }
        public bool Has_Viewed { get; set; } = false;
    }
}