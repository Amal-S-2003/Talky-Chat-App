import { createContext, useContext, useEffect, useState } from "react";
import {
  getMessagesAPI,
  getUsersAPI,
  sendMessageAPI,
} from "../services/allAPIS";
import { UserContext } from "./UserContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);

  const { socket } = useContext(UserContext);

  // Fetch users
  const getUsers = async () => {
    setIsUsersLoading(true);
    try {
      const res = await getUsersAPI();
      console.log(res.data,"getUser in fe");
      
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error?.response?.data?.message);
    } finally {
      setIsUsersLoading(false);
    }
  };

  // Fetch messages for a user
  const getMessages = async (userId) => {
    setIsMessagesLoading(true);
    try {
      const res = await getMessagesAPI(userId);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error?.response?.data?.message);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Send a message to selected user
  const sendMessage = async (messageData) => {
  if (!selectedUser) return;

  try {

    const res = await sendMessageAPI(selectedUser._id, messageData);
    setMessages((prev) => [...prev, res.data]);
  } catch (error) {
    console.error("Failed to send message:", error?.response?.data?.message);
  }
};


  // Subscribe to incoming messages from selected user
  const subscribeToMessages = () => {
    if (!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId === selectedUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });
  };

  // Unsubscribe from incoming messages
  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage");
    }
  };


  const value = {
    users,
    messages,
    selectedUser,
    isUsersLoading,
    isMessagesLoading,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
