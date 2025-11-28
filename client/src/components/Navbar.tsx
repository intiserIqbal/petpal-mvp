import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border rounded-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/Petpal.png" className="h-12" alt="PetPal Logo" />
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium">
          <NavLink
            to="/adopt"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            Adopt
          </NavLink>

          <NavLink
            to="/rehome"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
        >
          Rehome
          </NavLink>

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

        {/* Search + Profile */}
        <div className="flex items-center">
          <div className="hidden md:block">
            <input
              className="border border-slate-200 rounded-full px-3 py-1 text-sm"
              placeholder="search ..."
            />
          </div>

          <button className="p-2 rounded-full hover:bg-slate-100" title="Notifications">
            🔔
          </button>

          <div className="relative group">
  <button className="flex items-center space-x-2 px-4 py-2 border border-slate-200 rounded-full hover:bg-slate-100 transition">
    <img src="/person.png" className="h-10 rounded-full" />
    <span className="hidden sm:inline text-sm">Login / Register</span>
  </button>

  {/* Dropdown */}
  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
    <ul className="py-2 text-sm">
      <li className="px-4 py-2 hover:bg-slate-100 cursor-pointer">Adopt</li>
      <li className="px-4 py-2 hover:bg-slate-100 cursor-pointer">Rehome</li>
      <li className="px-4 py-2 hover:bg-slate-100 cursor-pointer">Vet Portal</li>
      
      {/* Admin is optional — show only if needed */}
      <li className="px-4 py-2 hover:bg-slate-100 cursor-pointer text-red-500 font-medium">
        Admin Login
      </li>
    </ul>
  </div>
</div>

        </div>
      </div>
    </header>
  );
}
