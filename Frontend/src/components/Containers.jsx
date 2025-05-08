import { Box, Container, Paper, styled } from "@mui/material";

export const MainContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100vw",
  height: "90vh",
}));

export const MainPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  height: "90%",
  backgroundColor: "rgba(255,255,255,0.7)",
  display: "flex",
  justifyContent: "space-between",
  borderRadius: 8,
  marginTop: 20,
  padding: 20,
}));

export const FullBox = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  margin: 2,
  padding: 2,
}));
