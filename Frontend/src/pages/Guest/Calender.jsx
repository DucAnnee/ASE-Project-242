import React, { useState, useMemo, useEffect } from "react";
import styles from "../../styles/Schedule.module.css";

const campuses = {
  "Lí Thường Kiệt": ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"],
  "Dĩ An": ["H1", "H2", "H3", "H4", "H5"],
};

const rooms = Array.from({ length: 5 }, (_, f) =>
  Array.from({ length: 5 }, (_, r) => `${f + 1}0${r + 1}`)
).flat();
const hours = Array.from({ length: 19 }, (_, i) => `${i + 5}:00`); // Giờ học từ 7:00 đến 18:00

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// Data mẫu cho các lịch đã đặt
const sampleBookings = [
  {
    campus: "Lí Thường Kiệt",
    building: "B4",
    room: "502",
    date: new Date(),
    startHour: 5,
    endHour: 10,
    lecturer: "Nguyễn Vũ",
    subject: "Nhập môn CNPM",
  },
  {
    campus: "Lí Thường Kiệt",
    building: "B4",
    room: "302",
    date: new Date(),
    startHour: 13,
    endHour: 15,
    lecturer: "Trần Văn Nam",
    subject: "Kiến trúc máy tính",
  },
  {
    campus: "Lí Thường Kiệt",
    building: "A1",
    room: "201",
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Ngày mai
    startHour: 9,
    endHour: 11,
    lecturer: "Lê Hoàng Long",
    subject: "ASE",
  },
  {
    campus: "Dĩ An",
    building: "H1",
    room: "101",
    date: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Ngày kia
    startHour: 7,
    endHour: 9,
    lecturer: "Phạm Thị Hoa",
    subject: "PPL",
  },
];

const Calender = () => {
  const [campus, setCampus] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [bookingDetails, setBookingDetails] = useState({});

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  // Tạo thông tin chi tiết về các lịch đã đặt khi thay đổi lựa chọn hoặc tuần
  useMemo(() => {
    const details = {};

    sampleBookings.forEach((booking) => {
      // Chỉ hiển thị booking phù hợp với bộ lọc đã chọn
      if (
        (campus && booking.campus !== campus) ||
        (building && booking.building !== building) ||
        (room && booking.room !== room)
      ) {
        return;
      }

      // Chỉ hiển thị booking trong tuần đã chọn
      const bookingDate = new Date(booking.date);
      const bookingDay = bookingDate.toLocaleDateString("en-US", { weekday: "short" });
      const bookingDateString = `${bookingDate.getDate()}/${bookingDate.getMonth() + 1}`;

      // Kiểm tra xem ngày có thuộc về tuần hiện tại không
      const isInCurrentWeek = weekDates.some(
        (date) =>
          date.getDate() === bookingDate.getDate() &&
          date.getMonth() === bookingDate.getMonth() &&
          date.getFullYear() === bookingDate.getFullYear()
      );

      if (!isInCurrentWeek) return;

      // Tạo slot cho mỗi giờ trong khoảng thời gian đặt phòng
      for (let hour = booking.startHour; hour < booking.endHour; hour++) {
        const slot = `${bookingDateString}-${bookingDay}-${hour}:00`;
        details[slot] = {
          lecturer: booking.lecturer,
          subject: booking.subject,
          class: booking.class,
          room: booking.room,
          building: booking.building,
          campus: booking.campus,
        };
      }
    });

    setBookingDetails(details);
  }, [campus, building, room, weekOffset, weekDates]);
  // Thêm useEffect để xử lý thanh cuộn
  useEffect(() => {
    // Thêm style trực tiếp vào phần tử DOM
    const style = document.createElement("style");
    style.textContent = `
      .${styles.scheduleWrapper} {
        overflow-x: hidden; /* Ẩn thanh cuộn ngang */
        width: 100%;
      }
      .${styles.scheduleGrid} {
        width: 100%;
        table-layout: fixed;
      }
      @media (max-width: 768px) {
        .${styles.scheduleWrapper} {
          overflow-x: auto; /* Cho phép cuộn ngang trên thiết bị nhỏ */
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Kiểm tra xem một slot có được đặt chưa
  const isSlotBooked = (date, dayLabel, hour) => {
    const slotDate = `${date.getDate()}/${date.getMonth() + 1}`;
    const slot = `${slotDate}-${dayLabel}-${hour}`;
    return !!bookingDetails[slot];
  };

  return (
    <>
      <div className={styles.pageBackground}></div>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.filters}>
            <label>Campus</label>
            <select value={campus} onChange={(e) => setCampus(e.target.value)}>
              <option value="">Choose Campus</option>
              {Object.keys(campuses).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <label>Building</label>
            <select
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              disabled={!campus}
            >
              <option value="">Choose Building</option>
              {campus && campuses[campus].map((b) => <option key={b}>{b}</option>)}
            </select>
            <label>Room</label>
            <select value={room} onChange={(e) => setRoom(e.target.value)} disabled={!building}>
              <option value="">Choose Room</option>
              {rooms.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.weekNavButtons}>
          <button className={styles.prevWeek} onClick={() => setWeekOffset((o) => o - 1)}></button>
          <button className={styles.nextWeek} onClick={() => setWeekOffset((o) => o + 1)}></button>
        </div>

        <div className={styles.scheduleWrapper} style={{ overflowX: "hidden", width: "100%" }}>
          <div className={styles.scheduleGrid}>
            <div className={styles.headerRow}>
              <div className={styles.timeCell}></div>
              {weekDates.map((d) => {
                const wd = d.toLocaleDateString("en-US", { weekday: "short" });
                const md = `${d.getDate()}/${d.getMonth() + 1}`;
                return (
                  <div key={d} className={styles.dayCell}>
                    <div className={styles.date}>{md}</div>
                    <div className={styles.weekday}>{wd}</div>
                  </div>
                );
              })}
            </div>
            {hours.map((hour) => (
              <div key={hour} className={styles.row}>
                <div className={styles.timeCell}>{hour}</div>

                {weekDates.map((d, columnIndex) => {
                  const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
                  const isBooked = isSlotBooked(d, dayLabel, hour);
                  const slotDate = `${d.getDate()}/${d.getMonth() + 1}`;
                  const slot = `${slotDate}-${dayLabel}-${hour}`;
                  const details = bookingDetails[slot];

                  // Xác định vị trí của tooltip dựa vào giờ và vị trí cột
                  const hourNum = parseInt(hour);
                  const isEarlyHour = hourNum <= 9;
                  const isLastColumn = columnIndex === 6; // Chủ nhật là cột thứ 7 (index 6)

                  // Tạo class cho tooltip dựa vào vị trí
                  const tooltipClassName = `${styles.tooltipContainer} ${
                    isEarlyHour ? styles.tooltipContainerBottom : ""
                  } ${isLastColumn ? styles.tooltipContainerLeft : ""}`;

                  return (
                    <div
                      key={slot}
                      className={`${styles.slotCell} ${isBooked ? styles.booked : ""}`}
                    >
                      {isBooked && (
                        <div
                          className={tooltipClassName}
                          style={{ width: "100%", maxWidth: "100%" }}
                        >
                          <div className={styles.tooltipTitle}>Infomation</div>
                          <div className={styles.tooltipInfo}>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>Lecturer:</span>
                              <span
                                className={styles.tooltipValue}
                                style={{ wordBreak: "break-word" }}
                              >
                                {details.lecturer}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>Subject:</span>
                              <span
                                className={styles.tooltipValue}
                                style={{ wordBreak: "break-word" }}
                              >
                                {details.subject}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>Campus:</span>
                              <span
                                className={styles.tooltipValue}
                                style={{ wordBreak: "break-word" }}
                              >
                                {details.campus}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>Room:</span>
                              <span
                                className={styles.tooltipValue}
                                style={{ wordBreak: "break-word" }}
                              >
                                {details.room} - {details.building}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Calender;
