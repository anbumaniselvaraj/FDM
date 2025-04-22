import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Modal, Box, TextField, Typography, CircularProgress, IconButton
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
};

const Exam = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedExamId, setSelectedExamId] = useState(null);

    const [examData, setExamData] = useState({
        name: "",
        time: "",
        date: "",
        no_of_rooms: "",
    });

    // ✅ Fetch exams from API
    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = () => {
        axios.get("http://localhost:3002/exam")
            .then(response => {
                console.log(`loading:${loading}`)
                console.log(`data:${JSON.stringify(response.data.exams)}`)
                setExams(response.data.exams);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exams:", error);
                setLoading(false);
            });
    };

    // ✅ Handle input changes
    const handleInputChange = (e) => {
        setExamData({ ...examData, [e.target.name]: e.target.value });
    };

    // ✅ Handle Add/Edit Exam API Call
    const handleSubmit = () => {
        if (editMode) {
            axios.put(`http://localhost:3002/exam/${selectedExamId}`, examData)
                .then(() => {
                    fetchExams();
                    setModalOpen(false);
                    setEditMode(false);
                })
                .catch(error => console.error("Error updating exam:", error));
        } else {
            axios.post("http://localhost:3002/exam", examData)
                .then(response => {
                    setExams([...exams, response.data]); // Update list
                    setModalOpen(false);
                })
                .catch(error => console.error("Error adding exam:", error));
        }
    };

    // ✅ Open Edit Modal with existing exam data
    const handleEdit = (exam) => {
        setExamData({
            name: exam.name,
            time: exam.time,
            date: exam.date.split("T")[0], // Format date for input
            no_of_rooms: exam.no_of_rooms,
        });
        setSelectedExamId(exam._id);
        setEditMode(true);
        setModalOpen(true);
    };

    // ✅ Handle Delete Exam API Call
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this exam?")) {
            axios.delete(`http://localhost:3002/exam/${id}`)
                .then(() => {
                    fetchExams();
                })
                .catch(error => console.error("Error deleting exam:", error));
        }
    };

    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an Excel file!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://localhost:3002/exam/upload-exams", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Upload Successful!");
            fetchExams();
            console.log(response.data);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed!");
        }
    };

    return (
        <div>
            {/* ✅ "Add Exam" button opens the Modal */}
            <div className="row">
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#FF6B6B", "&:hover": { backgroundColor: "#E63946" }, mb: 2 }}
                    onClick={() => {
                        setExamData({ name: "", time: "", date: "", no_of_rooms: "" });
                        setEditMode(false);
                        setModalOpen(true);
                    }}
                >
                    Add Exam
                </Button>
                &nbsp; &nbsp; &nbsp;

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="upload-file"
                    
                />
                <label htmlFor="upload-file" >
                    <Button variant="contained" sx={{ mb: 2 }} component="span" startIcon={<CloudUploadIcon />}>
                        Select File
                    </Button>
                </label> &nbsp; 

                {/* {file && <Typography variant="subtitle2" sx={{ mb: 2 }}>{file.name}</Typography>} */}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    sx={{ mb: 2 }}
                    disabled={!file}
                >
                    Upload
                </Button>

            </div>








            {/* ✅ Show Loading Indicator */}
            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : (
                <TableContainer component={Paper} sx={{ margin: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Time</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>No. of Rooms</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            {exams.length ? exams.map((exam) => (
                                <TableRow key={exam._id}>
                                    <TableCell>{exam.name}</TableCell>
                                    <TableCell>{exam.time}</TableCell>
                                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{exam.no_of_rooms}</TableCell>
                                    <TableCell>
                                        {/* Edit Button */}
                                        <IconButton color="primary" onClick={() => handleEdit(exam)}>
                                            <Edit />
                                        </IconButton>
                                        {/* Delete Button */}
                                        <IconButton color="error" onClick={() => handleDelete(exam._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No Exams Found
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ✅ Add/Edit Exam Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{editMode ? "Edit Exam" : "Add New Exam"}</Typography>
                    <TextField label="Name" name="name" fullWidth margin="dense" value={examData.name} onChange={handleInputChange} />
                    <TextField label="Time" name="time" fullWidth margin="dense" value={examData.time} onChange={handleInputChange} />
                    <TextField type="date" name="date" fullWidth margin="dense" value={examData.date} onChange={handleInputChange} />
                    <TextField label="No. of Rooms" name="no_of_rooms" fullWidth margin="dense" value={examData.no_of_rooms} onChange={handleInputChange} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
};

export default Exam;
