import React, { useContext, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { ChatContext } from '../context/ChatContext';
import { UserContext } from '../context/UserContext';
import MessageSkeleton from './skeletons/MessageSkeleton';

function ChatBody() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    selectedGroup,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useContext(ChatContext);

  const { authUser } = useContext(UserContext);
  const messageEndRef = useRef(null);

  const formatMessageTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Fetch messages when selectedUser or selectedGroup changes
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id, false); // false => not a group
    } else if (selectedGroup) {
      getMessages(selectedGroup._id, true); // true => group
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, selectedGroup]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!selectedUser && !selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select a user or group to start chatting
      </div>
    );
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, idx) => {
          const isSender = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              ref={idx === messages.length - 1 ? messageEndRef : null}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-end gap-2 max-w-[70%] ${
                  isSender ? 'flex-row-reverse' : ''
                }`}
              >
                {/* Profile Image */}
                <div className="w-10 h-10 rounded-full border overflow-hidden">
                  <img
                    src={
                      isSender
                        ? authUser.profilePic || '/dp.jpeg'
                        : (selectedUser?.profilePic || selectedGroup?.image || '/dp.jpeg')
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Message Bubble */}
                <div>
                  <div className="text-xs text-zinc-400 mb-1">
                    {formatMessageTime(message.createdAt)}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 text-sm break-words ${
                      isSender
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-white'
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="max-w-[200px] rounded-md mb-2"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatBody;
