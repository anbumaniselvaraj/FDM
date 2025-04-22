const mongoose = require("mongoose");

const ExamAllocationSchema = new mongoose.Schema({
    examName: { type: String, required: true }, // Store exam name directly for quick access
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true }, // Reference Exam Model
    allocations: [
        {
            staffId: { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
            staffName: { type: String, required: true }, // Store staff name directly for quick access
            roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
            roomNo: { type: String, required: true } // Store room number directly for quick access
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("ExamAllocation", ExamAllocationSchema);
