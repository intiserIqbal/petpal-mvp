import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./components/AdminNavbar";

// Public pages
import Home from "./pages/Home";
import AboutUs from "./pages/Aboutus";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Adopt pages
import AdoptStart from "./pages/Adoptstart";
import AdoptAddress from "./pages/Adoptaddress";
import Adopthome from "./pages/Adopthome";
import Adoptconfirm from "./pages/Adoptconfirm";

// Rehome pages
import Rehomestart from "./pages/Rehome/Rehomestart";
import Rehomedashboard from "./pages/Rehome/Rehomedashboard";
import Rehomemsg from "./pages/Rehome/Rehomemsg";
import Rehomeconfirm from "./pages/Rehome/Rehomeconfirm";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";

// If you have more admin pages, like Approved or Rejected, import them here:
 import ApprovedPets from "./pages/Admin/ApprovedPets";
import RejectedPets from "./pages/Admin/RejectedPets";

// Layout component — Navbar + Content + Footer
function Layout() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* if admin route -> AdminNavbar else main Navbar */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      {/* Main content area */}
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Outlet />
      </div>

      {/* Hide footer only on admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

// Simple 404 page
function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <Routes>
      {/* Wrap everything in main layout */}
      <Route path="/" element={<Layout />}>

        {/* Default Landing Page */}
        <Route index element={<Home />} />

        {/* Public Routes */}
        <Route path="about" element={<AboutUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* User Protected Routes */}
        <Route element={<PrivateRoute />}>

          {/* Adopt Pages */}
          <Route path="adopt" element={<AdoptStart />} />
          <Route path="adopt/address" element={<AdoptAddress />} />
          <Route path="adopt/home" element={<Adopthome />} />
          <Route path="adopt/confirm" element={<Adoptconfirm />} />

          {/* Rehome Pages */}
          <Route path="rehome" element={<Rehomestart />} />
          <Route path="rehome/dashboard" element={<Rehomedashboard />} />
          <Route path="rehome/notification" element={<Rehomemsg />} />
          <Route path="rehome/confirm" element={<Rehomeconfirm />} />
        </Route>

        {/* ADMIN ROUTES — Works only if logged in & role = admin */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          {/* Add more admin routes if needed */}
           <Route path="admin/approved" element={<ApprovedPets />} /> 
           <Route path="admin/rejected" element={<RejectedPets />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
