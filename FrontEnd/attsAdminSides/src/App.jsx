import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Home from "./components/Home/HomePage";
import Timesheets from "./components/Timesheets/Timesheets";
import CreateUser from "./components/CreateUser/CreateUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="createuser" element={<CreateUser/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
