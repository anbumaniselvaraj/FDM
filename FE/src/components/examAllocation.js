import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    MenuItem, Select, FormControl, InputLabel, Typography, Grid
} from "@mui/material";

const ExamAllocation = () => {
    const [exams, setExams] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [staff, setStaff] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [noOfRooms, setNoOfRooms] = useState(0);
    const [allocations, setAllocations] = useState([]);
    const [aspCount, setAspCount] = useState(0);
    const [apCount, setApCount] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3002/exam")
            .then(response => setExams(response.data.exams))
            .catch(error => console.error("Error fetching exams:", error));
    }, []);

    useEffect(() => {
        axios.get("http://localhost:3002/room")
            .then(response => setRooms(response.data))
            .catch(error => console.error("Error fetching rooms:", error));

        axios.get("http://localhost:3002/staff")
            .then(response => setStaff(response.data))
            .catch(error => console.error("Error fetching staff:", error));
    }, []);

    // When exam changes, auto-populate room & staff
    const handleExamChange = async (event) => {
        const examId = event.target.value;
        setSelectedExam(examId);

        try {
            const examResponse = await axios.get(`http://localhost:3002/exam/${examId}`);
            const { no_of_rooms } = examResponse.data;
            setNoOfRooms(no_of_rooms);

            autoPopulateAllocation(no_of_rooms);
        } catch (error) {
            console.error("Error fetching exam details:", error);
        }
    };

    const autoPopulateAllocation = (no_of_rooms) => {
        let shuffledRooms = [...rooms].sort(() => Math.random() - 0.5).slice(0, no_of_rooms);
        let shuffledStaff = [...staff].sort(() => Math.random() - 0.5);

        let aspStaff = shuffledStaff.filter(s => s.category === "Associate Professor").slice(0, Math.ceil(no_of_rooms * (3 / 7)));
        let apStaff = shuffledStaff.filter(s => s.category === "Assistant Professor").slice(0, Math.floor(no_of_rooms * (4 / 7)));

        let finalAllocations = [];
        let aspIndex = 0, apIndex = 0;

        for (let i = 0; i < no_of_rooms; i++) {
            let assignedStaff = aspIndex < aspStaff.length ? aspStaff[aspIndex++] : apStaff[apIndex++];
            finalAllocations.push({
                room: shuffledRooms[i]?.no || "",
                roomNo: shuffledRooms[i]?.no || "",
                roomId: shuffledRooms[i]?._id || "",
                staff: assignedStaff?.name || "",
                staffName: assignedStaff?.name || "",
                staffId: assignedStaff?._id || ""
            });
        }

        setAllocations(finalAllocations);
        setAspCount(aspStaff.length);
        setApCount(apStaff.length);
    };

    // Handle manual room selection
    const handleRoomChange = (index, value) => {
        const room = rooms.find((r) => r.no === value);
        let updatedAllocations = [...allocations];
        updatedAllocations[index] = { ...updatedAllocations[index], room: value, roomNo: value, roomId: room._id };
        setAllocations(updatedAllocations);
    };

    // Handle manual staff selection
    const handleStaffChange = (index, value) => {
        const staffMember = staff.find((s) => s.name === value);
        let updatedAllocations = [...allocations];
        updatedAllocations[index] = { ...updatedAllocations[index], staff: value, staffName: value, staffId: staffMember._id };
        setAllocations(updatedAllocations);

        // Update ASP & AP count dynamically
        const asp = updatedAllocations.filter(a => staff.find(s => s.name === a.staff)?.category === "Associate Professor").length;
        const ap = updatedAllocations.filter(a => staff.find(s => s.name === a.staff)?.category === "Assistant Professor").length;
        setAspCount(asp);
        setApCount(ap);
    };

        // ✅ Save Exam Allocation
        const saveExamAllocation = async (examId, allocations) => {
            alert(JSON.stringify(allocations))
    
            try {
                const response = await axios.post(`http://localhost:3002/exam-allocation`, { examId, allocations });
                return response.data;
            } catch (error) {
                console.error("Error saving exam allocation:", error);
                return null;
            }
        };
    
        const handleSaveAllocations = async () => {
            const response = await saveExamAllocation(selectedExam, allocations);
            if (response) {
                alert("Exam allocation saved successfully!");
            } else {
                alert("Error saving allocation.");
            }
        };

    return (
        <div>
            <Typography variant="h5" sx={{ mb: 2 }}>Room & Staff Allocation</Typography>

            {/* Exam Dropdown & ASP/AP Count */}
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <FormControl sx={{ minWidth: 300 }}>
                        <InputLabel>Select Exam</InputLabel>
                        <Select value={selectedExam} onChange={handleExamChange}>
                            {exams.map((exam) => (
                                <MenuItem key={exam._id} value={exam._id}>{exam.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">ASP: {aspCount} | AP: {apCount}</Typography>
                </Grid>
            </Grid>

            {/* Show Table if `no_of_rooms` is greater than 0 */}
            {noOfRooms > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, maxHeight: 400, overflowY: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Room No</strong></TableCell>
                                <TableCell><strong>Assigned Staff</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {allocations.map((alloc, index) => (
                                <TableRow key={index}>
                                    {/* Room Dropdown */}
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <InputLabel>Select Room</InputLabel>
                                            <Select
                                                value={alloc.room}
                                                onChange={(e) => handleRoomChange(index, e.target.value)}
                                            >
                                                {rooms.map((room) => (
                                                    <MenuItem key={room._id} value={room.no}>
                                                        {room.no} ({room.department})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>

                                    {/* Staff Dropdown */}
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <InputLabel>Select Staff</InputLabel>
                                            <Select
                                                value={alloc.staff}
                                                onChange={(e) => handleStaffChange(index, e.target.value)}
                                            >
                                                {staff.map((s) => (
                                                    <MenuItem key={s._id} value={s.name}>
                                                        {s.name} ({s.category})
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Save Button */}
            {noOfRooms > 0 && (
                <Button variant="contained" color="primary" sx={{ mt: 2 }}  onClick={handleSaveAllocations}>
                    Save Allocation
                </Button>
            )}
        </div>
    );
};

export default ExamAllocation;
