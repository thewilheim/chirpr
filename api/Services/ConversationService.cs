using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models.Conversations;
using api.DTOs;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace api.Services
{
    public class ConversationService : IConversationService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ConversationService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ConversationDTO> CreateConversation(Conversation conversation)
        {
            var foundConversation = await _context.Conversations
                .Include(c => c.user_one)
                .Include(c => c.user_two)
                .FirstOrDefaultAsync(c => 
                    (c.user_one_id == conversation.user_one_id && c.user_two_id == conversation.user_two_id) ||
                    (c.user_one_id == conversation.user_two_id && c.user_two_id == conversation.user_one_id));

            if (foundConversation == null)
            {
                // Load user details before creating conversation
                var user_two = await _context.Users.FirstAsync(u => u.id == conversation.user_two_id);
                var user_one = await _context.Users.FirstAsync(u => u.id == conversation.user_one_id);
                
                conversation.user_one = user_one;
                conversation.user_two = user_two;
                
                await _context.AddAsync(conversation);
                await _context.SaveChangesAsync();
            }

            var result = _mapper.Map<ConversationDTO>(
                foundConversation ?? conversation, 
                opts => opts.Items["current_user_id"] = conversation.user_one_id
            );
            return result;
        }

        public async Task<IEnumerable<ConversationDTO>> GetAllConversationsByUser(long user_id)
        {
            var conversations = await _context.Conversations
                .Where(c => c.user_two_id == user_id || c.user_one_id == user_id)
                .Include(c => c.user_one)
                .Include(c => c.user_two)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ConversationDTO>>(
                conversations,
                opts => opts.Items["current_user_id"] = user_id
            );
        }
    }
}