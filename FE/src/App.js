import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import Exam from "./components/exam";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Sidebar from "./components/sidebar";
import Login from "./components/sign_in";
import Dashboard from "./components/dashboard";
import MainLayout from "./components/main_layout";

function App() {



  const [drawerOpen, setDrawerOpen] = useState(false); // State for side navigation
  const [dialogOpen, setDialogOpen] = useState(false); // State for Add Exam dialog
  const [newExam, setNewExam] = useState({
    name: "",
    time: "",
    date: "",
    no_of_rooms: "",
  });



  return (
    <div>
    
      <BrowserRouter>
        <Sidebar></Sidebar>
      </BrowserRouter>



      {/* Side Navigation Drawer */}




    </div>
  )


}

export default App;
