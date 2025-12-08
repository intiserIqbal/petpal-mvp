import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface User {
  name: string;
  avatar?: string;
  role?: string; // "admin" or "user"
}

export default function Navbar() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );
  const [intent, setIntent] = useState<string | null>(localStorage.getItem("userIntent"));
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      setToken(localStorage.getItem("token"));
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setIntent(localStorage.getItem("userIntent"));
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrivateNav = (path: string) => {
    if (path === "/adopt") {
      localStorage.setItem("userIntent", "adopter");
      setIntent("adopter");
    } else if (path === "/rehome") {
      localStorage.setItem("userIntent", "rehome");
      setIntent("rehome");
    }

    setMenuOpen(false);

    if (token) navigate(path);
    else navigate(`/login?redirect=${path}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userIntent");
    setToken(null);
    setUser(null);
    setIntent(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/adopt?search=${encodeURIComponent(search)}`);
    setSearch("");
    setMenuOpen(false);
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border rounded-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/petpal.png" className="h-12" alt="PetPal Logo" />
        </div>

        <nav className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300 font-medium">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"}>Home</NavLink>
          {intent !== "rehome" && <button onClick={() => handlePrivateNav("/adopt")} className="hover:text-blue-500 font-medium">Adopt</button>}
          {intent !== "adopter" && <button onClick={() => handlePrivateNav("/rehome")} className="hover:text-blue-500 font-medium">Rehome</button>}
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"}>About Us</NavLink>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative hidden md:block mt-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search pets..."
            className="border rounded-full pl-4 pr-10 py-2 w-56 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">🔍</button>
        </form>

        {/* Right Panel */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700" title="Notifications">🔔</button>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setMenuOpen(prev => !prev)} className="px-4 py-2 border dark:border-gray-600 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2">
              {token && user ? (
                <>
                  <img src={user.avatar || "/icon.png"} alt="User" className="w-10 h-10 rounded-full border" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                </>
              ) : <span>Login / Register</span>}
              <span>▼</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 bg-white dark:bg-gray-800 border rounded shadow-lg min-w-[180px] p-1 z-50">
                {token ? (
                  <>
                    {intent === "adopter" ? (
                      <button onClick={() => handlePrivateNav("/rehome")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Rehome a Pet</button>
                    ) : intent === "rehome" ? (
                      <button onClick={() => handlePrivateNav("/adopt")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Adopt a Pet</button>
                    ) : (
                      <>
                        <button onClick={() => handlePrivateNav("/adopt")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Adopt</button>
                        <button onClick={() => handlePrivateNav("/rehome")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Rehome</button>
                      </>
                    )}
                    {isAdmin && <button onClick={() => handlePrivateNav("/admin")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Admin</button>}
                    <div className="border-t mt-1" />
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-600/20">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Login</button>
                    <button onClick={() => { navigate("/register"); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Register</button>
                    <button onClick={() => handlePrivateNav("/adopt")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Adopt</button>
                    <button onClick={() => handlePrivateNav("/rehome")} className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700">Rehome</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
