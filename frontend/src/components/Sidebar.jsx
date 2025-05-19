import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import {  MessageSquare } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useContext(ChatContext);
  const { onlineUsers } = useContext(UserContext);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full  w-20 lg:w-72 border-r border-zinc-800 bg-zinc-900 text-white flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-5">
        <div className="flex items-center gap-2 ">
          <MessageSquare className="w-10 h-10  text-indigo-600" />
          <h1 className="text-3xl font-bold text-center text-indigo-600 ">
            Talky
          </h1>
        </div>

        {/* Online Filter Toggle */}
        <div className="mt-4 hidden lg:flex items-center gap-2 text-zinc-400 text-sm">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm bg-zinc-800 border-zinc-600"
            />
            <span>Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* User List */}
      <div className="overflow-y-auto py-3 scrollbar-hidden">
        {filteredUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full px-4 py-3 flex items-center gap-3
                transition-all rounded-md
                ${isSelected ? "bg-zinc-800 ring-1 ring-zinc-700" : "hover:bg-zinc-800"}
              `}
            >
              {/* Profile Picture */}
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "./dp.jpeg"}
                  alt={user.username}
                  className="size-11 object-cover rounded-full border border-zinc-700"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* Username and status (only on lg) */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-white">{user.username}</div>
                <div className="text-xs text-zinc-400">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-6">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
