const express = require('express')
const cors = require("cors");
const connectDB = require("./config/db");

const staffRoutes = require("./routes/staff");
const examRoutes = require("./routes/exam");
const roomRoutes = require('./routes/room');
const examAllocationRoutes = require('./routes/examAllocation');
const app = express();

app.use(cors());
app.use(express.json());





// Connect to MongoDB
connectDB();


app.post('/api/login', (req, res) => {
    console.log(req.body)
    const { identifier, password } = req.body;
    if (identifier == "admin" && password == "admin123") {
       res.status(200).send({ token: "aajjjjjjjjjjjjj" })
    } else {
        res.status(500).send('Server error');
    }
   
}

)




// API Routes
app.use("/staff", staffRoutes);
app.use("/exam", examRoutes);
app.use("/room", roomRoutes);
app.use("/exam-allocation", examAllocationRoutes);

app.listen(3002, () => {
    console.log(`application running on port 3002`)
})