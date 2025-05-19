import { X } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useContext(ChatContext);
  const { onlineUsers } = useContext(UserContext);

  if (!selectedUser) return null;

  const isOnline = onlineUsers?.includes(selectedUser._id);

  return (
    <div className="p-4 bg-neutral-900 text-white shadow-md rounded-t-lg border-b border-neutral-700">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedUser.profilePic || "/dp.jpeg"}
              alt={selectedUser.username}
              className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-sm"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-neutral-900 ${
                isOnline ? "bg-green-400" : "bg-gray-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-medium text-white">{selectedUser.username}</h3>
            <p className="text-sm text-gray-400">
              {isOnline ? "🟢 Online" : "⚪ Offline"}
            </p>
          </div>
        </div>

        {/* Close Chat Button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-neutral-800 transition duration-200"
          title="Close Chat"
        >
          <X size={20} className="text-gray-300 hover:text-white" />
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
