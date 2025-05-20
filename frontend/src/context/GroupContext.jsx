import { createContext, useEffect, useState } from "react";
import {
  addMemberAPI,
  createGroupAPI,
  deleteGroupAPI,
  editGroupAPI,
  removeMemberAPI,
} from "../services/allAPIS";

export const GroupContext = createContext();

export const GroupContextProvider = (props) => {
  // const [groupMessages, setGroupMessages] = useState([]);

  // Fetch messages for a user
  // const getGroupMessages = async (group) => {
  //   try {
  //     const res = await getGroupMessagesAPI(group.id);
  //     setGroupMessages(res.data);
  //   } catch (error) {
  //     console.error(
  //       "Failed to fetch messages:",
  //       error?.response?.data?.message
  //     );
  //   }
  // };

  // Create Group
  const createGroup = async (groupData) => {
    try {
      const res = await createGroupAPI(groupData);
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
      return res.data;
    } catch (error) {
      console.error("Delete group failed:", error);
      throw error;
    }
  };

  // Add New Member
  const addNewMember = async (groupId, userId) => {
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
    try {
      const res = await removeMemberAPI(groupId, userId);
      return res.data;
    } catch (error) {
      console.error("Remove member failed:", error);
      throw error;
    }
  };

  const value = {
    createGroup,
    editGroup,
    deleteGroup,
    addNewMember,
    removeAMember,
  };

  return (
    <GroupContext.Provider value={value}>
      {props.children}
    </GroupContext.Provider>
  );
};
