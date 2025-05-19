import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  authCheck,
  loginAPI,
  logoutAPI,
  registerAPI,
  updateProfileAPI,
} from "../services/allAPIS";

const BASE_URL = "http://localhost:3000"; // Update for production

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect to Socket.IO using provided user
  const connectSocket = (user) => {
    if (!user || socket?.connected) {
      console.log(
        "Socket already connected or no user:",
        user,
        socket?.connected
      );
      return;
    }

    const newSocket = io(BASE_URL, {
      query: { userId: user._id },
    });

    newSocket.connect();

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    setSocket(newSocket);
  };

  // Disconnect from Socket.IO
  const disconnectSocket = () => {
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

  // Check user authentication
  const checkAuth = async () => {
    console.log("in check auth front end");

    try {
      const res = await authCheck();
      setAuthUser(res.data);
      connectSocket(res.data); // use fresh data
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Register new user
  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await registerAPI(data);
      setAuthUser(res.data);
      connectSocket(res.data);
    } catch (error) {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsSigningUp(false);
    }
  };

  // Login user
  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await loginAPI(data);
      setAuthUser(res.data);

      connectSocket(res.data);
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Logout user
const logout = async () => {
  try {
    await logoutAPI();
    setAuthUser(null);
    disconnectSocket();
    setOnlineUsers([]); // Clear online users list
  } catch (error) {
    console.error(
      "Logout failed:",
      error.response?.data?.message || error.message
    );
  }
};

  // Update user profile
const updateProfile = async (data) => {
  setIsUpdatingProfile(true);
  try {
    const res = await updateProfileAPI(data);
    setAuthUser(res.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Unknown error";
    console.error("Profile update failed:", errorMessage);
  } finally {
    setIsUpdatingProfile(false);
  }
};

  const value = {
    authUser,
    isSigningUp,
    isLoggingIn,
    isUpdatingProfile,
    isCheckingAuth,
    onlineUsers,
    socket,
    signup,
    login,
    logout,
    updateProfile,
    checkAuth,
    connectSocket,
    disconnectSocket,
    setAuthUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
