import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar"; 
import Footer from "./components/Footer";
import AdoptStart from "./pages/Adoptstart.tsx";
import AdoptAddress from "./pages/Adoptaddress.tsx";
import Adopthome from "./pages/Adopthome.tsx";
import Adoptconfirm from "./pages/Adoptconfirm.tsx";
import AboutUs from "./pages/Aboutus.tsx";

// Layout component for shared UI
function Layout() {
  return (
    <>
      <Navbar/>
      <div>
      <Outlet /> {/* Renders the matched child route */}
      </div>
      <Footer/>
    </>
  );
}

// 404 Page Component
function NotFound() {
  return <h2>404 - Page Not Found</h2>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Home />} />      {/* "/" */}

        <Route path="auth" element={<Auth />} />  {/* "/auth" */}
        <Route path="adopt/address" element={<AdoptAddress />} />

        <Route path="adopt" element={<AdoptStart />} /> {/* ⭐ NEW ROUTE */}
        <Route path="adopt/home" element={<Adopthome/>} />
        <Route path="adopt/confirm" element={<Adoptconfirm/>} />
        <Route path="about" element={<AboutUs/>} />

        <Route path="*" element={<NotFound />} /> {/* Catch-all */}
      </Route>
    </Routes>
  );
}

