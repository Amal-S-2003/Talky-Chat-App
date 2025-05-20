const users = require("../model/userSchema.js");
const messages = require("../model/messageSchema.js");
const cloudinary = require("../libs/cloudinary.js");
const { getReceiverSocketId, io } = require("../libs/socket.js");
exports.getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await users
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports. getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const msgs = await messages.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(msgs);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
  console.log("sendMessage func");
  console.log("Params:", req.params);

  try {
    const { text, image } = req.body;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    let newMessage;

    if (req.params.groupId) {
      // Group message
      newMessage = new messages({
        senderId,
        group: req.params.groupId,
        text,
        image: imageUrl,
      });

      await newMessage.save();
      io.emit("newMessage", newMessage); // Broadcast to all in group (you can later optimize by group rooms)
    } else if (req.params.userId) {
      // Individual message
      newMessage = new messages({
        senderId,
        receiverId: req.params.userId,
        text,
        image: imageUrl,
      });

      await newMessage.save();

      const receiverSocketId = getReceiverSocketId(req.params.userId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    } else {
      return res.status(400).json({ error: "Invalid message target" });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

