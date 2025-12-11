import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState<"pets"|"adoptions"|null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img src="/petpal.png" alt="PetPal Logo" className="h-12 w-12 object-contain" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-300 to-blue-400">
              Admin Dashboard
            </h1>
          </div>

          {/* Navigation menus */}
          <nav className="flex items-center gap-6" ref={menuRef}>
            {/* Pets dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(menuOpen === "pets" ? null : "pets")}
                className="px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Rehome Pets ▾
              </button>
              {menuOpen === "pets" && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg py-1">
                  <NavLink
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Pending Pets</NavLink>
                  <NavLink
                    to="/admin/approved"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Approved Pets</NavLink>
                  <NavLink
                    to="/admin/rejected"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Rejected Pets</NavLink>
                </div>
              )}
            </div>

            {/* Adoptions dropdown */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(menuOpen === "adoptions" ? null : "adoptions")}
                className="px-3 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Adoptions ▾
              </button>
              {menuOpen === "adoptions" && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-1">
                  <NavLink
                    to="/admin/adoptions"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Pending Requests</NavLink>
                  <NavLink
                    to="/admin/adoptions/approved"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Approved Adoptions</NavLink>
                  <NavLink
                    to="/admin/adoptions/rejected"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(null)}
                  >Rejected Adoptions</NavLink>
                </div>
              )}
            </div>
          </nav>

          {/* Logout button */}
          <div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
