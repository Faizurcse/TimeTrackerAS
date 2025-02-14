import React, { useState } from "react";
import "./Timesheets.css";

function Timesheets() {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  // Handle month selection
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  // Handle week start date change and auto-calculate end date
  const handleWeekStartChange = (event) => {
    const startDate = event.target.value;
    setWeekStart(startDate);

    if (startDate) {
      let start = new Date(startDate);
      let end = new Date(start);
      end.setDate(start.getDate() + 6); // Add 6 days to get the week's end date
      setWeekEnd(end.toISOString().split("T")[0]); // Format YYYY-MM-DD
    } else {
      setWeekEnd(""); // Reset end date if start date is cleared
    }
  };

  return (
    <div className="time-sheets-fz-main-container">
      <h4 className="time-sheets-fz-text">Timesheet</h4>

      <div className="time-sheets-fz-container">
        {/* Filters */}
        <div className="time-sheets-fz-container-filters">
          {/* Day Input */}
          <div className="input-group">
            <label>Day</label>
            <input className="time-sheets-fz-container-input" type="date" />
          </div>

          {/* Week Input */}
          <div  className="input-group">
            <label>Week</label>
            <input
              className="time-sheets-fz-container-input"
              type="text"
              value={weekStart && weekEnd ? `${weekStart} to ${weekEnd}` : ""}
              onClick={() => document.getElementById("week-start-picker").click()} // Open date picker
            />
            <input
              id="week-start-picker"
              className="hidden-date-picker"
              type="date"
              onChange={handleWeekStartChange}
            />
          </div>

          {/* Month Input */}
          <div className="input-group">
            <label>Month</label>
            <select
              className="time-sheets-fz-container-input"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <option value="">Select Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(2025, i, 1).toLocaleString("default", {
                  month: "long",
                });
                return (
                  <option key={i} value={month}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="time-sheets-fz-container-table">
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
                <th>Idle messages</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>

              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>

              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>


              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>


              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>


              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>


              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>

              <tr>
                <td>02/01/2025</td>
                <td>Faiz</td>
                <td>faiz@gmail.com</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>00:00:00</td>
                <td>09:45 PM, 02/01/2025</td>
                <td>Meetings, Short Meetings, Meet with Asif</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Timesheets;
