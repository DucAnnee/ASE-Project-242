import React, { useState, useMemo, useEffect } from "react";
import styles from "../styles/Schedule.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";

/* ------------------------------------------------------------
   Static mock data – replace with API calls when available
-------------------------------------------------------------*/
const campuses = {
  "Lí Thường Kiệt": [
    "A1",
    "A2",
    "A3",
    "A4",
    "B1",
    "B2",
    "B3",
    "B4",
    "C1",
    "C2",
    "C3",
    "C4",
  ],
  "Dĩ An": ["H1", "H2", "H3", "H4", "H5"],
};
const rooms = Array.from({ length: 5 }, (_, f) =>
  Array.from({ length: 5 }, (_, r) => `${f + 1}0${r + 1}`)
).flat();
const hours = Array.from({ length: 19 }, (_, i) => `${i + 5}:00`);

function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Schedule() {
  /* --------------------------------------------------
     Auth & role
  --------------------------------------------------*/
  const { userInfo } = useAuth();
  const role = userInfo?.role?.toLowerCase() || "guest";
  const canBook = role === "lecturer" || role === "teacher";

  /* --------------------------------------------------
     UI state
  --------------------------------------------------*/
  const [campus, setCampus] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({});
  const [showModal, setShowModal] = useState(false);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  /* --------------------------------------------------
     Fetch bookings whenever room/week changes
  --------------------------------------------------*/
  useEffect(() => {
    const fetchBookings = async () => {
      if (!room) return;
      try {
        const startISO = weekDates[0].toISOString();
        const endISO = new Date(
          weekDates[6].getTime() + 24 * 60 * 60 * 1000
        ).toISOString();
        const { data } = await api.get("/booking/room", {
          params: { room_id: room, start: startISO, end: endISO },
        });
        const slots = [];
        const details = {};
        data.bookings.forEach((b) => {
          const st = new Date(b.start_time);
          const et = new Date(b.end_time);
          for (let h = st.getHours(); h < et.getHours(); h++) {
            const labelDate = `${st.getDate()}/${st.getMonth() + 1}`;
            const dayLabel = st.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const slot = `${labelDate}-${dayLabel}-${h}:00`;
            slots.push(slot);
            details[slot] = {
              lecturer: b.bookedBy?.first_name || b.user,
              subject: b.subject || "N/A",
              room,
              building,
              campus,
            };
          }
        });
        setBookedSlots(slots);
        setBookingDetails(details);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings");
      }
    };
    fetchBookings();
  }, [room, weekOffset, campus, building]);

  /* --------------------------------------------------
     Slot selection
  --------------------------------------------------*/
  const handleSlotClick = (dayLabel, hour, date) => {
    const slotDate = `${date.getDate()}/${date.getMonth() + 1}`;
    const slot = `${slotDate}-${dayLabel}-${hour}`;

    if (bookedSlots.includes(slot)) {
      toast.warn("This time has been reserved by someone else.");
      return;
    }
    if (!canBook) return;
    if (!room) {
      toast.warn("Please select a room first");
      return;
    }
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  /* --------------------------------------------------
     Booking flow
  --------------------------------------------------*/
  const handleBook = () => {
    if (!selectedSlots.length) return;
    setShowModal(true);
  };

  const confirmBooking = async () => {
    setShowModal(false);
    try {
      await Promise.all(
        selectedSlots.map((slot) => {
          const [date, _day, time] = slot.split("-");
          const [d, m] = date.split("/");
          const start = new Date(weekDates[0]);
          start.setDate(parseInt(d));
          start.setMonth(parseInt(m) - 1);
          start.setHours(parseInt(time));
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          return api.post("/booking/book", {
            room_id: room,
            username: userInfo.username,
            start_time: start.toISOString(),
            end_time: end.toISOString(),
          });
        })
      );
      toast.success("Successfully booked!");
      setSelectedSlots([]);
      setWeekOffset((o) => o); // force refetch
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Booking failed");
    }
  };

  /* --------------------------------------------------
     Styles helpers
  --------------------------------------------------*/
  const disabledStyle = { backgroundColor: "#e6e6e6", color: "#777" };

  /* --------------------------------------------------
     JSX
  --------------------------------------------------*/
  return (
    <>
      <div className={styles.pageBackground}></div>
      <div className={styles.container}>
        {/* -------------------- Filters -------------------- */}
        <div className={styles.header}>
          <div className={styles.filters}>
            <label>Campus</label>
            <select
              value={campus}
              onChange={(e) => {
                setCampus(e.target.value);
                setBuilding("");
                setRoom("");
              }}
              className={styles.selectBox}>
              <option value="" disabled hidden>
                Campus
              </option>
              {Object.keys(campuses).map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <label>Building</label>
            <select
              value={building}
              onChange={(e) => {
                setBuilding(e.target.value);
                setRoom("");
              }}
              disabled={!campus}
              style={!campus ? disabledStyle : undefined}
              className={styles.selectBox}>
              <option value="" disabled hidden>
                Building
              </option>
              {campus &&
                campuses[campus].map((b) => <option key={b}>{b}</option>)}
            </select>

            <label>Room</label>
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              disabled={!building}
              style={!building ? disabledStyle : undefined}
              className={styles.selectBox}>
              <option value="" disabled hidden>
                Room
              </option>
              {rooms.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ---------------- Week navigation --------------- */}
        <div className={styles.weekNavButtons}>
          <button
            className={styles.prevWeek}
            onClick={() => setWeekOffset((o) => o - 1)}
          />
          <button
            className={styles.nextWeek}
            onClick={() => setWeekOffset((o) => o + 1)}
          />
        </div>

        {/* ---------------- Schedule grid --------------- */}
        <div className={styles.scheduleWrapper}>
          <div className={styles.scheduleGrid}>
            {/* Header row */}
            <div className={styles.headerRow}>
              <div className={styles.timeCell}></div>
              {weekDates.map((d) => {
                const wd = d.toLocaleDateString("en-US", { weekday: "short" });
                const md = `${d.getDate()}/${d.getMonth() + 1}`;
                return (
                  <div key={md} className={styles.dayCell}>
                    <div className={styles.date}>{md}</div>
                    <div className={styles.weekday}>{wd}</div>
                  </div>
                );
              })}
            </div>

            {/* Time rows */}
            {hours.map((hour) => (
              <div key={hour} className={styles.row}>
                <div className={styles.timeCell}>{hour}</div>
                {weekDates.map((d) => {
                  const dayLabel = d.toLocaleDateString("en-US", {
                    weekday: "short",
                  });
                  const slotDate = `${d.getDate()}/${d.getMonth() + 1}`;
                  const slot = `${slotDate}-${dayLabel}-${hour}`;
                  const isSelected = selectedSlots.includes(slot);
                  const isBooked = bookedSlots.includes(slot);
                  const details = bookingDetails[slot];
                  const isEarly = parseInt(hour) <= 7;
                  const tipCls = `${styles.tooltipContainer} ${
                    isEarly ? styles.tooltipContainerBottom : ""
                  }`;
                  return (
                    <div
                      key={slot}
                      className={`${styles.slotCell} ${
                        isSelected ? styles.selected : ""
                      } ${isBooked ? styles.booked : ""}`}
                      onClick={() => handleSlotClick(dayLabel, hour, d)}>
                      {isBooked && details && (
                        <div className={tipCls}>
                          <div className={styles.tooltipTitle}>Information</div>
                          <div className={styles.tooltipInfo}>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>
                                Lecturer:
                              </span>
                              <span className={styles.tooltipValue}>
                                {details.lecturer}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>
                                Subject:
                              </span>
                              <span className={styles.tooltipValue}>
                                {details.subject}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>
                                Campus:
                              </span>
                              <span className={styles.tooltipValue}>
                                {details.campus}
                              </span>
                            </div>
                            <div className={styles.tooltipInfoItem}>
                              <span className={styles.tooltipLabel}>Room:</span>
                              <span className={styles.tooltipValue}>
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

        {/* ---------------- Book button / modal --------------- */}
        {canBook && (
          <>
            <button
              className={styles.bookButton}
              onClick={handleBook}
              disabled={!selectedSlots.length}>
              Book Room
            </button>

            {showModal && (
              <div className={styles.modalBackdrop}>
                <div className={styles.modal}>
                  <h3 className={styles.modalTitle}>
                    Confirm your appointment
                  </h3>
                  <div className={styles.modalContent}>
                    <p>
                      <strong>Name:</strong> {userInfo.first_name}
                    </p>
                    <p>
                      <strong>Campus:</strong> {campus}
                    </p>
                    <p>
                      <strong>Building:</strong> {building}
                    </p>
                    <p>
                      <strong>Room:</strong> {room}
                    </p>
                    <p>
                      <strong>Time:</strong>
                    </p>
                    <div style={{ marginTop: 8, paddingLeft: 20 }}>
                      {(() => {
                        const slotsByDay = {};
                        selectedSlots.forEach((slot) => {
                          const [date, day, time] = slot.split("-");
                          const dayKey = `${date} ${day}`;
                          if (!slotsByDay[dayKey]) slotsByDay[dayKey] = [];
                          slotsByDay[dayKey].push(parseInt(time.split(":")[0]));
                        });
                        return Object.entries(slotsByDay).map(
                          ([dayKey, hours], idx) => {
                            hours.sort((a, b) => a - b);
                            const ranges = [];
                            let s = hours[0],
                              e = hours[0];
                            for (let i = 1; i < hours.length; i++) {
                              if (hours[i] === e + 1) {
                                e = hours[i];
                              } else {
                                ranges.push({ s, e });
                                s = e = hours[i];
                              }
                            }
                            ranges.push({ s, e });
                            const str = ranges
                              .map((r) =>
                                r.s === r.e
                                  ? `${r.s}:00`
                                  : `${r.s}:00 to ${r.e + 1}:00`
                              )
                              .join(", ");
                            return (
                              <div key={idx} style={{ marginBottom: 4 }}>
                                - {dayKey} at {str}
                              </div>
                            );
                          }
                        );
                      })()}
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button onClick={confirmBooking}>OK</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast area */}
      <ToastContainer position="bottom-center" theme="colored" />
    </>
  );
}
