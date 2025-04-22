const Staff = require("../models/staff");

// Create a new Staff
exports.createStaff = async (req, res) => {
  try {
    const staff = new Staff(req.body);
    await staff.save();
    res.status(201).json(staff);
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message });
  }
};

// Get all Staffs
exports.getStaffs = async (req, res) => {
  const staffs = await Staff.find();
  res.json(staffs);
};

// Update a Staff
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(staff);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a Staff
exports.deleteStaff = async (req, res) => {
  await Staff.findByIdAndDelete(req.params.id);
  res.json({ message: "Staff deleted" });
};
