import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    CircularProgress,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
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

const Room = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [file, setFile] = useState(null);

    const [roomData, setRoomData] = useState({
        no: "",
        department: "",
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = () => {
        axios.get("http://localhost:3002/room")
            .then(response => {
                setRooms(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        setRoomData({ ...roomData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (editMode) {
            axios.put(`http://localhost:3002/room/${selectedRoomId}`, roomData)
                .then(() => {
                    fetchRooms();
                    setModalOpen(false);
                    setEditMode(false);
                })
                .catch(error => console.error("Error updating room:", error));
        } else {
            axios.post("http://localhost:3002/room", roomData)
                .then(response => {
                    setRooms([...rooms, response.data]);
                    setModalOpen(false);
                })
                .catch(error => console.error("Error adding room:", error));
        }
    };

    const handleEdit = (room) => {
        setRoomData({
            no: room.no,
            department: room.department,
        });
        setSelectedRoomId(room._id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this room?")) {
            axios.delete(`http://localhost:3002/room/${id}`)
                .then(() => {
                    fetchRooms();
                })
                .catch(error => console.error("Error deleting room:", error));
        }
    };

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
            const response = await axios.post("http://localhost:3002/room/upload-rooms", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Upload Successful!");
            fetchRooms();
            console.log(response.data);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed!");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Room Management
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 4 }}>
                Manage your faculty rooms and their assignments
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1E40AF", "&:hover": { backgroundColor: "#1E3A8A" } }}
                    onClick={() => {
                        setRoomData({ no: "", department: "" });
                        setEditMode(false);
                        setModalOpen(true);
                    }}
                >
                    + Add Room
                </Button>

                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    id="upload-file"
                />
                <label htmlFor="upload-file">
                    <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
                        Select File
                    </Button>
                </label>

                <Button
                    variant="outlined"
                    onClick={handleUpload}
                    disabled={!file}
                >
                    Upload
                </Button>
            </Box>

            {/* Room List / Table */}
            {loading ? (
                <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
            ) : rooms.length === 0 ? (
                <Typography align="center" color="text.secondary">
                    No rooms available
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Room No</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rooms.map((room) => (
                                <TableRow key={room._id}>
                                    <TableCell>{room.no}</TableCell>
                                    <TableCell>{room.department}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEdit(room)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(room._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Add/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{editMode ? "Edit Room" : "Add New Room"}</Typography>
                    <TextField
                        label="Room No"
                        name="no"
                        fullWidth
                        margin="dense"
                        value={roomData.no}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Department"
                        name="department"
                        fullWidth
                        margin="dense"
                        value={roomData.department}
                        onChange={handleInputChange}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default Room;
