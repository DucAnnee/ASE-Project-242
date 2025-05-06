import React from "react";
import { useNavigate } from "react-router";
import Footer from "../../components/Footer";
import Box from "@mui/material/Box";
import { Button, Divider, Typography } from "@mui/material";
import bg from "../../assets/bg.png";
import hcmut_logo from "../../assets/HCMUT.png";
export default function Login() {
  const navigate = useNavigate();
  
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
            height: "40%",
            my: 2,
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
            height: "15%",
            flexGrow: 2,
          }}>
          <Typography
            color="primary.dark"
            textAlign="center"
            fontSize="16px"
            fontWeight="bold">
            Lựa chọn phương thức đăng nhập
          </Typography>
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "30%",
            marginTop: 2,
            flexGrow: 3,
            flexWrap: "wrap",
          }}>
          <Button
            variant="contained"
            color="white"
            sx={{
              textTransform: "none",
              width: "100%",
              height: "40%",
              color: "primary.dark",
              fontSize: "14px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            }}
            onClick={() => navigate("/login-user")}>
            {" "}
            Tài khoản HCMUT (@hcmut.edu.vn)
          </Button>
          <Button
            variant="contained"
            color="white"
            sx={{
              textTransform: "none",
              width: "100%",
              height: "40%",
              color: "primary.dark",
              fontSize: "14px",
              boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
            }}
            onClick={() => navigate("/login-admin")}>
            Admin
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "10%",
          }}></Box>
      </Box>
      <Footer />
    </Box>
  );
}
