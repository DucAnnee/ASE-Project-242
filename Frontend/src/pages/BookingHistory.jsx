import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import styles from "../styles/Schedule.module.css";
import { FullBox, MainContainer, MainPaper } from "../components/Containers";

export default function BookingHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const pageSizeOptions = [25, 50, 100];

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

  const columns = [
    {
      field: "stt",
      headerName: "STT",
      flex: 1,
      renderCell: (params) => {
        const idx = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return idx != null ? idx + 1 : "";
      },
      sortable: false,
      filterable: false,
      align: "center",
    },
    { field: "campus", headerName: "Cơ sở", flex: 2 },
    { field: "building", headerName: "Tòa nhà", flex: 1 },
    { field: "room", headerName: "Số phòng", flex: 2 },
    { field: "date", headerName: "Ngày", flex: 4 },
    { field: "time", headerName: "Thời gian", flex: 4 },
  ];

  const sampleRows = [
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
              rows={sampleRows}
              columns={columns}
              loading={loading}
              pageSizeOptions={pageSizeOptions}
              disableSelectionOnClick
              getRowId={(row) =>
                `${row.campus}-${row.buildin}-${row.room}-${row.date}-${row.time}`
              }
            />
          </FullBox>
        </MainPaper>
      </MainContainer>
    </>
  );
}
