import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ChatBody from '../components/ChatBody';
import { ChatContext } from '../context/ChatContext';
import NoChat from '../components/NoChat';
import LogOutButton from '../components/LogOutButton';
import ViewProfileButton from '../components/ViewProfileButton';

function HomePage() {
  const {selectedUser}=useContext(ChatContext)
  return (
  <div className='h-screen bg-gray-400'>
    <ViewProfileButton/>
    <LogOutButton/>
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {
              !selectedUser?<NoChat/>:<ChatBody/>
}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
