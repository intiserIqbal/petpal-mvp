import { Routes, Route, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Rehomeconfirm from "./pages/Rehome/Rehomeconfirm";


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

// Admin page
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminNavbar from "./components/AdminNavbar";

// Layout wrapper — Navbar + page + Footer
function Layout() {

const location = useLocation();

  // Show admin navbar if route starts with "/admin"
  const isAdminRoute = location.pathname.startsWith("/admin");



  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Outlet />
      </div>
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
      {/* Main layout wrapper */}
      <Route path="/" element={<Layout />}>

        {/* ⭐ Default Landing Page ⭐ */}
        <Route index element={<Home />} />  

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
          <Route path="rehome/confirm" element={<Rehomeconfirm />} />

          {/* Admin Route — only visible for admins */}
          <Route path="admin" element={<AdminDashboard />} />

        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
