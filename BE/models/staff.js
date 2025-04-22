const mongoose = require("mongoose");

const StaffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dept: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    empno: { type: String, required: true, unique: true },
    category: { type: String},
});

module.exports = mongoose.model("staff", StaffSchema);
