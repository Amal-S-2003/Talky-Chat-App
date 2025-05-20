import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ImagePlus } from "lucide-react";
import { ChatContext } from "../context/ChatContext";
import { GroupContext } from "../context/GroupContext";

function CreateGroupPage() {
  const { users } = useContext(ChatContext);
  const { createGroup } = useContext(GroupContext);
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupImage, setGroupImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setGroupImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Group name is required.");
      return;
    }

    const newGroup = {
      name: groupName,
      image: groupImage,
      members: selectedUsers,
    };

    console.log("Group Created:", newGroup);
    // Handle API call here
    createGroup(newGroup)
    navigate("/");
  };

  const handleClose = () => {
    navigate("/");
  };
  useEffect(() => {
    console.log(users);
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-100 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create Group</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={28} />
        </button>
      </div>

      {/* Group Image */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Group Image (optional)
        </label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-3 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            <ImagePlus size={16} className="mr-2" />
            Upload Image
          </button>
          {groupImage && (
            <img
              src={groupImage}
              alt="Preview"
              className="w-14 h-14 rounded-full object-cover border border-gray-400"
            />
          )}
        </div>
      </div>

      {/* Group Name */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Group Name
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-yellow-400 bg-white"
          placeholder="Enter group name"
        />
      </div>

      {/* Select Users */}
      <div className="mb-6 max-h-44 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
        <p className="text-sm font-semibold text-gray-700 mb-3">Select Users</p>
        {users?.map((user) => (
          <label
            key={user._id}
            className="flex items-center gap-2 mb-2 text-gray-700"
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => handleCheckboxChange(user._id)}
              className="accent-yellow-500"
            />
            {user.username}
          </label>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
        >
          Close
        </button>
        <button
          onClick={handleCreateGroup}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Create Group
        </button>
      </div>
    </div>
  );
}

export default CreateGroupPage;
