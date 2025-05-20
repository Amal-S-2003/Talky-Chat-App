const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    group: { type: mongoose.Schema.Types.ObjectId, ref: "groups" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const messages = mongoose.model("messages", messageSchema);

module.exports = messages;
