const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  no: { type: String, required: true, unique: true }, // Room Number (e.g., "101")
  department: { type: String, required: true } // Department Name (e.g., "Computer Science")
});

module.exports = mongoose.model("Room", RoomSchema);
