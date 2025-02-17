using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs;
using api.Models.Notification;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class NotificationService : INotificationService
    {

        private readonly AppDbContext _appDbContext;
        private readonly IMapper _mapper;


        public NotificationService(AppDbContext appDbContext, IMapper mapper)
        {
            _appDbContext = appDbContext;
            _mapper = mapper;
        }
        public async Task<Notification> AddNewNotification(Notification notification)
        {
            if (notification == null)
            {
                throw new Exception($"Unable to read notification details {notification}");
            }

            await _appDbContext.Notifications.AddAsync(notification);
            await _appDbContext.SaveChangesAsync();
            return notification;
        }

        public async Task<ICollection<NotificationDTO>> GetAllNotifications(long user_id)
        {
            var notifications = await _appDbContext.Notifications.Include(u => u.Sending_User).Where(u => u.Recieving_User_Id == user_id).Where(n => n.Has_Viewed == false).ToListAsync();

            if (notifications == null)
            {
                throw new Exception("Unable to find notifications");
            }

            return _mapper.Map<ICollection<NotificationDTO>>(notifications);
        }

        public async Task MarkViewed(string id)
        {
            var noti = await _appDbContext.Notifications.FirstOrDefaultAsync(n => n.Id == Guid.Parse(id));
            
            if(noti == null) throw new Exception("Unable to find notitication");

            noti.Has_Viewed = true;
            await _appDbContext.SaveChangesAsync();
        }
    }
}