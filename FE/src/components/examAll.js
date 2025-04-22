import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    MenuItem, Select, FormControl, InputLabel, Typography, TextField, Modal, Box, Checkbox
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import Select, { SelectChangeEvent } from '@mui/material/Select';

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

const ExamAllocationNew = () => {
    useEffect(() => {
        fetchStaff()
    })
    const [selectedDepartment, setSelectedDepartment] = useState('Select');
    const [selectedStaff, setSelectedStaff] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen1, setModalOpen1] = useState(false);
    const [examDetail, setExamDetail] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [staffDepartment, setStaffDepartment] = useState([]);
    const [staff, setStaff] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [list, setList] = useState([]);
    const [columns, setColumns] = useState([
        // {examDate: '', session: '', roomNo: ''}
    ]);
    const [checked, setChecked] = useState({});

    const fetchStaff = async () => {
        await axios.get("http://localhost:3002/staff")
            .then(response => {

                setList(response.data)
                setStaff(
                    [...new Set(response.data.map((e) => e.dept))].map((dept) => ({ name: dept }))
                );

            })
            .catch(error => {
                console.error("Error fetching staff:", error);
            });
    };

    const exportToExcel =() => {
        const data = staffList.map((row, rowIndex) => {
            const rowData = {
                "S.No": rowIndex + 1,
                Name: row.name,
                Dept: row.dept,
                Email: row.email,
                "Duty For Faculty": columns.filter((col) => checked[`${rowIndex}-${col}`]).length,

            };
            columns.forEach(col => {
                rowData[col] = checked[`${rowIndex}-${col}`] ? "✔️" : "";
            });
            return rowData;
        });

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Duty Allocation");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, "duty_allocation.xlsx");
        sendMail(data,columns)

    };

    const sendMail = async (data,columns) => {

        try {
            const response = await axios.post(`http://localhost:3002/exam-allocation/sendmail`, {data,columns });
            setColumns([])
            setList([])
            return response.data;
        } catch (error) {
            console.error("Error saving exam allocation:", error);
            return null;
        }

    }

    const addColumn = () => {

        // setColumns([...columns, `${examDetail.examDate}  ${examDetail.session} ${examDetail.roomNo}`]);

        const newEntry = `${examDetail.examDate}  ${examDetail.session || `FN`} ${examDetail.roomNo}`;

        setColumns((prevColumns) => {
            if (!prevColumns.includes(newEntry)) {
                return [...prevColumns, newEntry];
            }
            return prevColumns;
        });

        setModalOpen(false)

    };

    const ImportStff = () => {

        // setStaffList(list.filter(e => e.dept == selectedDepartment))
        setModalOpen1(false)
    }

    const handleCheck = (rowIndex, columnKey) => {
        const key = `${rowIndex}-${columnKey}`;
        setChecked((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const [rows, setRows] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const formattedData = jsonData.map(e => ({
                name: e.Name + ',' + e.Category,
                dept: e.Department,
                email: e.Email
            }));

            setStaffList(formattedData);

            setRows(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const generateRandomCheckboxes = () => {
        let newChecked = {};

        columns.forEach((col) => {
            const parts = col.split(" ");
            const dutyCount = parseInt(parts[3]);
            if (isNaN(dutyCount)) return;

            const aspList = staffList
                .map((staff, index) => ({ ...staff, index }))
                .filter((s) => s.name.includes("ASP"));
            const apList = staffList
                .map((staff, index) => ({ ...staff, index }))
                .filter((s) => s.name.includes("AP") && !s.name.includes("ASP"));

            const aspCount = Math.round((3 / 7) * dutyCount);
            const apCount = dutyCount - aspCount;

            const getRandomIndexes = (list, count) => {
                const copy = [...list];
                const selected = [];
                while (selected.length < count && copy.length > 0) {
                    const rand = Math.floor(Math.random() * copy.length);
                    selected.push(copy[rand].index);
                    copy.splice(rand, 1);
                }
                return selected;
            };

            const aspIndexes = getRandomIndexes(aspList, aspCount);
            const apIndexes = getRandomIndexes(apList, apCount);

            [...aspIndexes, ...apIndexes].forEach((rowIndex) => {
                const key = `${rowIndex}-${col}`;
                newChecked[key] = true;
            });
        });

        setChecked(newChecked);
    };




    return (
        <div>
            <Typography variant="h5" sx={{ mb: 2 }}>Room & Staff Allocation New</Typography>
            <Button
                variant="contained"
                sx={{ backgroundColor: "#FF6B6B", "&:hover": { backgroundColor: "#E63946" }, mb: 2 }}
                onClick={() => setModalOpen(true)}
            >
                Add Column
            </Button> &nbsp;&nbsp;&nbsp;



            <Button variant="contained" component="label" sx={{ mb: 2 }}>
                Import Staff Excel
                <input type="file" hidden onChange={handleFileUpload} accept=".xlsx, .xls" />
            </Button> &nbsp;&nbsp;&nbsp;
            <Button variant="contained" onClick={generateRandomCheckboxes} sx={{ mb: 2 }}>
                Auto Assign Duties
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" color="success" onClick={exportToExcel} sx={{ mb: 2 }}>
                Export to Excel
            </Button>

            <TableContainer component={Paper} sx={{ maxWidth: 1200, minHeight: 500, overflowX: "auto" }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ minWidth: 100, fontWeight: "bold" }}>S.No</TableCell>
                            <TableCell sx={{ minWidth: 150, fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ minWidth: 100, fontWeight: "bold" }}>Dept</TableCell>
                            <TableCell sx={{ minWidth: 100, fontWeight: "bold" }}><strong>Duty For Faculty</strong></TableCell>
                            {columns.map((value, index) => (
                                <TableCell
                                    key={index}
                                    sx={{ minWidth: 80, fontWeight: "bold", whiteSpace: "nowrap" }}
                                >
                                    {value}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {staffList.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                <TableCell>{rowIndex + 1}</TableCell> {/* S.No */}
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.dept}</TableCell>
                                <TableCell>{columns.filter((col) => checked[`${rowIndex}-${col}`]).length}</TableCell>
                                {columns.map((col, colIndex) => {
                                    const key = `${rowIndex}-${col}`;
                                    return (
                                        <TableCell key={colIndex}>
                                            <Checkbox
                                                checked={checked[key] || false}
                                                onChange={() => handleCheck(rowIndex, col)}
                                            />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>


                    {/* Example TableBody goes here */}
                </Table>
            </TableContainer>


            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>{editMode ? "Edit Room" : "Add Exam Date & Hall"}</Typography>

                    <TextField type="date" onChange={(e) => setExamDetail({ ...examDetail, examDate: e.target.value })} name="no" fullWidth margin="dense" />
                    <br></br>
                    <Select defaultValue="FN" onChange={(e) => setExamDetail({ ...examDetail, session: e.target.value || 'FN' })} fullWidth>
                        <MenuItem value="FN">FN</MenuItem>
                        <MenuItem value="AN">AN</MenuItem>
                    </Select>
                    <br></br>
                    <TextField type="text" label="No Of Room Required" name="no" onChange={(e) => setExamDetail({ ...examDetail, roomNo: e.target.value })} fullWidth margin="dense" />


                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setModalOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={addColumn} variant="contained" color="primary">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={modalOpen1} onClose={() => setModalOpen(false)}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Import Staff</Typography>

                    <InputLabel>Select Department</InputLabel>
                    <Select
                        value={selectedDepartment}
                        label="Select Department"
                        onChange={(e) => {
                            setSelectedDepartment(e.target.value)
                            setStaffDepartment(staff.filter((ele) => ele.dept == e.target.value))
                        }}
                    >
                        <MenuItem value="Select">Select</MenuItem>
                        {staff.map((person) => (
                            <MenuItem key={person._id} value={person.name}>
                                {person.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <InputLabel>Select Staff</InputLabel>
                    <Select
                        multiple
                        value={selectedStaff}
                        label="Select Staff"
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        renderValue={(selected) => selected.join(", ")}
                    >
                        {staffDepartment.map((person) => (
                            <MenuItem key={person._id} value={person.name}>
                                <Checkbox checked={selectedStaff.indexOf(person.name) > -1} />
                                {person.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button onClick={() => setModalOpen1(false)} sx={{ mr: 1 }}>Cancel</Button>
                        <Button onClick={ImportStff} variant="contained" color="primary">
                            Import
                        </Button>
                    </Box>
                </Box>
            </Modal>


            {/* Show Table if `no_of_rooms` is greater than 0 */}

        </div>

    );
};

export default ExamAllocationNew;


{/* Dynamic Columns */ }
{/* {columns.map((_, index) => (
                                <TableCell key={index} style={{ width: '260px', padding: '8px' }}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <TextField
                                            type="date"
                                            name={`date-${index}`}
                                            margin="dense"
                                            style={{ width: '150px' }}
                                        />
                                        <Select
                                            labelId={`select-label-${index}`}
                                            id={`select-${index}`}
                                            defaultValue=""
                                            style={{ width: '80px', height: '40px' }}
                                        >
                                            <MenuItem value="FN">FN</MenuItem>
                                            <MenuItem value="AN">AN</MenuItem>
                                        </Select>
                                    </div>
                                </TableCell>
                            ))} */}
