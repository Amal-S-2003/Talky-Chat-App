import React from "react";
import { Users } from "lucide-react"; // Group icon
import { useNavigate } from "react-router-dom";

function CreateGroupButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/groups/create')}
      className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-full shadow-md hover:bg-yellow-600 active:scale-95 transition duration-200  "
    >
      <Users className="w-5 h-5" />
      <span className="font-semibold">Create Group</span>
    </button>
  );
}

export default CreateGroupButton;
