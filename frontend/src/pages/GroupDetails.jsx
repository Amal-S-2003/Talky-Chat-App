import React from "react";
import { X, UserPlus, Trash2 } from "lucide-react";

const GroupDetails = ({ group, onRemoveMember, onAddMember, onDeleteGroup }) => {
  // Example props fallback (for testing before real data is passed)
  group = group || {
    name: "Project Avengers",
    image: "https://via.placeholder.com/80",
    admin: { name: "Tony Stark" },
    members: [
      { _id: "1", name: "Steve Rogers" },
      { _id: "2", name: "Bruce Banner" },
      { _id: "3", name: "Natasha Romanoff" },
    ],
  };

  const handleRemoveMember = (memberId) => {
    onRemoveMember?.(memberId);
  };

  const handleAddMember = () => {
    onAddMember?.();
  };

  const handleDeleteGroup = () => {
    if (confirm("Are you sure you want to delete this group?")) {
      onDeleteGroup?.();
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg space-y-4">
      {/* Group Info */}
      <div className="flex items-center gap-4">
        <img
          src={group.image}
          alt="Group"
          className="w-20 h-20 rounded-full border object-cover"
        />
        <div>
          <h2 className="text-xl font-bold">{group.name}</h2>
          <p className="text-sm text-gray-600">
            Admin: <span className="font-semibold">{group.admin.name}</span>
          </p>
        </div>
      </div>

      {/* Members List */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Members</h3>
        <ul className="space-y-2">
          {group.members.map((member) => (
            <li
              key={member._id}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span>{member.name}</span>
              <button
                onClick={() => handleRemoveMember(member._id)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handleAddMember}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
        >
          <UserPlus size={18} />
          Add Member
        </button>
        <button
          onClick={handleDeleteGroup}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700"
        >
          <Trash2 size={18} />
          Delete Group
        </button>
      </div>
    </div>
  );
};

export default GroupDetails;
