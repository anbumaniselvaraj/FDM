const express = require("express");
const { createStaff, getStaffs, updateStaff, deleteStaff } = require("../controller/staffController");

const router = express.Router();
const Staff = require('../models/staff');

const multer = require("multer");
const XLSX = require("xlsx");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", createStaff);
router.get("/", getStaffs);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);

router.post("/upload-staff", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });
    console.log(req.file.buffer)
    try {
        // ✅ Read Excel File
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(data)

        // ✅ Validate & Insert Data into MongoDB
        const rooms = data.map(row => ({
            name: row["name"],
            dept: row["dept"],
            email: row["email"],
            mobile: row["mobile"],
            empno: row["empno"],
            category: row["category"]
        }));

        console.log(rooms)

        await Staff.insertMany(rooms);
        res.json({ message: "Rooms uploaded successfully!", rooms });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed!", error });
    }
});

module.exports = router;
