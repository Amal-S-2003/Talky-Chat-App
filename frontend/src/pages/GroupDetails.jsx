import React, { useContext, useEffect, useMemo, useState } from "react";
import { X, UserPlus, Trash2, Camera, Pencil, Check } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { GroupContext } from "../context/GroupContext";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";
import { toast } from "react-toastify";

const GroupDetails = () => {
  const {
    groupDetails,
    fetchGroupDetails,
    deleteGroup,
    addMembersToGroup,
    removeAMember,
    editGroup,
  } = useContext(GroupContext);

  const { authUser } = useContext(UserContext);
  const { users, getUsers } = useContext(ChatContext);

  const { groupId } = useParams();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails(groupId);
      getUsers();
    }
  }, [groupId]);

  useEffect(() => {
    setEditedName(groupDetails?.name || "");
  }, [groupDetails]);

  const isAdmin = useMemo(() => {
    return groupDetails?.admin?._id === authUser?._id;
  }, [groupDetails, authUser]);

  const nonMembers = useMemo(() => {
    if (!users || !groupDetails) return [];
    const memberIds = groupDetails?.members?.map((m) => m._id);
    return users?.filter((user) => !memberIds?.includes(user._id));
  }, [users, groupDetails]);

  const handleAddMember = async (userId) => {
    await addMembersToGroup(groupId, userId);
    fetchGroupDetails(groupId);
  };

  const handleRemoveMember = async (memberId) => {
    if (!isAdmin) return;
    if (window.confirm("Remove this member?")) {
      await removeAMember(groupId, memberId);
      fetchGroupDetails(groupId);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      await deleteGroup(groupId);
      navigate("/");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUploading(true);
      const base64Image = reader.result;
      try {
        await editGroup(groupId, { image: base64Image });
        toast.success("Group image updated!");
        fetchGroupDetails(groupId);
      } catch (err) {
        toast.error("Failed to update image");
      } finally {
        setImageUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = async () => {
    try {
      await editGroup(groupId, { name: editedName });
      toast.success("Group name updated!");
      fetchGroupDetails(groupId);
      setIsEditingName(false);
    } catch {
      toast.error("Failed to update name");
    }
  };

  if (!groupDetails || !authUser) {
    return (
      <div className="text-center text-gray-500 py-10">Loading group...</div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg space-y-6">
      {/* Group Image + Name */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <img
            src={groupDetails.image || "/group.png"}
            alt="Group"
            className="w-32 h-32 rounded-full border object-cover"
          />
          {isAdmin && (
            <label
              htmlFor="group-image-upload"
              className={`absolute bottom-0 right-0 bg-black/70 p-2 rounded-full cursor-pointer ${
                imageUploading ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="text-white w-4 h-4" />
              <input
                type="file"
                id="group-image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {imageUploading
            ? "Uploading image..."
            : isAdmin
            ? "Click camera icon to update image"
            : ""}
        </p>

        <div className="text-center">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="px-3 py-2 border rounded w-52 text-center"
              />
              <button
                onClick={handleSaveName}
                className="btn btn-sm btn-primary"
              >
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{groupDetails.name}</h2>
              {isAdmin && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-gray-500 hover:text-black"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
          )}
          <p className="text-sm text-gray-600 mt-1">
            Admin:{" "}
            <span className="font-semibold">
              {groupDetails.admin?.username}
            </span>
          </p>
        </div>
      </div>

      {/* Members List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul className="space-y-2">
          {groupDetails?.members?.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{member.username}</span>
              {isAdmin && member._id !== authUser._id && (
                <button
                  onClick={() => handleRemoveMember(member._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Members */}
      {isAdmin && nonMembers.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mt-4 mb-2">Add New Member</h4>
          <ul className="space-y-2">
            {nonMembers?.map((user) => (
              <li
                key={user._id}
                className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded"
              >
                <span>{user.username}</span>
                <button
                  onClick={() => handleAddMember(user._id)}
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  <UserPlus size={16} className="inline" /> Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Delete Group */}
      {isAdmin && (
        <div className="flex justify-between pt-4">
          <button
            onClick={handleDeleteGroup}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            <Trash2 size={18} />
            Delete Group
          </button>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
