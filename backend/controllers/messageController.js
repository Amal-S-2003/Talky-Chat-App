const users = require("../model/userSchema.js");
const messages = require("../model/messageSchema.js");
const cloudinary = require("../libs/cloudinary.js");
const { getReceiverSocketId,getReceiverGroupSocketId, io } = require("../libs/socket.js");
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



exports.getRecentChats = async (req, res) => {
  try {
    const currentUserId = req.user._id; // assuming user is authenticated

    const recentChats = await messages.aggregate([
      {
        $match: {
          $or: [
            { senderId: currentUserId },
            { receiverId: currentUserId }
          ],
          group: { $exists: false } // exclude group messages
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $project: {
          userId: {
            $cond: [
              { $eq: ["$senderId", currentUserId] },
              "$receiverId",
              "$senderId"
            ]
          },
          text: 1,
          image: 1,
          createdAt: 1
        }
      },
      {
        $group: {
          _id: "$userId",
          lastMessage: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$user._id",
            username: "$user.username",
            profilePic: "$user.profilePic",
            createdAt: "$user.createdAt"
          },
          lastMessage: {
            text: "$lastMessage.text",
            image: "$lastMessage.image",
            createdAt: "$lastMessage.createdAt"
          }
        }
      },
      {
        $sort: { "lastMessage.createdAt": -1 }
      }
    ]);

    console.log(recentChats);
    res.status(200).json(recentChats);
    
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const msgs = await messages
      .find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      })
      .populate("senderId", "username email profilePic") // adjust fields as needed
      .populate("receiverId", "username email profilePic"); // adjust fields as needed

    res.status(200).json(msgs);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.sendMessage = async (req, res) => {
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

  // Populate senderId before emitting
  const newGroupMessage = await messages
    .findById(newMessage._id)
    .populate("senderId", "username profilePic");

  res.status(201).json(newGroupMessage);

  // ✅ Emit to all sockets in the group room
  io.to(req.params.groupId).emit("newGroupMessage", newGroupMessage);
}
else if (req.params.userId) {
      // Private message
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

      res.status(201).json(newMessage);
      // res.status(201).json(populatedMessage);
    } else {
      return res.status(400).json({ error: "Invalid message target" });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
