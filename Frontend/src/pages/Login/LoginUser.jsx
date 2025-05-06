import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Footer from "../../components/Footer";
import Box from "@mui/material/Box";
import { Button, Divider, TextField, Typography } from "@mui/material";
import bg from "../../assets/bg.png";
import hcmut_logo from "../../assets/HCMUT.png";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

export default function LoginUser() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const comeTo = location.state?.from?.pathname || "/";
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle login logic here
    try {
      const result = await login(username, password, "Student");

      console.log("Inside handleSubmit, result: ", result);
      if (result.success) {
        console.log("Token after login:", localStorage.getItem("token"));
        console.log(
          "Auth header:",
          api.defaults.headers.common["Authorization"]
        );
        navigate(comeTo, { replace: true });
      }
    } catch (error) {
      console.error("Login failed: ", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
      <Box
        sx={{
          position: "relative",
          width: {
            xs: "90vw",
            sm: "80vw",
            md: "50vw",
            lg: "30vw",
            xl: "30vw",
          },
          height: "70vh",
          backgroundColor: "#fff",
          padding: "30px",
          boxShadow: "0px 0px 30px rgba(0, 0, 0, 0.15)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "22px",
        }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "30%",
            flexGrow: 1,
          }}>
          <img src={hcmut_logo} alt="HCMUT LOGO" style={{ height: "100%" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexGrow: 2,
          }}>
          <Typography
            color="primary.dark"
            textAlign="center"
            fontSize="18px"
            fontWeight="bold">
            Đăng nhập tài khoản HCMUT
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            flexGrow: 3,
            flexWrap: "wrap",
          }}>
          <TextField
            label="Tài khoản"
            variant="outlined"
            fullWidth
            value={username}
            sx={{
              // marginBottom: "2%",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                // height: "3.5vw",
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                // fontSize: "1vw",
                alignItems: "center",
              },
            }}
            onChange={handleUsernameChange}
          />
          <TextField
            label="Mật khẩu"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            sx={{
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                // height: "3.5vw",
                borderRadius: "10px",
              },
              "& .MuiInputLabel-root": {
                // fontSize: "1vw",
                alignItems: "center",
              },
            }}
            onChange={handlePasswordChange}
          />
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexFlow: "row wrap",
            flexGrow: 4,
          }}>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              backgroundColor: "primary.main",
              color: "white",
              width: "48%",
              height: "50%",
              fontSize: "14px", //14px
              fontWeight: "bold",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            }}
            onClick={() => {
              navigate("/login");
            }}>
            Trở về
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary.main"
            sx={{
              textTransform: "none",
              backgroundColor: "primary.main",
              color: "white",
              width: "48%",
              height: "50%",
              fontSize: "14px",
              fontWeight: "bold",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            }}>
            Đăng nhập
          </Button>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
