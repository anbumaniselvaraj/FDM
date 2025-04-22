import React from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    CssBaseline,
    Avatar,
    Tooltip,
} from "@mui/material";
import {
    Dashboard as DashboardIcon,
    MeetingRoom as RoomIcon,
    People as StaffIcon,
    School as ExamHallIcon,
    Menu as MenuIcon,
    Login as LoginIcon,
} from "@mui/icons-material";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import Exam from "./exam";
import Room from "./room";
import Staff from "./staff";
import ExamAllocation from "./examAllocation";
import ExamAllocationNew from "./examAll";
import Login from "./sign_in"

const drawerWidth = 240;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const hideSidebar = location.pathname === "/";

    const navItems = [
        { text: "Dashboard", icon: <DashboardIcon />, route: "/" },
        { text: "Room Details", icon: <RoomIcon />, route: "/room" },
        { text: "Staff Details", icon: <StaffIcon />, route: "/staff" },
        { text: "Duty AssignChart", icon: <ExamHallIcon />, route: "/examhall" },
    ];

    return (

        <Box sx={{ display: "flex", backgroundColor: "#f8f9fa", height: "100vh" }}>
            <CssBaseline />

            {/* ✅ AppBar */}
           {hideSidebar?"": <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: "#1E293B",
                    color: "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
            >
                <Toolbar>
                    <MenuIcon sx={{ mr: 2 }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                        Faculty Duty Master
                    </Typography>
                    <Tooltip title="Sign In">
                        <IconButton color="inherit">
                            <LoginIcon />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>} 
          

            {/* ✅ Sidebar Drawer */}
            {hideSidebar ? "" :
            
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        mt: "64px",
                        backgroundColor: "#111827",
                        color: "#fff",
                        borderRight: "none",
                        boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
                    },
                }}
            >
                <List>
                    {navItems.map((item, index) => (
                        <ListItem
                            button
                            key={index}
                            onClick={() => navigate(item.route)}
                            sx={{
                                "&:hover": {
                                    backgroundColor: "#1f2937",
                                },
                                "&.Mui-selected": {
                                    backgroundColor: "#374151",
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Drawer>}


            {/* ✅ Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    mt: "64px",
                    minHeight: "100vh",
                    backgroundColor: "#F3F4F6",
                }}
            >
                <Routes>
                    {/* <Route path="/exam" element={<Exam />} /> */}
                    <Route path="/" element={<Login />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/staff" element={<Staff />} />
                    <Route path="/examallocation" element={<ExamAllocation />} />
                    <Route path="/examhall" element={<ExamAllocationNew />} />
                </Routes>
            </Box>
        </Box>
    );
};

export default Sidebar;
