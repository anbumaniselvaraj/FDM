const express = require("express");
const nodemailer = require('nodemailer');
const router = express.Router();
const ExamAllocation = require("../models/ExamAllocation");
const Exam = require("../models/exam");
const Staff = require("../models/staff");
const Room = require("../models/room");
const twilio = require("twilio");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anbumaniselvaraj123@gmail.com', // Use environment variable
        pass: 'morbojlgstgumtvf', // Use environment variable
    },
});

const accountSid = `ACf37875e3d640fab563a1f045c8292db9`;
const authToken = `68088e69a435578bd64cd1a40ebf5477`;
const client = new twilio(accountSid, authToken);



function sendMail(to, sub, msg) {
    const mailOptions = {
        from: 'anbumaniselvaraj123@gmail.com',
        to: to,
        subject: sub,
        html: msg,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
}

// ✅ Save Exam Allocation
router.post("/", async (req, res) => {
    try {
        const { examId, allocations } = req.body;
        const staffRoomsDetails = [];

        // Fetch exam details
        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ message: "Exam not found" });

        // Validate each allocation entry
        for (const alloc of allocations) {
            const staff = await Staff.findById(alloc.staffId);
            const room = await Room.findById(alloc.roomId);

            if (!staff || !room) {
                return res.status(400).json({ message: "Invalid staff or room assignment" });
            }
            staffRoomsDetails.push({ mobileNo: staff.mobile, staffMail: staff.email, staffName: staff.name, roomNo: room.no, department: room.department, time: exam.time, date: exam.date })
        }

        // Create & Save Allocation
        const examAllocation = new ExamAllocation({
            examName: exam.name,
            examId,
            allocations
        });

        await examAllocation.save();


        staffRoomsDetails.forEach((e) => {


            client.messages.create({
                body: `Exam duty for You have been assigned on 🗓️${e.date} 📌Room No: ${e.roomNo}📚 Department:${e.department} ⏰ Time:${e.time || "10:00 AM"}`,
                from: 'whatsapp:+14155238886',
                to: `whatsapp:+91${e.mobileNo}`
            });


            sendMail(
                e.staffMail,
                `Exam Duty Assignment on ${e.date} `,
                `
                    <p>Dear ${e.staffName},</p>
                    <p>You have been assigned to Exam Duty on ${e.date}.</p>
                    <ul>
                       
                        <li>📌 <strong>Room No:</strong> ${e.roomNo}</li>
                        <li>📚 <strong>Department:</strong> ${e.department}</li>
                        <li>⏰ <strong>Time:</strong> ${e.time || "10:00 AM"}</li>
                        <li>🗓️ <strong>Date:</strong> ${e.date}</li>
                    </ul> 
                    <p>Please report on time.</p>
                    <p>Best Regards, <br> <strong>Exam Coordinator</strong></p>
                `
            )
        })




        res.json({ message: "Exam allocation saved successfully!", examAllocation });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get Allocations for a Specific Exam
router.get("/:examId", async (req, res) => {
    try {
        const allocations = await ExamAllocation.findOne({ examId: req.params.examId });

        if (!allocations) {
            return res.status(404).json({ message: "No allocations found for this exam" });
        }

        res.json(allocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get All Allocations
router.get("/", async (req, res) => {
    try {
        const allAllocations = await ExamAllocation.find();
        res.json(allAllocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/sendmail', async (req, res) => {
    const { data, columns } = req.body;
    console.log(data, columns)


    try {

        columns.forEach(column => {
            const staffRoomsDetails = data.filter(item => item[column] === '✔️');
            const examDetails=column.split(' ')
            staffRoomsDetails.forEach(e => {

                sendMail(
                    e.Email,
                    `Exam Duty Assignment on ${examDetails[0]} `,
                    `
            <p>Dear ${e.Name},</p>
            <p>You have been assigned to Exam Duty on ${examDetails[0]}.</p>
            <ul>

               
                <li>📚 <strong>Department:</strong> ${e.Dept}</li>
                <li>⏰ <strong>Time:</strong> ${examDetails[1]=='FN'?"10:00 AM to 01:00 PM" : "02:00 PM to 06:00 PM"}</li>
                <li>🗓️ <strong>Date:</strong> ${examDetails[0]}</li>
            </ul> 
            <p>Please report on time.</p>
            <p>Best Regards, <br> <strong>Exam Coordinator</strong></p>
        `
                )

            })
        })

        res.json({ message: "Exam allocation saved successfully!" });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }



})

module.exports = router;
