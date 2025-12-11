import ChatbotButton from "./components/ChatbotButton";
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
import AdoptForm from "./pages/AdoptForm";

// Rehome pages
import Rehomestart from "./pages/Rehome/Rehomestart";
import Rehomedashboard from "./pages/Rehome/Rehomedashboard";
import Rehomemsg from "./pages/Rehome/Rehomemsg";
import Rehomeconfirm from "./pages/Rehome/Rehomeconfirm";

// Admin pages
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ApprovedPets from "./pages/Admin/ApprovedPets";
import RejectedPets from "./pages/Admin/RejectedPets";
import AdminPendingAdoptions from "./pages/Admin/AdminPendingAdoptions";
import ApprovedAdoptions from "./pages/Admin/ApprovedAdoptions";
import RejectedAdoptions from "./pages/Admin/RejectedAdoptions";

// Search pages
import SearchPets from "./pages/search/SearchPets";
import PetDetail from "./pages/search/PetDetail";


// ✅ Layout component — Navbar + Content + Footer + Chatbot
function Layout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
        <Outlet />
      </div>

      {!isAdminRoute && <Footer />}

      {/* ✅ Chatbot always available */}
      <ChatbotButton />
    </>
  );
}

// ✅ Simple 404 page
function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        
        {/* ✅ Default Landing Page */}
        <Route index element={<Home />} />

        {/* ✅ Public Routes */}
        <Route path="about" element={<AboutUs />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="search" element={<SearchPets />} />
        <Route path="pet/:id" element={<PetDetail />} />

        {/* ✅ User Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="adopt/*" element={<AdoptForm />} />

          {/* Rehome Pages */}
          <Route path="rehome" element={<Rehomestart />} />
          <Route path="rehome/dashboard" element={<Rehomedashboard />} />
          <Route path="rehome/notification" element={<Rehomemsg />} />
          <Route path="rehome/confirm" element={<Rehomeconfirm />} />
        </Route>

        {/* ✅ Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/approved" element={<ApprovedPets />} />
          <Route path="admin/rejected" element={<RejectedPets />} />
          <Route path="admin/adoptions" element={<AdminPendingAdoptions />} />
          <Route path="admin/adoptions/approved" element={<ApprovedAdoptions />} />
          <Route path="admin/adoptions/rejected" element={<RejectedAdoptions />} />
        </Route>

        {/* ✅ 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
