import { Routes, Route, Outlet } from "react-router-dom";
import { useEffect } from "react";

import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

// Adopt pages
import AdoptStart from "./pages/Adoptstart";
import AdoptAddress from "./pages/Adoptaddress";
import Adopthome from "./pages/Adopthome";
import Adoptconfirm from "./pages/Adoptconfirm";

// Public pages
import AboutUs from "./pages/Aboutus";

// Rehome pages
import Rehomestart from "./pages/Rehome/Rehomestart";
import Rehomedashboard from "./pages/Rehome/Rehomedashboard";
import Rehomemsg from "./pages/Rehome/Rehomemsg";

// Auth pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import { setAuthToken } from "./services/api";

// Layout wrapper — Navbar + page + Footer
function Layout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white  ">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

// Simple 404 page
function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

export default function App() {
  // Restore token from localStorage on app mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Routes>
      {/* Main layout wrapper */}
      <Route path="/" element={<Layout />}>
        {/* ⭐ Default Landing Page ⭐ */}
        <Route index element={<Home />} /> {/* 👈 THIS LOADS FIRST */}

        {/* Public Routes */}
        <Route path="about" element={<AboutUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          {/* Adopt Routes */}
          <Route path="adopt" element={<AdoptStart />} />
          <Route path="adopt/address" element={<AdoptAddress />} />
          <Route path="adopt/home" element={<Adopthome />} />
          <Route path="adopt/confirm" element={<Adoptconfirm />} />

          {/* Rehome Routes */}
          <Route path="rehome" element={<Rehomestart />} />
          <Route path="rehome/dashboard" element={<Rehomedashboard />} />
          <Route path="rehome/notification" element={<Rehomemsg />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
