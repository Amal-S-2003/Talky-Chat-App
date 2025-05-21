import { createContext, useEffect, useState } from "react";
import {
  addMemberAPI,
  createGroupAPI,
  deleteGroupAPI,
  editGroupAPI,
  getGroupDetails,
  removeMemberAPI,
} from "../services/allAPIS";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:3000"; // Change this to your production URL if needed

export const GroupContext = createContext();

export const GroupContextProvider = ({ children }) => {
  const [groupDetails, setGroupDetails] = useState([]);
  const [socket, setSocket] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState(null);

  // Connect to socket and join group room
  const connectSocket = (group) => {
    if (!group || !group._id) return;

    // If socket already exists, just emit joinGroup
    if (socket) {
      socket.emit("joinGroup", group._id);
      setCurrentGroupId(group._id);
      return;
    }

    // Create new socket and join group once connected
    const newSocket = io(BASE_URL);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      newSocket.emit("joinGroup", group._id);
      setCurrentGroupId(group._id);
    });

    setSocket(newSocket);
  };

  // Disconnect from socket
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setCurrentGroupId(null);
    }
  };

  // Switch group room if already connected
  const switchGroupRoom = (newGroupId) => {
    if (socket && currentGroupId !== newGroupId) {
      socket.emit("leaveGroup", currentGroupId);
      socket.emit("joinGroup", newGroupId);
      setCurrentGroupId(newGroupId);
    }
  };

  // Fetch group details
  const fetchGroupDetails = async (id) => {
    try {
      const res = await getGroupDetails(id);
      setGroupDetails(res.data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      throw error;
    }
  };

  // Create a group
  const createGroup = async (groupData) => {
    try {
      const res = await createGroupAPI(groupData);
      connectSocket(res.data); // Connect to new group
      return res.data;
    } catch (error) {
      console.error("Create group failed:", error);
      throw error;
    }
  };

  // Edit group name or image
  const editGroup = async (groupId, updatedData) => {
    try {
      const res = await editGroupAPI(groupId, updatedData);
      return res.data;
    } catch (error) {
      console.error("Edit group failed:", error);
      throw error;
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    try {
      const res = await deleteGroupAPI(groupId);
      disconnectSocket();
      return res.data;
    } catch (error) {
      console.error("Delete group failed:", error);
      throw error;
    }
  };

  // Add a member to group
  const addMembersToGroup = async (groupId, userId) => {
    try {
      const res = await addMemberAPI(groupId, userId);
      return res.data;
    } catch (error) {
      console.error("Add member failed:", error);
      throw error;
    }
  };

  // Remove a member from group
  const removeAMember = async (groupId, userId) => {
    try {
      const res = await removeMemberAPI(groupId, userId);
      return res.data;
    } catch (error) {
      console.error("Remove member failed:", error);
      throw error;
    }
  };

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const value = {
    socket,
    groupDetails,
    setGroupDetails,
    connectSocket,
    disconnectSocket,
    switchGroupRoom,
    fetchGroupDetails,
    createGroup,
    editGroup,
    deleteGroup,
    addMembersToGroup,
    removeAMember,
  };
  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};
