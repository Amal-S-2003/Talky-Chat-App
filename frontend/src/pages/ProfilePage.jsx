import React, { useContext, useState, useEffect } from "react";
import { Camera, Mail, User, Pencil, Check } from "lucide-react";
import { UserContext } from "../context/UserContext";
import BackToHomeButton from "../components/buttons/BackToHomeButton";

function ProfilePage() {
  const { authUser, isUpdatingProfile, updateProfile } = useContext(UserContext);

  const [selectedImage, setSelectedImage] = useState();
  const [editing, setEditing] = useState({ username: false, email: false });
  const [formData, setFormData] = useState({
    username: authUser?.username || "",
    email: authUser?.email || "",
  });

  // Sync formData if authUser changes
  useEffect(() => {
    setFormData({
      username: authUser?.username || "",
      email: authUser?.email || "",
    });
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      const res=await updateProfile({ profilePic: base64Image });
      console.log(res);
      
    };
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (field) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
    await updateProfile({ [field]: formData[field] });
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-10">
      <div className="max-w-2xl mx-auto bg-base-300 rounded-xl p-6 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-zinc-400">Manage your profile information</p>
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImage || authUser?.profilePic || "/dp.jpeg"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-base-content"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update your photo"}
          </p>
        </div>

        {/* Editable Basic Info */}
        <div className="space-y-6">
          {/* Username */}
          <div>
            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <User className="w-4 h-4" />
              Username
            </div>
            {editing.username ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={(e) => handleFieldChange("username", e.target.value)}
                  className="flex-grow mt-1 px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => handleSave("username")}
                  className="btn btn-sm btn-primary flex items-center gap-1"
                  disabled={isUpdatingProfile}
                  title="Save username"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1 px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700">
                <span>{authUser?.username}</span>
                <button
                  onClick={() => setEditing((prev) => ({ ...prev, username: true }))}
                  className="btn btn-ghost btn-sm p-0 text-zinc-400 hover:text-base-content"
                  title="Edit username"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            {editing.email ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="flex-grow mt-1 px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => handleSave("email")}
                  className="btn btn-sm btn-primary flex items-center gap-1"
                  disabled={isUpdatingProfile}
                  title="Save email"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between mt-1 px-4 py-2.5 bg-base-200 rounded-lg border border-zinc-700">
                <span>{authUser?.email}</span>
                <button
                  onClick={() => setEditing((prev) => ({ ...prev, email: true }))}
                  className="btn btn-ghost btn-sm p-0 text-zinc-400 hover:text-base-content"
                  title="Edit email"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        <BackToHomeButton />
      </div>
    </div>
  );
}

export default ProfilePage;
