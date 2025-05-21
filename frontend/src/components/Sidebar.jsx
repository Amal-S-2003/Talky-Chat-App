import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { UserContext } from "../context/UserContext";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users2, UsersRound } from "lucide-react";
import { GroupContext } from "../context/GroupContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    groups,
    getGroups,
    selectedGroup,
    setSelectedGroup,
  } = useContext(ChatContext);

  const { onlineUsers } = useContext(UserContext);
  const {disconnectSocket, connectSocket } = useContext(GroupContext);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "groups"

  useEffect(() => {
    getUsers();
    getGroups();
  }, []);
  useEffect(() => {
    disconnectSocket()
         connectSocket(selectedGroup)
console.log("connectSocket(selectedGroup)")
  }, [selectedGroup]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-zinc-800 bg-zinc-900 text-white flex flex-col transition-all duration-200">
      {/* Header with Toggle Tabs */}
      <div className="border-b border-zinc-800 px-4 py-4">
        <div className="flex justify-around text-sm font-medium">
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
              activeTab === "users"
                ? "bg-zinc-800 text-indigo-400"
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("users");
              setSelectedGroup(null);
            }}
          >
            <Users2 className="w-4 h-4" />
            <span className="hidden lg:inline">Users</span>
          </button>
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded-md transition-all ${
              activeTab === "groups"
                ? "bg-zinc-800 text-indigo-400"
                : "text-zinc-400 hover:text-white"
            }`}
            onClick={() => {
              setActiveTab("groups");
              setSelectedUser(null);
            }}
          >
            <UsersRound className="w-4 h-4" />
            <span className="hidden lg:inline">Groups</span>
          </button>
        </div>

        {/* Online Filter */}
        {activeTab === "users" && (
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
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto py-3 scrollbar-hidden flex-1">
        {activeTab === "users" ? (
          <>
            {filteredUsers.map((user) => {
              const isSelected = selectedUser?._id === user._id;
              const isOnline = onlineUsers.includes(user._id);

              return (
                <button
                  key={user._id}
                  onClick={() => {
                    setSelectedUser(user)&&
                    setSelectedGroup(null);
                  }}
                  className={`w-full px-4 py-3 flex items-center cursor-pointer gap-3 transition-all rounded-md ${
                    isSelected
                      ? "bg-zinc-800 ring-1 ring-zinc-700"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={user.profilePic || "./dp.jpeg"}
                      alt={user.username}
                      className="size-11 object-cover rounded-full border border-zinc-700"
                    />
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                    )}
                  </div>

                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate text-white">
                      {user.username}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {isOnline ? "Online" : "Offline"}
                    </div>
                  </div>
                </button>
              );
            })}
            {filteredUsers.length === 0 && (
              <div className="text-center text-zinc-500 py-6">
                No online users
              </div>
            )}
          </>
        ) : (
          <>
            {groups.map((group) => {
              const isSelected = selectedGroup?._id === group._id;

              return (
                <button
                  key={group._id}
                  onClick={() => {
                    setSelectedGroup(group)&&
                    setSelectedUser(null);
                  }}
                  className={`w-full px-4 py-3 flex items-center cursor-pointer gap-3 transition-all rounded-md ${
                    isSelected
                      ? "bg-zinc-800 ring-1 ring-zinc-700"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="relative mx-auto lg:mx-0">
                    <img
                      src={group.image || "./group.png"}
                      alt={group.name}
                      className="size-11 object-cover rounded-full border border-zinc-700"
                    />
                  </div>
                  <div className="hidden lg:block text-left min-w-0">
                    <div className="font-medium truncate text-white">
                      {group.name}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {group.members?.length || 0} members
                    </div>
                  </div>
                </button>
              );
            })}
            {groups.length === 0 && (
              <div className="text-center text-zinc-500 py-6">
                No groups found
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
