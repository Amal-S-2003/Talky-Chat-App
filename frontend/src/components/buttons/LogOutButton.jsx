import React, { useContext } from "react";
import { LogOut } from "lucide-react"; // Optional icon
import { UserContext } from "../../context/UserContext";

function LogOutButton() {
    const {logout}=useContext(UserContext)

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 active:scale-95 transition duration-200  "
    >
      <LogOut className="w-5 h-5" />
      <span className="font-semibold">Log Out</span>
    </button>
  );
}

export default LogOutButton;
