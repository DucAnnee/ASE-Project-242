import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "../../styles/Schedule.module.css";
import { FullBox, MainContainer, MainPaper } from "../../components/Containers";

export default function BookingHistory() {
  const [rows, setRows] = useState([
    {
      campus: "Lí Thường Kiệt",
      building: "B4",
      room: "502",
      date: "2025-05-01",
      time: "08:00 – 09:00",
    },
    {
      campus: "Lí Thường Kiệt",
      building: "B9",
      room: "202",
      date: "2025-05-02",
      time: "09:30 – 10:30",
    },
    {
      campus: "Dĩ An",
      building: "H3",
      room: "303",
      date: "2025-05-03",
      time: "11:00 – 12:00",
    },
    {
      campus: "Dĩ An",
      building: "H6",
      room: "606",
      date: "2025-05-04",
      time: "13:00 – 14:00",
    },
    {
      campus: "Lí Thường Kiệt",
      building: "B4",
      room: "306",
      date: "2025-05-05",
      time: "14:30 – 15:30",
    },
    {
      campus: "Lí Thường Kiệt",
      building: "B4",
      room: "306",
      date: "2025-05-13",
      time: "14:30 – 15:30",
    },
    {
      campus: "Lí Thường Kiệt",
      building: "B4",
      room: "306",
      date: "2025-05-12",
      time: "14:30 – 15:30",
    },
    {
      campus: "Lí Thường Kiệt",
      building: "B4",
      room: "306",
      date: "2025-05-10",
      time: "14:30 – 15:30",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const pageSizeOptions = [25, 50, 100];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Get current date for comparison
  const currentDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchBookingHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("TODO");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        const mapped = data.map((item, idx) => ({
          // TODO
        }));
        setRows(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setOpenConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // Here you would make an API call to cancel the booking
      // For now, let's just remove it from the local state
      setRows(
        rows.filter(
          (row) =>
            !(
              row.campus === selectedBooking.campus &&
              row.building === selectedBooking.building &&
              row.room === selectedBooking.room &&
              row.date === selectedBooking.date &&
              row.time === selectedBooking.time
            )
        )
      );

      // Close the dialog
      setOpenConfirmDialog(false);
      setSelectedBooking(null);
    } catch (err) {
      console.error("Error canceling booking:", err);
    }
  };

  const columns = [
    {
      field: "stt",
      headerName: "No",
      flex: 1,
      renderCell: (params) => {
        const idx = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return idx != null ? idx + 1 : "";
      },
      sortable: false,
      filterable: false,
      align: "center",
    },
    { field: "campus", headerName: "Campus", flex: 3 },
    { field: "building", headerName: "Building", flex: 2 },
    { field: "room", headerName: "Room", flex: 2 },
    { field: "date", headerName: "Date", flex: 3 },
    { field: "time", headerName: "Time", flex: 3 },
    {
      field: "cancel",
      headerName: "Edit",
      flex: 2,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        // Check if booking date is in the future
        const isFutureBooking = params.row.date > currentDate;

        return isFutureBooking ? (
          <Button
            variant="outlined"
            color="error"
            size="small"
            startIcon={<CancelIcon />}
            onClick={() => handleCancelClick(params.row)}
            sx={{
              minWidth: "100px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#ffebee",
              },
            }}
          >
            Cancel
          </Button>
        ) : (
          <Button
            variant="text"
            disabled
            size="small"
            sx={{ color: "#aaa", cursor: "not-allowed", minWidth: "100px" }}
          >
            No Action
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div className={styles.pageBackground} />

      <MainContainer>
        <MainPaper>
          <FullBox>
            <DataGrid
              sx={{
                height: "100%",
                width: "100%",
              }}
              rows={rows}
              columns={columns}
              loading={loading}
              pageSizeOptions={pageSizeOptions}
              disableSelectionOnClick
              getRowId={(row) =>
                `${row.campus}-${row.building}-${row.room}-${row.date}-${row.time}`
              }
            />
          </FullBox>
        </MainPaper>
      </MainContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm cancellation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {selectedBooking && (
              <>
                Are you sure you want to cancel your reservation?
                <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography>
                    <strong>Campus:</strong> {selectedBooking.campus}
                  </Typography>
                  <Typography>
                    <strong>Building:</strong> {selectedBooking.building}
                  </Typography>
                  <Typography>
                    <strong>Room:</strong> {selectedBooking.room}
                  </Typography>
                  <Typography>
                    <strong>Date:</strong> {selectedBooking.date}
                  </Typography>
                  <Typography>
                    <strong>Time:</strong> {selectedBooking.time}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            variant="contained"
            sx={{
              bgcolor: "#61c0ff",
              color: "#000000",
              "&:hover": {
                bgcolor: "#27A4F2",
              },
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
