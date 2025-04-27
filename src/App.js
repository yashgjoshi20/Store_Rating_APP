// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Home from "./components/Auth/home"; // make sure this matches your filename exactly
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import StoreList from "./components/Auth/Store/StoreList";
import Dashboard from "./components/Admin/Dashboard";
import Navbar from "./components/Shared/Navbar";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Home page at root */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stores" element={<StoreList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch all — redirect unknown URLs back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
