import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  // Detect login/logout change automatically
  useEffect(() => {
    const handler = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const handlePrivateNav = (path: string) => {
    if (token) {
      navigate(path);
    } else {
      navigate(`/login?redirect=${path}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border rounded-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/Petpal.png" className="h-12" alt="PetPal Logo" />
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            Home
          </NavLink>

          <button onClick={() => handlePrivateNav("/adopt")} className="hover:text-blue-500 font-medium">
            Adopt
          </button>

          <button onClick={() => handlePrivateNav("/rehome")} className="hover:text-blue-500 font-medium">
            Rehome
          </button>

          <NavLink
            to="/vet"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            Vet
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            About Us
          </NavLink>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700" title="Notifications">
            🔔
          </button>

         

          {/* Login / Logout */}
          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 border border-slate-200 dark:border-gray-600 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700"
            >
              Login / Register
            </button>
          ) : (
            <button
              onClick={logout}
              className="px-4 py-2 border border-red-400 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-600/20"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
