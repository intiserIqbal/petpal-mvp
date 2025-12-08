import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className=" border shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src="/petpal.png" alt="PetPal Logo" className="h-14 w-14 object-contain   " />
          <h1 className="text-2xl font-bold tracking-wide drop-shadow-md bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-300 to-blue-400">
  Admin Dashboard
</h1>

        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-4">
          {[
            { name: "Pending Pets", path: "/admin" },
            { name: "Approved Pets", path: "/admin/approved" },
            { name: "Rejected Pets", path: "/admin/rejected" },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md ${
                  isActive
                    ? "bg-white text-blue-700 scale-105"
                    : "bg-blue-600 text-white hover:bg-blue-400/80 hover:scale-105"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg shadow-lg hover:bg-blue-100 transition-all duration-300 hover:scale-105"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
