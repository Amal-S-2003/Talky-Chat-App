import React, { useContext, useState, useMemo } from 'react';
import { ChatContext } from '../context/ChatContext';
import moment from 'moment'; // npm install moment

const ExploreUsers = () => {
  const { users, setSelectedUser } = useContext(ChatContext);
  const [searchTerm, setSearchTerm] = useState('');

  const safeUsers = Array.isArray(users) ? users : [];

  const filteredUsers = useMemo(() => {
    return safeUsers?.filter(user =>
      user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, safeUsers]);

  return (
    <aside className="w-72 h-full border-r border-zinc-800 bg-zinc-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold mb-2">Explore Users</h2>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-md bg-zinc-800 border border-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto py-2 custom-scroll">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-zinc-500 mt-6">No users found</div>
        ) : (
          filteredUsers?.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors w-full text-left"
            >
              <img
                src={user.profilePic || '/dp.jpeg'}
                alt={user.username}
                className="w-11 h-11 rounded-full object-cover border border-zinc-700"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-zinc-400 truncate">
                  Since {moment(user.createdAt).format('MMM YYYY')}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};

export default ExploreUsers;
