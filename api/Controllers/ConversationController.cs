using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using api.Services;
using api.Hubs;
using Microsoft.AspNetCore.SignalR;
using api.Models.Conversations;
using System.Security.Claims;

namespace api.Controllers
{
    [Route("api/v1/[controller]")]
    public class ConversationController : Controller
    {
        private readonly ILogger<ConversationController> _logger;
        private readonly IConversationService _conversationService;
        private readonly IMessageService _messageService;
        private readonly IHubContext<ChatHub> _hubContext;

        public ConversationController(
            ILogger<ConversationController> logger,
            IConversationService conversationService,
            IMessageService messageService,
            IHubContext<ChatHub> hubContext)
        {
            _logger = logger;
            _conversationService = conversationService;
            _messageService = messageService;
            _hubContext = hubContext;
        }

        [HttpGet("")]
        public async Task<IActionResult> GetUserConversations()
        {
            var user_id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (user_id == null)
            {
                return Unauthorized();
            }
            var conversations = await _conversationService.GetAllConversationsByUser(long.Parse(user_id));
            return Ok(conversations);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateConversation([FromBody] Conversation conversation)
        {
            var newConversation = await _conversationService.CreateConversation(new Conversation { user_one_id = long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value), user_two_id = conversation.user_two_id });
            return Ok(newConversation);
        }
    }
} 