import React, { useState } from "react";
import axios from "axios";
import "./Timesheets.css";

function Timesheets() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [timesheetData, setTimesheetData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Helper function to format date as dd-mm-yyyy
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const handleNameChange = (event) => setName(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleDateChange = (event) => setSelectedDate(event.target.value);

  const handleWeekStartChange = (event) => {
    const startDate = event.target.value;
    if (!startDate) {
      setWeekStart("");
      setWeekEnd("");
      return;
    }

    let start = new Date(startDate);
    let end = new Date(start);
    end.setDate(start.getDate() + 6);

    setWeekStart(formatDate(start));
    setWeekEnd(formatDate(end));
  };

  // Helper function to format time (seconds -> HH:MM:SS)
  const formatIdleTime = (seconds) => {
    if (!seconds) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  // Helper function to format time (ms -> HH:MM:SS)
  function formatTime(ms) {
    let hours = Math.floor(ms / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const requestData = {
        name,
        email,
        date: selectedDate,
        startWeek: weekStart,
        endWeek: weekEnd,
        month: selectedMonth,
      };

      console.log("Sending request data:", requestData);

      const response = await axios.post(
        "http://localhost:8000/api/timeSheet/employeeTimesheet",
        requestData
      );

      console.log("Response received:", response.data);

      if (response.data.status === "success") {
        setTimesheetData(response.data.data);
        setErrorMessage("");
      } else {
        setTimesheetData(null);
        setErrorMessage(response.data.message || "No records found.");
      }
    } catch (error) {
      console.error("Error fetching timesheet data:", error);
      setTimesheetData(null);
      setErrorMessage("Failed to fetch timesheet data. Please try again.");
    }
  };

  return (
    <div className="time-sheets-fz-main-container">
      <h4 className="time-sheets-fz-text">Timesheet</h4>

      <div className="time-sheets-fz-container">
        {/* Filters */}
        <div className="time-sheets-fz-container-filters">
          <div className="input-group">
            <label>Name</label>
            <input
              className="time-sheets-fz-container-input"
              type="text"
              placeholder="Employee name"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              className="time-sheets-fz-container-input"
              type="email"
              placeholder="Employee email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          {/* Day Input */}
          <div className="input-group">
            <label>Day</label>
            <input
              className="time-sheets-fz-container-input"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          {/* Week Input */}
          <div className="input-group">
            <label>Week</label>
            <div className="week-input-wrapper">
              <input
                className="week-display-input"
                type="text"
                value={weekStart && weekEnd ? `${weekStart} to ${weekEnd}` : ""}
                placeholder="dd-mm-yyyy"
                readOnly
                onClick={() =>
                  document.getElementById("week-start-picker").click()
                }
              />
              <input
                id="week-start-picker"
                className="week-date-picker"
                type="date"
                onChange={handleWeekStartChange}
              />
            </div>
          </div>

          {/* Month & Year Selection */}
          <div className="input-group">
            <label>Month & Year</label>
            <select
              className="time-sheets-fz-container-input"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            >
              <option value="">Select Month & Year</option>
              {Array.from({ length: 5 }).map((_, yearOffset) => {
                const yearValue = new Date().getFullYear() - yearOffset;
                return Array.from({ length: 12 }, (_, i) => {
                  const month = new Date(2025, i, 1).toLocaleString("default", {
                    month: "short",
                  });
                  const value = `${month}-${yearValue}`;
                  return (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  );
                });
              })}
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="buttons-container">
          <button
            className="appit-time-tracker-by-fz-time-sheets-btn"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            style={{ background: "#cbe3bf", color: "#2a2a2a" }}
            className="appit-time-tracker-by-fz-time-sheets-btn"
          >
            Export
          </button>
        </div>

        {/* Results Table */}
        <div className="time-sheets-fz-container-table">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {timesheetData && timesheetData.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Total Work Time</th>
                  <th>Total Break Time</th>
                  <th>Total Idle Time</th>
                  <th>Login At</th>
                  <th>Idle Messages</th>
                </tr>
              </thead>
              <tbody>
                {timesheetData.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{formatTime(entry.WorkTime)}</td>
                    <td>{formatTime(entry.BreakTime)}</td>
                    <td>{formatIdleTime(entry.totalIdleTime)}</td>
                    <td>{entry.loginAt ? entry.loginAt.join(", ") : "N/A"}</td>
                    <td>
                      {entry.idleMsg.length > 0
                        ? entry.idleMsg.join(", ")
                        : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !errorMessage && <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timesheets;
