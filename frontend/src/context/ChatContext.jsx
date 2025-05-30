import { createContext, useContext, useEffect, useState } from "react";
import {
  getGroupMessagesAPI,
  getGroupsAPI,
  getMessagesAPI,
  getRecentChats,
  getUsersAPI,
  sendMessageAPI,
} from "../services/allAPIS";
import { UserContext } from "./UserContext";

// Create the ChatContext
export const ChatContext = createContext();

// ChatContextProvider component
export const ChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const { socket } = useContext(UserContext);

  // Fetch all users
  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await getUsersAPI();
      setUsers(res.data);      
    } catch (error) {
      console.error("Failed to fetch users:", error?.response?.data?.message);
    } finally {
      setIsUsersLoading(false);
    }
  };
  // Fetch chat users
  const getRecentChatUsers = async () => {
    try {
      const res = await getRecentChats();
      setRecentChats(res.data);      
    } catch (error) {
      console.error("Failed to fetch users:", error?.response?.data?.message);
    } finally {
      setIsUsersLoading(false);
    }
  };

  // Fetch all groups
  const getGroups = async () => {
    try {
      const res = await getGroupsAPI();
      setGroups(res.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error?.response?.data?.message);
    }
  };

  // Fetch messages for either a user or a group
  const getMessages = async (id, isGroup) => {
    setIsMessagesLoading(true);
    try {
      const res = isGroup
        ? await getGroupMessagesAPI(id)
        : await getMessagesAPI(id);        
      isGroup ? setGroupMessages(res.data) : setMessages(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch messages:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Send message to either selected user or selected group
 const sendMessage = async (messageData) => {
  if (!selectedUser && !selectedGroup) return;

  try {
    const payload = selectedUser
      ? { userId: selectedUser._id, data: messageData }
      : { groupId: selectedGroup._id, data: messageData };

    const res = await sendMessageAPI(payload);
  getRecentChatUsers()

    if (selectedUser) {
      setMessages((prev) => [...prev, res.data]);
      socket?.emit("sendPrivateMessage", {
        receiverId: selectedUser._id,
        message: res.data,
      });
    } else if (selectedGroup) {

      socket?.emit("sendGroupMessage", {
        groupId: selectedGroup._id,
        message: res.data,
      });
    }
  } catch (error) {
    console.error("Failed to send message:", error?.response?.data?.message);
  }
};



const subscribeToMessages = () => {
  if (!socket) return;

  // Personal messages
  socket.on("newMessage", (newMessage) => {
    if (
      selectedUser &&
      !newMessage.group &&
      (newMessage.senderId === selectedUser._id ||
        newMessage.receiverId === selectedUser._id)
    ) {
      setMessages((prev) => [...prev, newMessage]);
    }
  });

  // Group messages
  socket.on("newGroupMessage", (newGroupMessage) => {

    console.log(newGroupMessage);
    
    if (selectedGroup && newGroupMessage.group === selectedGroup._id) {
      setGroupMessages((prev) => [...prev, newGroupMessage]); // ✅ Fix here
    }
  });
};

const unsubscribeFromMessages = () => {
  if (socket) {
    socket.off("newMessage");
    socket.off("newGroupMessage");
  }
};

useEffect(() => {
  subscribeToMessages();
  return () => {
    unsubscribeFromMessages();
  };
}, [socket,sendMessage, selectedUser, selectedGroup]);
useEffect(() => {
  
  getRecentChatUsers()

}, []); 
useEffect(() => {
  if (selectedGroup && socket) {
    socket.emit("joinGroup", selectedGroup._id);
  }
}, [selectedGroup, socket]);

  // Context value
  const value = {
    users,
    groups,
    messages,
    selectedUser,
    selectedGroup,
    isUsersLoading,
    isMessagesLoading,
    groupMessages,recentChats, setRecentChats,getRecentChatUsers,
    setGroupMessages,
    setGroups,
    setSelectedUser,
    setSelectedGroup,
    getUsers,
    getGroups,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
