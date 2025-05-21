const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

// Maps
const userSocketMap = {}; // { userId: socketId }

function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  const userId = socket.handshake.query.userId;

  // Register user socket
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`👤 User ${userId} mapped to socket ${socket.id}`);
  }

  // Emit current online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // User joins a group room
  socket.on("joinGroup", (groupId) => {
    if (groupId) {
      socket.join(groupId);
      console.log(` Socket ${socket.id} joined group room ${groupId}`);
    }
  });

  // User sends message to group
  socket.on("sendGroupMessage", ({ groupId, message }) => {
    console.log(` Message sent to group ${groupId}:`, message);
    io.to(groupId).emit("receiveGroupMessage", message);
  });

  // Personal message
  socket.on("sendPrivateMessage", ({ receiverId, message }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receivePrivateMessage", message);
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    console.log(" A user disconnected:", socket.id);
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export server components
module.exports = {
  io,
  app,
  server,
  getReceiverSocketId,
};
