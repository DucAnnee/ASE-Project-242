import React, { useState, useMemo } from "react";
import styles from "../styles/Schedule.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const campuses = {
  "Lí Thường Kiệt": ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4"],
  "Dĩ An": ["H1", "H2", "H3", "H4", "H5"],
};

const rooms = Array.from({ length: 5 }, (_, f) =>
  Array.from({ length: 5 }, (_, r) => `${f + 1}0${r + 1}`)
).flat();
const hours = Array.from({ length: 19 }, (_, i) => `${i + 5}:00`);

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

const Schedule = () => {
  const [campus, setCampus] = useState("");
  const [building, setBuilding] = useState("");
  const [room, setRoom] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  // Modify the handleSlotClick function to include the week offset in the slot identifier
  // Update the handleSlotClick function to use DD/MM format
  const handleSlotClick = (dayLabel, hour, date) => {
    // Create a unique slot identifier that includes the week (using the full date)
    const slotDate = `${date.getDate()}/${date.getMonth() + 1}`; // Changed from MM/DD to DD/MM
    const slot = `${slotDate}-${dayLabel}-${hour}`;

    if (bookedSlots.includes(slot)) {
      toast.warn("Giờ này đã được đặt, không thể thay đổi.");
      return;
    }

    if (!campus || !building || !room) {
      toast.warn("Vui lòng chọn đủ Campus, Building và Room trước!");
      return;
    }

    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleBook = () => {
    if (!selectedSlots.length) return;
    setShowModal(true);
  };

  const confirmBooking = () => {
    setShowModal(false);
    setBookedSlots((prev) => [...prev, ...selectedSlots]);
    setSelectedSlots([]);
    toast.success("Đặt lịch thành công!");
    setCampus("");
    setBuilding("");
    setRoom("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.filters}>
          <label>Campus</label>
          <select value={campus} onChange={(e) => setCampus(e.target.value)}>
            <option value="">Chọn Campus</option>
            {Object.keys(campuses).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label>Building</label>
          <select value={building} onChange={(e) => setBuilding(e.target.value)} disabled={!campus}>
            <option value="">Chọn Building</option>
            {campus && campuses[campus].map((b) => <option key={b}>{b}</option>)}
          </select>
          <label>Room</label>
          <select value={room} onChange={(e) => setRoom(e.target.value)} disabled={!building}>
            <option value="">Chọn Room</option>
            {rooms.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.weekNavButtons}>
        <button className={styles.prevWeek} onClick={() => setWeekOffset((o) => o - 1)}>
          &lt;&lt; Tuần trước
        </button>
        <button className={styles.nextWeek} onClick={() => setWeekOffset((o) => o + 1)}>
          &gt;&gt; Tuần tiếp
        </button>
      </div>

      <div className={styles.scheduleWrapper}>
        <div className={styles.scheduleGrid}>
          <div className={styles.headerRow}>
            <div className={styles.timeCell}></div>
            {weekDates.map((d) => {
              const wd = d.toLocaleDateString("en-US", { weekday: "short" });
              const md = `${d.getDate()}/${d.getMonth() + 1}`; // Changed from MM/DD to DD/MM
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
              {weekDates.map((d) => {
                const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
                const slotDate = `${d.getDate()}/${d.getMonth() + 1}`; // Changed from MM/DD to DD/MM
                const slot = `${slotDate}-${dayLabel}-${hour}`;
                const isSelected = selectedSlots.includes(slot);
                const isBooked = bookedSlots.includes(slot);
                return (
                  <div
                    key={slot}
                    className={`${styles.slotCell} ${isSelected ? styles.selected : ""} ${
                      isBooked ? styles.booked : ""
                    }`}
                    onClick={() => handleSlotClick(dayLabel, hour, d)}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <button className={styles.bookButton} onClick={handleBook}>
        Book
      </button>

      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Confirm your appointment</h3>
            <div className={styles.modalContent}>
              <p>
                <strong>Name:</strong> Nguyen Vu
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
                <strong>Time:</strong>{" "}
                <div style={{ marginTop: "8px", paddingLeft: "20px" }}>
                  {(() => {
                    // Group slots by day
                    const slotsByDay = {};
                    selectedSlots.forEach((slot) => {
                      const [date, day, time] = slot.split("-");
                      const dayKey = `${date} ${day}`;
                      if (!slotsByDay[dayKey]) {
                        slotsByDay[dayKey] = [];
                      }
                      // Extract hour as a number for sorting
                      const hour = parseInt(time.split(":")[0]);
                      slotsByDay[dayKey].push(hour);
                    });

                    // Convert grouped slots to readable ranges
                    return Object.entries(slotsByDay).map(([dayKey, hours], index) => {
                      // Sort hours
                      hours.sort((a, b) => a - b);

                      // Group consecutive hours
                      const ranges = [];
                      let start = hours[0];
                      let end = hours[0];

                      for (let i = 1; i < hours.length; i++) {
                        if (hours[i] === end + 1) {
                          // Consecutive hour, extend the range
                          end = hours[i];
                        } else {
                          // Non-consecutive, add current range and start a new one
                          ranges.push({ start, end });
                          start = hours[i];
                          end = hours[i];
                        }
                      }
                      // Add the last range
                      ranges.push({ start, end });

                      // Format ranges as strings
                      const timeRanges = ranges.map((range) => {
                        if (range.start === range.end) {
                          return `${range.start}:00`;
                        }
                        return `${range.start}:00 to ${range.end + 1}:00`;
                      });

                      return (
                        <div key={index} style={{ marginBottom: "4px" }}>
                          - {dayKey} at {timeRanges.join(", ")}
                        </div>
                      );
                    });
                  })()}
                </div>
              </p>
            </div>
            <div className={styles.modalActions}>
              <button onClick={confirmBooking}>OK</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Schedule;
