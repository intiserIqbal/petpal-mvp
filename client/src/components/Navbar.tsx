import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
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
            to="/how-it-works"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            How It Works
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

          <button className="flex items-center space-x-2 px-3 py-1 border border-slate-200 rounded-full">
            <img src="/person.png" className="h-12" />
            <span className="hidden sm:inline text-sm">Samanta Smith</span>
          </button>
        </div>
      </div>
    </header>
  );
}
