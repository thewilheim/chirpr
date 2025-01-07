using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Models.Message;
using Microsoft.EntityFrameworkCore;

namespace api.Services
{
    public class MessageService: IMessageService
    {
        private readonly AppDbContext _context;

        public MessageService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Message> AddNewMessage(Message message)
        {
            
           await _context.Messages.AddAsync(message);
           await _context.SaveChangesAsync();

           return message;
        }

        public async Task<IEnumerable<Message>> GetAllMessages(long conversation_id)
        {
            var messages = await _context.Messages.Where(m => m.conversation_id == conversation_id ).ToListAsync();

            return messages;
        }
    }
}