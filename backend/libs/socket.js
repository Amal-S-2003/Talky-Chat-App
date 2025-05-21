const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174"],
  },
});

// Used to store online users: { userId: socketId }
const userSocketMap = {};

// Function to get the socket ID of a specific user
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group room
  socket.on("join-group", (groupId) => {
    socket.join(groupId);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  // Cleanup
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// Exporting modules
module.exports = {
  io,     
  app,
  server,
  getReceiverSocketId
};


// else if (req.params.userId) {
//       // Individual message
//       newMessage = new messages({
//         senderId,
//         receiverId: req.params.userId,
//         text,
//         image: imageUrl,
//       });

//       await newMessage.save();

//       const receiverSocketId = getReceiverSocketId(req.params.userId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("newMessage", newMessage);
//       }
//     } else {
//       return res.status(400).json({ error: "Invalid message target" });
//     }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }