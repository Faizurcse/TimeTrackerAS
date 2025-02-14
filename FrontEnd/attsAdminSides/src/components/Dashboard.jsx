import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  FaHome,
  FaBars,
  FaUserPlus,
  FaClock,
  FaSignOutAlt,
} from "react-icons/fa"; // Import logout icon
import { SlClose } from "react-icons/sl";
import "./Dashboard.css";

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="time-tarcker-fz-main-cotainer">
        <div
          className={`time-tarcker-fz-cotainer ${
            isSidebarOpen ? "" : "collapsed"
          }`}
        >
          {/* Sidebar */}
          <div className="time-tarcker-fz-left-side-bar">
            <div className="appit-logo-by-fz">
              <img
                className="appit-logo-by-fz-img"
                src="https://appitsoftware.com/wp-content/uploads/2022/10/logomain-1.png"
                alt="Appit Logo"
              />
              <span className="appit-logo-by-fz-barnd-name">
                Appit Surveillance
              </span>
            </div>

            <div
              className="time-tarcker-fz-left-side-bar-on-off-icons"
              onClick={toggleSidebar}
            >
              {isSidebarOpen ? <SlClose size={20} /> : <FaBars size={20} />}
            </div>

            <div className="time-tarcker-fz-left-side-bar-items">
              {/* Home */}
              <Link
                to="/"
                className="nav-item-timetracker-fz time-tarcker-fz-left-side-bar-items-all"
              >
                <FaHome size={20} />
                {isSidebarOpen && <span>Home</span>}
              </Link>

              {/* Create User */}
              <Link
                to="/createuser"
                className="nav-item-timetracker-fz time-tarcker-fz-left-side-bar-items-all"
              >
                <FaUserPlus size={20} />
                {isSidebarOpen && <span>Create User</span>}
              </Link>

              {/* Timesheets */}
              <Link
                to="/timesheets"
                className="nav-item-timetracker-fz time-tarcker-fz-left-side-bar-items-all"
              >
                <FaClock size={20} />
                {isSidebarOpen && <span>Timesheets</span>}
              </Link>
            </div>

            {/* Logout - Placed at Bottom */}
            <div className="time-tarcker-fz-left-side-bar-items-logout">
              <Link
                to="/logout"
                className="time-tarcker-fz-left-side-bar-items-logout-item"
              >
                <FaSignOutAlt
                  size={20}
                  className="time-tarcker-fz-left-side-bar-items-logout-icon"
                />
                {isSidebarOpen && <span>Logout</span>}
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="time-tarcker-fz-right-display-conatiner">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
