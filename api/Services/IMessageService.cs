using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Message;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public interface IMessageService
    {
        Task<Message> AddNewMessage(Message message);
        Task<IEnumerable<Message>> GetAllMessages(long conversation_id);
    }
}