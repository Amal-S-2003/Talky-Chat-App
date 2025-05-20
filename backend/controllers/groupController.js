const groups = require("../model/groupSchema");
const messages = require("../model/messageSchema.js");
const cloudinary = require("../libs/cloudinary.js");

// GET all groups for the logged-in user
exports.getGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const userGroups = await groups
      .find({ members: userId })
      .populate("members", "username email profilePic");
    res.json(userGroups);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch groups", error: err.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  console.log("getGroupMessages");
  console.log(req.params);

  try {
    const { id: groupId } = req.params;

    const msgs = await messages
      .find({ group: groupId })
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });
    console.log(msgs);

    res.status(200).json(msgs);
  } catch (error) {
    console.error("Error in getGroupMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// CREATE a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, image, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res
        .status(400)
        .json({ message: "Group name and members are required." });
    }

    let groupImage = image;

    // Upload image to Cloudinary if it's a base64 string
    if (image && image.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      groupImage = uploadResponse.secure_url;
    }

    // Ensure the creator is also added to the group
    const memberSet = new Set([...members, req.user._id.toString()]);

    const newGroup = new groups({
      name,
      image: groupImage,
      members: Array.from(memberSet),
      admin: req.user._id,
    });

    const savedGroup = await newGroup.save();
    res.status(201).json(savedGroup);
  } catch (err) {
    console.error("Error in createGroup:", err);
    res
      .status(500)
      .json({ message: "Failed to create group", error: err.message });
  }
};

// EDIT group details (name/image)
exports.editGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, image } = req.body;

    const updatedGroup = await groups.findByIdAndUpdate(
      groupId,
      { name, image },
      { new: true }
    );

    res.json(updatedGroup);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update group", error: err.message });
  }
};

// DELETE a group
exports.deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    await groups.findByIdAndDelete(groupId);
    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete group", error: err.message });
  }
};

// ADD a new member
exports.addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.body.userId;

    const group = await groups
      .findByIdAndUpdate(
        groupId,
        { $addToSet: { members: userId } },
        { new: true }
      )
      .populate("members", "username email profilePic");

    res.json(group);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add member", error: err.message });
  }
};

// REMOVE a member
exports.removeMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.body.userId;

    const group = await groups
      .findByIdAndUpdate(groupId, { $pull: { members: userId } }, { new: true })
      .populate("members", "username email profilePic");

    res.json(group);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove member", error: err.message });
  }
};
