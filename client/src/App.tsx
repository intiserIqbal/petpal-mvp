import { Routes, Route, Outlet } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdoptStart from "./pages/Adoptstart";
import AdoptAddress from "./pages/Adoptaddress";
import Adopthome from "./pages/Adopthome";
import Adoptconfirm from "./pages/Adoptconfirm";

import AboutUs from "./pages/Aboutus";

import Rehomestart from "./pages/Rehome/Rehomestart";
import Rehomedashboard from "./pages/Rehome/Rehomedashboard";
import Rehomemsg from "./pages/Rehome/Rehomemsg";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// Layout Component
function Layout() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public */}
        
        <Route path="about" element={<AboutUs />} />

        {/* Auth */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Adopt */}
        <Route path="adopt" element={<AdoptStart />} />
        <Route path="adopt/address" element={<AdoptAddress />} />
        <Route path="adopt/home" element={<Adopthome />} />
        <Route path="adopt/confirm" element={<Adoptconfirm />} />

        {/* Rehome */}
        <Route path="rehome" element={<Rehomestart />} />
        <Route path="rehome/dashboard" element={<Rehomedashboard />} />
        <Route path="rehome/notification" element={<Rehomemsg />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
