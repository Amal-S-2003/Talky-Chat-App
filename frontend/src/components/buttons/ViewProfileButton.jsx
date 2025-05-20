import React from "react";
import { User } from "lucide-react"; // Icon for profile
import {  useNavigate } from "react-router-dom";

function ViewProfileButton() {
const naviagte=useNavigate()
  return (
    <button
      onClick={()=>naviagte('/profile')}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 active:scale-95 transition duration-200  "
    >
      <User className="w-5 h-5" />
      <span className="font-semibold">View Profile</span>
    </button>
  );
}

export default ViewProfileButton;
