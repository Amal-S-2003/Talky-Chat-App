import { X } from "lucide-react";
import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";
import { GroupContext } from "../context/GroupContext";
import { useNavigate } from "react-router-dom";

function ChatHeader() {
  const { selectedUser, setSelectedUser ,selectedGroup, setSelectedGroup} = useContext(ChatContext);
  const { onlineUsers } = useContext(UserContext);
const navigate=useNavigate()
  const isUserChat = Boolean(selectedUser);
  const isGroupChat = Boolean(selectedGroup);

  useEffect(() => {
    const chat = selectedUser || selectedGroup;
    console.log("Chat Selected:", chat);
    console.log("isUserChat:", isUserChat, "isGroupChat:", isGroupChat);
  }, [selectedUser, selectedGroup]);

  // If no chat is selected, don't render anything
  if (!isUserChat && !isGroupChat) return null;

  const isOnline = isUserChat && onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-4 bg-white text-gray-800 shadow-md rounded-t-lg border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                isUserChat
                  ? selectedUser.profilePic || "/dp.jpeg"
                  : selectedGroup.image || "/group.png"
              }
              alt={isUserChat ? selectedUser.username : selectedGroup.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
            />
            {isUserChat && (
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900" onClick={()=>navigate(`/groups/group/${selectedGroup?._id}`)}>
              {isUserChat ? selectedUser.username : selectedGroup.name}
            </h3>
            <p className="text-sm text-gray-500">
              {isUserChat ? (isOnline ? "🟢 Online" : "⚪ Offline") : "Group Chat"}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            if (isUserChat) setSelectedUser(null);
            if (isGroupChat) setSelectedGroup(null);
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
          title="Close Chat"
        >
          <X size={20} className="text-gray-500 hover:text-gray-700" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
