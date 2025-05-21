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
const groupSocketMap={}
// Function to get the socket ID of a specific user
function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
function getReceiverGroupSocketId(groupId) {
  return groupSocketMap[groupId];
}
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  const userId = socket.handshake.query.userId;
  const groupId = socket.handshake.query.groupId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  }
  if (groupId) {
    groupSocketMap[groupId] = socket.id;
    console.log(`Group ${groupId} mapped to socket ${socket.id}`);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));


  // Cleanup
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    if (userId) delete userSocketMap[userId];
    // if (groupId) delete groupSocketMap[groupId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
// Exporting modules
module.exports = {
  io,     
  app,
  server,
  getReceiverSocketId,
  getReceiverGroupSocketId

};

