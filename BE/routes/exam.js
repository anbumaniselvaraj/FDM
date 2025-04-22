const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const {
    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam,
} = require("../controller/examController");

const Exam = require("../models/exam");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", createExam);       // Create Exam
router.get("/", getExams);          // Get All Exams
router.get("/:id", getExamById);     // Get Exam by ID
router.put("/:id", updateExam);      // Update Exam
router.delete("/:id", deleteExam);   // Delete Exam



function convertDecimalToTimeAMPM(decimalTime) {
    // 1. Convert decimal time to hours
    let totalHours = decimalTime * 24;
    let hours = Math.floor(totalHours);

    // 2. Get remaining minutes
    let minutes = Math.round((totalHours - hours) * 60);

    // 3. Determine AM or PM
    let period = hours >= 12 ? "PM" : "AM";

    // 4. Convert to 12-hour format
    hours = hours % 12 || 12; // Converts 0 to 12 for AM format

    // 5. Format time with leading zeroes
    let formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;

    return formattedTime;
}

function convertExcelDate(serial) {
    // Excel date starts from 1900-01-01
    let excelStartDate = new Date(1900, 0, 1);

    // Add the serial number as days (Excel considers 1900-01-01 as day 1, so subtract 1)
    let convertedDate = new Date(excelStartDate.getTime() + (serial - 1) * 86400000);

    // Format to YYYY-MM-DD
    let formattedDate = convertedDate.toISOString().split('T')[0];

    return formattedDate;
}


// Example Usage
// let timeDecimal = 0.4166666666666667;
// console.log(convertDecimalToTime(timeDecimal)); // Output: "10:00"



router.post("/upload-exams", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    try {
        // ✅ Read Excel File
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        console.log(data)

        // ✅ Validate & Insert Data into MongoDB
        const exams = data.map(row => ({
            name: row["name"],
            time: convertDecimalToTimeAMPM(row["time"]),
            date: convertExcelDate(row["date"]),
            no_of_rooms: parseInt(row["no_of_rooms"], 10)
        }));

        console.log(exams)

        await Exam.insertMany(exams);
        res.json({ message: "Exams uploaded successfully!", exams });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Upload failed!", error });
    }
});

module.exports = router;
