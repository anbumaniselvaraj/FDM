import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Paper,
    Link,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { AccountCircle, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ identifier: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3002/api/login", credentials);
            localStorage.setItem("token", res.data.token);
            alert("Login Successful");
            navigate("/dashboard");
        } catch (err) {
            alert("Login Failed");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box
            sx={{
                background: "linear-gradient(to right, #f1f5f9, #e2e8f0)",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        borderRadius: "20px",
                        textAlign: "center",
                        boxShadow: "0px 10px 40px rgba(0,0,0,0.08)",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            color: "#00008B",
                            mb: 0.5,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                        }}
                    >
                        SONA COLLEGE OF TECHNOLOGY
                    </Typography>
                    {/* <Typography
            variant="body2"
            sx={{ fontStyle: "italic", color: "#4c51bf", mb: 2 }}
          >
            Ready for assigning duty
          </Typography>  */}
                    <Typography variant="h6" sx={{ fontWeight: 600, mt: 1 }}>
                        Faculty Duty Master
                    </Typography>
                    <Typography variant="body2" sx={{ color: "gray", mb: 3 }}>
                        Please sign in to access your account
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} noValidate>
                        <Typography variant="body1" align="left" sx={{ fontWeight: 500 }}>
                            Welcome back
                        </Typography>

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="identifier"
                            label="Username"
                            name="identifier"
                            autoComplete="identifier"
                            autoFocus
                            value={credentials.identifier}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={credentials.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: "#0d47a1", // dark blue
                                "&:hover": { backgroundColor: "#00004B" }, // slightly darker on hover
                                fontWeight: 600,
                                textTransform: "uppercase",
                                borderRadius: 2,
                                py: 1.5,
                            }}
                        >
                            SIGN IN →
                        </Button>

                    </Box>

                    <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
                        Protected by Faculty Duty Master
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                        Need help?{" "}
                        <Link href="#" underline="hover">
                            Contact support
                        </Link>
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}
