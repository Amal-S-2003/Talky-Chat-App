import React, { useContext, useEffect, useMemo, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { GroupContext } from "../context/GroupContext";
import { UserContext } from "../context/UserContext";
import { ChatContext } from "../context/ChatContext";

const GroupDetails = () => {
  const {groupDetails, fetchGroupDetails, deleteGroup, addMembersToGroup, removeAMember } =
    useContext(GroupContext);
  const { authUser } = useContext(UserContext);
  const { users,getUsers } = useContext(ChatContext);
  // const [groupDetails, setGroupDetails] = useState([]);
  const { groupId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      const res = fetchGroupDetails(groupId);
      getUsers()
    }
  }, [groupId]);

  const isAdmin = useMemo(() => {
    return groupDetails?.admin?._id === authUser?._id;
  }, [groupDetails, authUser]);

  const nonMembers = useMemo(() => {
    if (!users || !groupDetails) return [];
    console.log(users,"NON MEMBERS")
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

  if (!groupDetails || !authUser) {
    return (
      <div className="text-center text-gray-500 py-10">Loading group...</div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg space-y-4">
      {/* Group Info */}
      <div className="flex items-center gap-4">
        <img
          src={groupDetails.image||'/group.png'}
          alt="Group"
          className="w-20 h-20 rounded-full border object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{groupDetails.name}</h2>
          <p className="text-sm text-gray-600">
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
                  aria-label={`Remove member ${member.username}`}
                >
                  <X size={18} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
  {/* Admin Actions */}
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
      {/* Add Member List */}
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

    
    </div>
  );
};

export default GroupDetails;
