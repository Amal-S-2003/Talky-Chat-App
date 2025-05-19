import React from "react";
import { Home } from "lucide-react"; // Optional home icon
import { useNavigate } from "react-router-dom";

function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 active:scale-95 mx-auto transition duration-200 "
    >
      <Home className="w-5 h-5" />
      <span className="font-semibold">Back To Home</span>
    </button>
  );
}

export default BackToHomeButton;
