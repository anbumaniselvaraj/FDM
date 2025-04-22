import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Modal, Box, TextField, Typography, CircularProgress, IconButton, MenuItem, Select, FormControl, InputLabel
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

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

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [file, setFile] = useState(null);

    const [staffData, setStaffData] = useState({
        name: "", dept: "", email: "", mobile: "", empno: "", category: ""
    });

    useEffect(() => { fetchStaff(); }, []);

    const fetchStaff = () => {
        axios.get("http://localhost:3002/staff")
            .then(response => {
                setStaff(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching staff:", error);
                setLoading(false);
            });
    };

    const handleInputChange = (e) => {
        setStaffData({ ...staffData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (editMode) {
            axios.put(`http://localhost:3002/staff/${selectedStaffId}`, staffData)
                .then(() => {
                    fetchStaff();
                    setModalOpen(false);
                    setEditMode(false);
                })
                .catch(error => console.error("Error updating staff:", error));
        } else {
            axios.post("http://localhost:3002/staff", staffData)
                .then(response => {
                    setStaff([...staff, response.data]);
                    setModalOpen(false);
                })
                .catch(error => console.error("Error adding staff:", error));
        }
    };

    const handleEdit = (staff) => {
        setStaffData({
            name: staff.name,
            dept: staff.dept,
            email: staff.email,
            mobile: staff.mobile,
            empno: staff.empno,
            category: staff.category,
        });
        setSelectedStaffId(staff._id);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            axios.delete(`http://localhost:3002/staff/${id}`)
                .then(() => fetchStaff())
                .catch(error => console.error("Error deleting staff:", error));
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an Excel file!");
        const formData = new FormData();
        formData.append("file", file);
        try {
            await axios.post("http://localhost:3002/staff/upload-staff", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Upload Successful!");
            fetchStaff();
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed!");
        }
    };

    return (
        <Box sx={{ px: 4, py: 2 }}>
            {/* ✅ Header Section */}
            <Typography variant="h5" fontWeight="bold" mb={0.5}>Staff Management</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
                Manage your staff members and their information
            </Typography>

            {/* ✅ Buttons Row */}
            <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: "#2563eb", textTransform: "none" }}
                    onClick={() => {
                        setStaffData({ name: "", dept: "", email: "", mobile: "", empno: "", category: "" });
                        setEditMode(false);
                        setModalOpen(true);
                    }}
                >
                    Add Staff
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
                    sx={{ textTransform: "none" }}
                >
                    Upload
                </Button>
            </Box>

            {/* ✅ Table / No Staff */}
            {loading ? (
                <CircularProgress sx={{ mt: 4 }} />
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: "8px" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell><strong>Employee No</strong></TableCell>
                                <TableCell><strong>Category</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(staff) && staff.length > 0 ? (
                                staff.map((s) => (
                                    <TableRow key={s._id}>
                                        <TableCell>{s.name}</TableCell>
                                        <TableCell>{s.dept}</TableCell>
                                        <TableCell>{s.email}</TableCell>
                                        <TableCell>{s.mobile}</TableCell>
                                        <TableCell>{s.empno}</TableCell>
                                        <TableCell>{s.category}</TableCell>
                                        <TableCell>
                                            <IconButton color="primary" onClick={() => handleEdit(s)}><Edit /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(s._id)}><Delete /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6, color: "gray" }}>
                                        <Typography variant="h6" fontWeight="medium" color="text.secondary">
                                            No Staff Found
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Add staff members to see them listed here.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* ✅ Add/Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{editMode ? "Edit Staff" : "Add New Staff"}</Typography>
                    <TextField label="Name" name="name" fullWidth margin="dense" value={staffData.name} onChange={handleInputChange} />
                    <TextField label="Department" name="dept" fullWidth margin="dense" value={staffData.dept} onChange={handleInputChange} />
                    <TextField label="Email" name="email" fullWidth margin="dense" value={staffData.email} onChange={handleInputChange} />
                    <TextField label="Mobile" name="mobile" fullWidth margin="dense" value={staffData.mobile} onChange={handleInputChange} />
                    <TextField label="Employee No" name="empno" fullWidth margin="dense" value={staffData.empno} onChange={handleInputChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select name="category" value={staffData.category} onChange={handleInputChange}>
                            <MenuItem value="Assistant Professor">Assistant Professor</MenuItem>
                            <MenuItem value="Associate Professor">Associate Professor</MenuItem>
                        </Select>
                    </FormControl>
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

export default Staff;
