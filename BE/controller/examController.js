const Exam = require("../models/exam");

// Create a new Exam
exports.createExam = async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json(newExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json({exams});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single Exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Exam
exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedExam) return res.status(404).json({ message: "Exam not found" });
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an Exam
exports.deleteExam = async (req, res) => {
  try {
    const deletedExam = await Exam.findByIdAndDelete(req.params.id);
    if (!deletedExam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
