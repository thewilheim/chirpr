using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.SignalR;
using api.Models.Message;
using api.Hubs;

namespace api.Controllers
{
    [Route("api/v1/[controller]")]
    public class MessageController : Controller
    {
        private readonly ILogger<MessageController> _logger;
        private readonly IMessageService _messageService;
        private readonly IConversationService _conversationService;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(
            ILogger<MessageController> logger,
            IMessageService messageService,
            IConversationService conversationService,
            IHubContext<ChatHub> hubContext)
        {
            _logger = logger;
            _messageService = messageService;
            _conversationService = conversationService;
            _hubContext = hubContext;
        }

        [HttpGet("conversation/{conversationId}")]
        public async Task<IActionResult> GetMessagesByConversation(long conversationId)
        {
            var messages = await _messageService.GetAllMessages(conversationId);
            return Ok(messages);
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            try
            {
                var savedMessage = await _messageService.AddNewMessage(message);
                
                // Ensure the message is sent to all clients in the group
                await _hubContext.Clients.Group($"conversation-{message.conversation_id}")
                    .SendAsync("ReceiveMessage", message.message_from.ToString(), message.content);
                
                return Ok(savedMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, "An error occurred while sending the message");
            }
        }
    }
}