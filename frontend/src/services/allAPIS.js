import { commonAPI } from "./commonAPI";
import { server_url } from "./server_url";

export const authCheck=async()=>{
  return await commonAPI("GET", `${server_url}/check`, "", "");
}
export const loginAPI=async(reqBody)=>{
  return await commonAPI("POST", `${server_url}/login`, reqBody, "");
}
export const registerAPI=async(reqBody)=>{
  return await commonAPI("POST", `${server_url}/register`, reqBody, "");
}
export const logoutAPI=async(reqBody)=>{
  return await commonAPI("POST", `${server_url}/logout`, reqBody, "");
}
export const updateProfileAPI=async(reqBody)=>{
  return await commonAPI("PUT", `${server_url}/edit-profile`, reqBody, "");
}



// MESSAGES ROUTES
export const getUsersAPI=async()=>{
  return await commonAPI("GET", `${server_url}/messages/users`, "", "");
}

export const getMessagesAPI=async(userId)=>{
  return await commonAPI("GET", `${server_url}/messages/${userId}`, "", "");
}
export const sendMessageAPI = async ({ userId, groupId, data }) => {
  if (userId) {
    return await commonAPI("POST", `${server_url}/messages/${userId}`, data);
  } else if (groupId) {
    return await commonAPI("POST", `${server_url}/group/${groupId}`, data);
  } else {
    throw new Error("No userId or groupId provided to sendMessageAPI");
  }
};




// GROUPS
export const getGroupMessagesAPI=async(groupId)=>{
  return await commonAPI("GET", `${server_url}/group/${groupId}`, "", "");
}
export const getGroupsAPI=async()=>{
  return await commonAPI("GET", `${server_url}/get-groups`, "", "");
}
export const getGroupDetails=async(id)=>{
  return await commonAPI("GET", `${server_url}/get-group/${id}`, "", "");
}
export const createGroupAPI=async(groupData)=>{
  return await commonAPI("POST", `${server_url}/create-group`, groupData, "");
}
export const editGroupAPI=async(groupId, updatedData)=>{
  return await commonAPI("PUT", `${server_url}/edit-group/${groupId}`, updatedData, "");
}
export const deleteGroupAPI=async(groupId)=>{
  return await commonAPI("DELETE", `${server_url}/delete-group`, {groupId}, "");
}
export const addMemberAPI=async(groupId, userId)=>{
  return await commonAPI("PUT", `${server_url}/edit-group/${groupId}/add`, {userId}, "");
}
export const removeMemberAPI=async(groupId, userId)=>{
  return await commonAPI("PUT", `${server_url}/edit-group/${groupId}/remove`, {userId}, "");
}
