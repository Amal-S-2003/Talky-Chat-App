import React from "react";
import {  MessageSquare } from "lucide-react";

function SidebarSkeleton() {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-gray-300 
    flex flex-col transition-all duration-200 bg-white dark:bg-neutral-900"
    >
      {/* Header */}
      <div className="border-b border-gray-300 w-full p-5">
        <div className="flex items-center gap-2 ">
          <MessageSquare className="w-10 h-10  text-indigo-600" />
          <h1 className="text-3xl font-bold text-center text-indigo-600 ">
            Talky
          </h1>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div
            key={idx}
            className="w-full p-3 flex items-center gap-3 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="h-4 w-32 mb-2 bg-gray-300 dark:bg-gray-700 rounded" />
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default SidebarSkeleton;
