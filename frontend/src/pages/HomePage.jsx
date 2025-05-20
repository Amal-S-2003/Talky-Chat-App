import React, { useContext } from "react";
import Sidebar from "../components/Sidebar";
import ChatBody from "../components/ChatBody";
import { ChatContext } from "../context/ChatContext";
import NoChat from "../components/NoChat";
import Navbar from "../components/Navbar";

function HomePage() {
  const { selectedUser,selectedGroup } = useContext(ChatContext);
  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-64px)] pt-10 bg-gray-100"> {/* Adjust height for navbar */}
        <div className="flex items-center justify-center  px-4">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
            <div className="flex h-full rounded-lg overflow-hidden">
              <Sidebar />
              {!(selectedUser||selectedGroup) ? <NoChat /> : <ChatBody />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
