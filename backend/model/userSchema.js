const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
 
  },
  { timestamps: true }
);
const users = mongoose.model("users", userSchema);
module.exports = users;
