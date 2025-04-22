const mongoose = require("mongoose");

const ExamSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Exam name
  time: { type: String, required: true },         // Exam time (e.g., "10:00 AM - 1:00 PM")
  date: { type: Date, required: true },           // Exam date
  no_of_rooms: { type: Number, required: true }   // Number of rooms allocated
});

module.exports = mongoose.model("Exam", ExamSchema);
