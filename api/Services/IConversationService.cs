using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Conversations;
using api.DTOs;

namespace api.Services
{
    public interface IConversationService
    {
        Task<ConversationDTO> CreateConversation(Conversation conversation);
        Task<IEnumerable<ConversationDTO>> GetAllConversationsByUser(long user_id);
    }
}