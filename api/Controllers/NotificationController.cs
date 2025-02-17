using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Notification;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace api.Controllers
{
    [Route("api/v1/[controller]")]
    public class NotificationController : Controller
    {
        private readonly ILogger<NotificationController> _logger;
        private readonly INotificationService _notificationService;

        public NotificationController(
            ILogger<NotificationController> logger,
            INotificationService notificationService
        )
        {
            _logger = logger;
            _notificationService = notificationService;
        }
        
        [HttpGet("all/{user_id}")]
        public async Task<IActionResult> GetAllNotifications(long user_id)
        {
            var messages = await _notificationService.GetAllNotifications(user_id);
            return Ok(messages);
        }

        [HttpGet("view/{id}")]
        public async Task<IActionResult> MarkViewed(string id)
        {
            await _notificationService.MarkViewed(id);
            return Ok();
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Notification notification)
        {
            try
            {
                var savedNotification = await _notificationService.AddNewNotification(notification);
                
                // Ensure the message is sent to all clients in the group
                // await _hubContext.Clients.Group($"conversation-{message.conversation_id}")
                //     .SendAsync("ReceiveMessage", message.message_from.ToString(), message.content);
                
                return Ok(savedNotification);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, "An error occurred while sending the message");
            }
        }
    }
}