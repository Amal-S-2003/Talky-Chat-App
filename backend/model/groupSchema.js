const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image:{type:String}, 
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  createdAt: { type: Date, default: Date.now },
});
const groups = mongoose.model("groups", groupSchema);
module.exports = groups;
