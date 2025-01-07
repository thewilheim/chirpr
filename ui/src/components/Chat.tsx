import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { signalRService } from '../utils/signalRService.ts';
import { IConversation, IMessage, IUser } from '../config/applicatonConfig';
import { useGetConversationMessagesQuery, useGetUserConversationsQuery, useSendMessageMutation } from '../slices/messageSlice';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

export const Chat = () => {
  const { conversationId } = useParams();
  console.log(conversationId)
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { userInfo } = useSelector((state: { auth: { userInfo: IUser } }) => state.auth);  
  const { data: existingMessages, refetch } = useGetConversationMessagesQuery(conversationId);
  const [sendMessage] = useSendMessageMutation();
  const { data: conversations, isLoading} = useGetUserConversationsQuery('');
  console.log(conversations)
  const conversation = conversations?.find((c: IConversation) => c.id.toString() === conversationId);


  const handleNewMessage = useCallback((message: IMessage) => {
    setMessages(prev => {
      // Check if message already exists
      const exists = prev.some(m => 
        m.message_from === message.message_from && 
        m.content === message.content &&
        Math.abs(new Date(m.created_at).getTime() - new Date(message.created_at).getTime()) < 1000
      );
      
      if (!exists) {
        // Refetch messages from the server to ensure consistency
        refetch();
        return [...prev, message];
      }
      return prev;
    });
  }, [refetch]);

  useEffect(() => {
    if (existingMessages) {
      setMessages(existingMessages);
    }
  }, [existingMessages]);

  //@ts-expect-error should be fine
  useEffect(() => {
    let mounted = true;

    const initializeChat = async () => {
      try {
        await signalRService.startConnection();
        if (mounted) {
          await signalRService.joinConversation(conversationId || '');
          signalRService.onReceiveMessage(handleNewMessage);
          signalRService.onUserTyping(() => {
            if (mounted) {
              setIsTyping(true);
              setTimeout(() => mounted && setIsTyping(false), 3000);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        // Retry connection after a delay
        setTimeout(initializeChat, 3000);
      }
    };

    initializeChat();

    return async () => {
      mounted = false;
      await signalRService.leaveConversation(conversationId || '');
    };
  }, [conversationId, handleNewMessage]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const message = {
        content: messageText,
        message_from: userInfo.id,
        message_to: 0, // Set appropriate recipient ID
        conversation_id: parseInt(conversationId || ''),
        created_at: new Date().toISOString()
      };

      await sendMessage(message);
      await signalRService.sendMessage(conversationId || '', messageText);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally show error to user
    }
  };

  const handleTyping = async () => {
    await signalRService.userTyping(conversationId || '', userInfo.username);
  };

  return (
    !isLoading && (
      <div className="flex flex-col h-full p-6">
      <div className='flex flex-row items-center justify-between gap-4 p-6 bg-chirpr-900 rounded-lg mb-4'>
        <div className='flex flex-row items-center gap-4'>
          <FaUserCircle size={40} />
          <h1 className='text-2xl font-bold'>{conversation.other_user.username}</h1>
        </div>
        <Link to='/' className='text-chirpr-500 hover:text-chirpr-600 font-bold'>
          Leave conversation
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.message_from === userInfo.id ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.message_from === userInfo.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-gray-500 text-sm">Someone is typing...</div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleTyping}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    )
  );
};