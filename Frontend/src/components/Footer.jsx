import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Container, Typography } from "@mui/material";
import hcmut_logo from "../assets/HCMUT.png";

const Footer = () => {
  return (
    <Box
      // component="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // position: "sticky",
        bottom: 0,
        width: "100%",
        py: 2,
        px: 2,
        bgcolor: "white",
        color: "primary.dark",
        boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.2)",
        mt: "auto",
      }}
    >
      <Grid container direction="row" width="100%">
        <Grid
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontSize="1.1vw" fontWeight="bold">
              Address:
            </Typography>
            <Typography fontSize="0.9vw">
              Facility 1: 268 Ly Thuong Kiet, Ward 14, District 10, Ho Chi Minh City
            </Typography>
            <Typography fontSize="0.9vw">
              Facility: Tan Lap Street, Dong Hoa Ward, Di An City, Binh Duong Province
            </Typography>
          </Box>
        </Grid>
        <Grid
          size={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "4vw",
            }}
          >
            <img src={hcmut_logo} alt="HCMUT" />
          </Box>
        </Grid>
        <Grid
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box alignSelf="flex-end">
            <Typography fontSize="1.1vw" fontWeight="bold">
              Contact Technical Team:
            </Typography>

            <Typography fontSize="0.9vw">Email : ddthu@hcmut.edu.vn</Typography>
            <Typography fontSize="0.9vw">(Tel.) : (84-8) 38647256 - 5258</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
