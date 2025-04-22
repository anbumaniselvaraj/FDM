const express = require("express");
const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
} = require("../controller/roomController");

const multer = require("multer");
const XLSX = require("xlsx");

const Room = require("../models/room");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/", createRoom);       // Create Room
router.get("/", getRooms);          // Get All Rooms
router.get("/:id", getRoomById);     // Get Room by ID
router.put("/:id", updateRoom);      // Update Room
router.delete("/:id", deleteRoom);   // Delete Room

router.post("/upload-rooms", upload.single("file"), async (req, res) => {
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
            no: row["no"],
            department: row["department"]
        }));

        console.log(rooms)

        await Room.insertMany(rooms);
        res.json({ message: "Rooms uploaded successfully!", rooms });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed!", error });
    }
});

module.exports = router;
