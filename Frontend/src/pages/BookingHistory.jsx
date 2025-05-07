import { Box, Typography } from "@mui/material";

export default function BookingHistory() {
  return (
    <Box
      sx={{
        alignSelf: "center",
        alignContent: "center",
        width: "90vw",
        minHeight: "100%",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        gap: 2,
        py: 3,
      }}>
      <Typography fontSize="2em">Day la history </Typography>
    </Box>
  );
}
