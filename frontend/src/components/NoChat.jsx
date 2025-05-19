import React from "react";
import { MessageSquare } from "lucide-react";

function NoChat() {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-10 bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center shadow-md animate-bounce">
            <MessageSquare className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-3xl font-bold text-gray-800">Welcome to Talky 👋</h2>
        <p className="text-gray-600 text-base leading-relaxed">
          Select a conversation from the sidebar to start chatting.
          <br />
          Talk freely, talk easily — with <span className="text-indigo-600 font-semibold">Talky</span>.
        </p>
      </div>
    </div>
  );
}

export default NoChat;
