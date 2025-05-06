import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Container, Typography } from "@mui/material";
import hcmut_logo from "../assets/HCMUT.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        bottom: 0,
        width: "100%",
        py: 2,
        px: 2,
        bgcolor: "white",
        color: "primary.dark",
        boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.2)",
        mt: "auto",
      }}>
      <Grid container direction="row" width="100%">
        <Grid
          item
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Box>
            <Typography fontSize="1.1vw" fontWeight="bold">
              Địa chỉ:
            </Typography>
            <Typography fontSize="0.9vw">
              CS1: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM
            </Typography>
            <Typography fontSize="0.9vw">
              CS2: Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          size={4}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Box
            sx={{
              width: "4vw",
            }}>
            <img src={hcmut_logo} alt="HCMUT" />
          </Box>
        </Grid>
        <Grid
          item
          size={4}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            alignItems: "center",
          }}>
          <Box alignSelf="flex-end">
            <Typography fontSize="1.1vw" fontWeight="bold">
              Liên hệ Tổ kỹ thuật:
            </Typography>

            <Typography fontSize="0.9vw">Email : ddthu@hcmut.edu.vn</Typography>
            <Typography fontSize="0.9vw">
              ĐT (Tel.) : (84-8) 38647256 - 5258
            </Typography>
          </Box>
        </Grid>
      </Grid>
      {/* <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Box>
            <Typography fontSize="1.1vw" fontWeight="bold">
              Địa chỉ:
            </Typography>
            <Typography fontSize="0.9vw">
              CS1: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP. HCM
            </Typography>
            <Typography fontSize="0.9vw">
              CS2: Khu phố Tân Lập, Phường Đông Hòa, TP. Dĩ An, Tỉnh Bình Dương
            </Typography>
          </Box>
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translate(-50%, -50% )",
              height: "4vh",
              width: "4vw",
            }}>
            <img src={hcmut_logo} alt="HCMUT" />
          </Box>
          <Box>
            <Typography fontSize="1.1vw" fontWeight="bold">
              Liên hệ Tổ kỹ thuật:
            </Typography>

            <Typography fontSize="0.9vw">Email : ddthu@hcmut.edu.vn</Typography>
            <Typography fontSize="0.9vw">
              ĐT (Tel.) : (84-8) 38647256 - 5258
            </Typography>
          </Box>
        </Box>
      </Container> */}
    </Box>
  );
};

export default Footer;
