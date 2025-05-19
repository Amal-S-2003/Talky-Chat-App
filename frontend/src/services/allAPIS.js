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
  return await commonAPI("POST", `${server_url}/update-profile`, reqBody, "");
}



// MESSAGES ROUTES
export const getUsersAPI=async()=>{
  return await commonAPI("GET", `${server_url}/messages/users`, "", "");
}

export const getMessagesAPI=async(userId)=>{
  return await commonAPI("GET", `${server_url}/messages/${userId}`, "", "");
}
export const sendMessageAPI=async(userId,messageData)=>{
  return await commonAPI("POST", `${server_url}/messages/send/${userId}`, messageData);
}