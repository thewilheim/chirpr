import { useGetUserConversationsQuery } from "../../slices/messageSlice";
import { IConversation } from "../../config/applicatonConfig";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { GiNestEggs } from "react-icons/gi";

function ConversationsPage() {
  const { data: conversations, isLoading } = useGetUserConversationsQuery("");
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-4 border-b border-white/20">
        <h1 className="text-2xl">Messages</h1>
      </div>
      {!isLoading &&
        conversations?.map((conversation: IConversation) => (
          <div
            className="bg-chirpr-700 p-5 border-b border-white/20 cursor-pointer flex flex-row items-center gap-4 hover:bg-chirpr-600"
            key={conversation.id}
            onClick={() => navigate(`/messages/${conversation.id}`)}
          >
            <FaUserCircle size={40} />
            <p>{conversation.other_user.username}</p>
          </div>
        ))}
      {!isLoading && conversations.length === 0 && (
        <div className="flex flex-col justify-center items-center">
          <GiNestEggs size={84} className="mb-6" />
          <p className="text-2xl">No eggs in this nest at the moment!</p>
        </div>
      )}
    </div>
  );
}

export default ConversationsPage;

