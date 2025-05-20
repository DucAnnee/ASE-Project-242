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
import styles from "../styles/Schedule.module.css";
import { FullBox, MainContainer, MainPaper } from "../components/Containers";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import buildingIdToCampus from "../utils/campusMapping";

export default function BookingHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSizeOptions = [25, 50, 100];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const currentDate = new Date().toISOString().split("T")[0];

  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      setLoading(true);
      try {
        console.log(userInfo.username);
        const res = await api.post(
          "/api/booking/userBookings",
          {
            username: userInfo.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = res.data.bookings;
        const mapped = data.map((booking) => {
          const meta = buildingIdToCampus[booking.room.building_id] || {};
          const start = new Date(booking.start_time);
          const end = new Date(booking.end_time);

          return {
            campus: meta.campus || "Unknown",
            building: meta.building || "Unknown",
            room: booking.room.room_number,
            date: start.toISOString().split("T")[0],
            time: `${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          };
        });

        setRows(mapped);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [userInfo?.username]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setOpenConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
      // TODO: Call the API to cancel the booking
      setRows(
        rows.filter(
          (row) =>
            !(
              row.campus === selectedBooking.campus &&
              row.building === selectedBooking.building &&
              row.room === selectedBooking.room &&
              row.date === selectedBooking.date &&
              row.time === selectedBooking.time
            ),
        ),
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
          {loading ? (
            <div className={styles.loadingCentered}>
              <img src="/loading.gif" alt="Loading..." />
            </div>
          ) : (
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
          )}
        </MainPaper>
      </MainContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm cancellation"}
        </DialogTitle>
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
        <DialogActions
          sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
        >
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
          <Button
            onClick={handleConfirmCancel}
            color="error"
            variant="contained"
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
