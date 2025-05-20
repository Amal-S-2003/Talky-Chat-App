import React from "react";
import { MessageSquare } from "lucide-react";
import CreateGroupButton from "./buttons/CreateGroupButton";
import ViewProfileButton from "./buttons/ViewProfileButton";
import LogOutButton from "./buttons/LogOutButton";

function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <MessageSquare className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600">Talky</h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <CreateGroupButton />
          <ViewProfileButton />
          <LogOutButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
