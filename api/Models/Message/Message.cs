using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models.Conversations;
using Microsoft.VisualBasic;

namespace api.Models.Message
{
    public class Message
    {
    public long id { get; set; }
    public long message_from { get; set; }
    public long message_to { get; set; }
    public required string content { get; set; }
    public DateTime created_at { get; set; }
    public required long conversation_id { get; set; }
    public Conversation? conversation {get; set; }
    }
}