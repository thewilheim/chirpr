using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Message;
using api.Services;
using Microsoft.AspNetCore.SignalR;

namespace api.Hubs
{
    public class ChatHub : Hub
    {

        public async Task AddToGroup(string id)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversation-{id}");
        }

        public async Task LeaveGroup(string id)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"conversation-{id}");
        }

        public async Task SendMessage(string conversation_id, string message)
        {
            var sender_id = Context.UserIdentifier;
            await Clients.Group($"conversation-{conversation_id}").SendAsync("ReceiveMessage", sender_id, message);
        }

        public async Task UserTyping(string conversationId, string username)
        {
            await Clients.Group($"conversation-{conversationId}")
                .SendAsync("UserTyping", username);
        }
    }
}