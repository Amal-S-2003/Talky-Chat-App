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
const BASE_URL = "http://localhost:3000"; // Update for production

export const GroupContext = createContext();

export const GroupContextProvider = (props) => {
  const [groupDetails, setGroupDetails] = useState([]);
  const [socket, setSocket] = useState(null);

  // Connect to Socket.IO using provided user
  const connectSocket = (group) => {    
    if (!group || socket?.connected) {
      console.log(
        "Socket already connected or no group:",
        group,
        socket?.connected
      );
      return;
    }

    const newSocket = io(BASE_URL, {
      query: { groupId: group._id },
    });

    newSocket.connect();

    setSocket(newSocket);
  };

  // Disconnect from Socket.IO
  const disconnectSocket = () => {
    if (socket?.connected) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const fetchGroupDetails = async (id) => {
    try {
      const res = await getGroupDetails(id);
      setGroupDetails(res.data);
      // return res.data;
    } catch (error) {
      console.error("Error in getting group details", error);
      throw error;
    }
  };

  // Create Group
  const createGroup = async (groupData) => {
    try {
      const res = await createGroupAPI(groupData);
      console.log(res.data);
      connectSocket(res.data);
      return res.data;
    } catch (error) {
      console.error("Create group failed:", error);
      throw error;
    }
  };

  // Edit Group Name or Image
  const editGroup = async (groupId, updatedData) => {
    try {
      const res = await editGroupAPI(groupId, updatedData);
      return res.data;
    } catch (error) {
      console.error("Edit group failed:", error);
      throw error;
    }
  };

  // Delete Group
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

  // Add New Member
  const addMembersToGroup = async (groupId, userId) => {
    console.log(groupId, userId);

    try {
      const res = await addMemberAPI(groupId, userId);
      return res.data;
    } catch (error) {
      console.error("Add member failed:", error);
      throw error;
    }
  };

  // Remove a Member
  const removeAMember = async (groupId, userId) => {
    console.log(groupId, userId);

    try {
      const res = await removeMemberAPI(groupId, userId);
      console.log(res);

      return res.data;
    } catch (error) {
      console.error("Remove member failed:", error);
      throw error;
    }
  };

  const value = {
    groupDetails,disconnectSocket,
    setGroupDetails,
    connectSocket,
    fetchGroupDetails,
    createGroup,
    editGroup,
    deleteGroup,
    addMembersToGroup,
    removeAMember,
  };

  return (
    <GroupContext.Provider value={value}>
      {props.children}
    </GroupContext.Provider>
  );
};
