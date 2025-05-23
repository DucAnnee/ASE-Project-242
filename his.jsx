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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styles from "../styles/Schedule.module.css";
import { FullBox, MainContainer, MainPaper } from "../components/Containers";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
// Add this import at the top
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import buildingIdToCampus from "../utils/campusMapping";

export default function BookingHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSizeOptions = [25, 50, 100];
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const customTheme = createTheme({
    components: {
      MuiDataGrid: {
        styleOverrides: {
          footerContainer: {
            justifyContent: "flex-end",
          },
          toolbarContainer: {
            justifyContent: "flex-end",
          },
        },
      },
    },
  });

  const currentDate = new Date().toISOString().split("T")[0];
  const { userInfo } = useAuth();

  // Move fetchBookingHistory outside useEffect so it can be called elsewhere
  const fetchBookingHistory = async () => {
    if (!userInfo?.username) return;

    setLoading(true);
    try {
      console.log("Fetching bookings for:", userInfo.username);
      const res = await api.post(
        "/api/booking/userBookings",
        {
          username: userInfo.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data.bookings;
      const mapped = data.map((booking) => {
        const meta = buildingIdToCampus[booking.room.building_id] || {};

        // Fix: Create date objects from booking start time
        const startTime = new Date(booking.start_time);

        // Format the date in YYYY-MM-DD without timezone conversions
        // This preserves the actual date as stored in database
        const year = startTime.getFullYear();
        const month = String(startTime.getMonth() + 1).padStart(2, "0");
        const day = String(startTime.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const endTime = new Date(booking.end_time);

        return {
          booking_id: booking.id,
          campus: meta.campus || "Unknown",
          building: meta.building || "Unknown",
          room: booking.room.room_number,
          date: dateStr,
          time: `${startTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })} – ${endTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
          status: booking.status,
        };
      });

      // Filter out cancelled bookings - this is crucial!
      const activeBookings = mapped.filter((booking) => booking.status !== "cancelled");
      setRows(activeBookings);
      console.log("Active bookings loaded:", activeBookings.length);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      toast.error("Could not load booking history");
    } finally {
      setLoading(false);
    }
  };

  // Call fetchBookingHistory when component mounts
  useEffect(() => {
    fetchBookingHistory();
  }, [userInfo?.username]);

  const handleCancelClick = (booking) => {
    setSelectedBooking(booking);
    setOpenConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedBooking) return;

    try {
      console.log("Cancelling booking:", selectedBooking.booking_id);

      // Call the API to cancel the booking
      await api.put(
        "/api/booking/booking/status",
        {
          booking_id: selectedBooking.booking_id,
          new_status: "cancelled",
          username: userInfo.username,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // After successful API call, update the UI immediately
      setRows(rows.filter((row) => row.booking_id !== selectedBooking.booking_id));

      // Add more details to the cancellation notification in localStorage
      // This helps Schedule.jsx detect the change
      localStorage.setItem(
        "bookingCancelled",
        JSON.stringify({
          timestamp: new Date().getTime(),
          bookingId: selectedBooking.booking_id,
          campus: selectedBooking.campus,
          building: selectedBooking.building,
          room: selectedBooking.room,
          date: selectedBooking.date,
        })
      );

      // Fire a custom event that Schedule.jsx can listen for
      const cancelEvent = new CustomEvent("bookingCancelled", {
        detail: {
          bookingId: selectedBooking.booking_id,
          room: selectedBooking.room,
          building: selectedBooking.building,
          campus: selectedBooking.campus,
          timestamp: new Date().getTime(),
        },
      });
      window.dispatchEvent(cancelEvent);
      console.log("Cancellation event dispatched");

      // Close the dialog
      setOpenConfirmDialog(false);
      setSelectedBooking(null);

      // Show success message
      toast.success("Booking has been successfully cancelled");

      // Force reload the booking list to ensure we have the latest data
      // setTimeout helps ensure the backend has processed the cancellation
      setTimeout(() => {
        fetchBookingHistory();
      }, 500);
    } catch (err) {
      console.error("Error canceling booking:", err);
      toast.error("Failed to cancel booking. Please try again.");
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
      <ToastContainer position="top-right" />

      <MainContainer>
        <MainPaper>
          {loading ? (
            <div className={styles.loadingCentered}>
              <img src="/loading.gif" alt="Loading..." />
            </div>
          ) : (
            <FullBox>
              <ThemeProvider theme={customTheme}>
                <DataGrid
                  sx={{
                    height: "100%",
                    width: "100%",
                    "& .MuiTablePagination-root": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      width: "100%",
                    },
                    "& .MuiTablePagination-selectLabel": {
                      margin: 0,
                    },
                    "& .MuiTablePagination-displayedRows": {
                      margin: 0,
                      marginLeft: "20px",
                    },
                    "& .MuiTablePagination-actions": {
                      marginLeft: "20px",
                    },
                  }}
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  pageSizeOptions={pageSizeOptions}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 25 },
                    },
                  }}
                  disableSelectionOnClick
                  getRowId={(row) =>
                    `${
                      row.booking_id ||
                      `${row.campus}-${row.building}-${row.room}-${row.date}-${row.time}`
                    }`
                  }
                />
              </ThemeProvider>
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
