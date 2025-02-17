using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs;
using api.Models.Notification;

namespace api.Services
{
    public interface INotificationService
    {
        Task<Notification> AddNewNotification (Notification notification);
        Task<ICollection<NotificationDTO>> GetAllNotifications (long user_id);
        Task MarkViewed (string id);
    }
}