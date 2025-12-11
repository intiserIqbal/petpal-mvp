import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface User {
  name: string;
  avatar?: string;
  role?: string;
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

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifCount, setNotifCount] = useState(0);            // Rehome notifications
  const [adoptNotifCount, setAdoptNotifCount] = useState(0);  // Adoption notifications

  // Sync storage changes
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

  // 🔔 Fetch REHOME notification count
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/pets/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const unread = data.notifications?.filter((n: any) => !n.read).length || 0;
        setNotifCount(unread);
      })
      .catch(() => setNotifCount(0));
  }, [token]);

  // 🟣 Fetch ADOPTION notification count
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/adoptions/notifications", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const unread = data.notifications?.filter((n: any) => !n.read).length || 0;
        setAdoptNotifCount(unread);
      })
      .catch(() => setAdoptNotifCount(0));
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
        setSearchResults([]);
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

  const fetchSearchResults = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search fetch error:", err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?query=${encodeURIComponent(search)}`);
    setSearchResults([]);
    setSearch("");
  };

  const isAdmin = user?.role === "admin";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border rounded-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/petpal.png" className="h-12" alt="PetPal Logo" />
        </div>

        <nav className="hidden md:flex gap-8 text-gray-600 dark:text-gray-300 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            Home
          </NavLink>
          {intent !== "rehome" && (
            <button onClick={() => handlePrivateNav("/adopt")} className="hover:text-blue-500 font-medium">
              Adopt
            </button>
          )}
          {intent !== "adopter" && (
            <button onClick={() => handlePrivateNav("/rehome")} className="hover:text-blue-500 font-medium">
              Rehome
            </button>
          )}
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-500 font-semibold" : "hover:text-blue-500"
            }
          >
            About Us
          </NavLink>
        </nav>

        {/* Search */}
        <div className="relative hidden md:block mt-5" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <input
              value={search}
              onChange={(e) => fetchSearchResults(e.target.value)}
              type="text"
              placeholder="Search pets..."
              className="border rounded-full pl-4 pr-10 py-2 w-56 focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
            />

            <button
              type="submit"
              className="absolute right-2 mt-5 -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              🔍
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="absolute bg-white shadow-md border rounded-lg mt-2 w-56 max-h-64 overflow-auto z-50">
              {searchResults.map((pet) => (
                <div
                  key={pet._id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/pet/${pet._id}`)}
                >
                  <img src={pet.image} className="w-10 h-10 rounded-md object-cover" />
                  <span>{pet.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex items-center gap-4">
          
          {/* 🔔 Rehome Notifications */}
          <button
            onClick={() => navigate("/rehome/notification")}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700"
            title="Rehome Notifications"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {notifCount}
              </span>
            )}
          </button>

          {/* 🟣 Adoption Notifications */}
          <button
            onClick={() => navigate("/adopt/notification")}
            className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700"
            title="Adoption Notifications"
          >
            🐾
            {adoptNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {adoptNotifCount}
              </span>
            )}
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="px-4 py-2 border dark:border-gray-600 rounded-full hover:bg-slate-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              {token && user ? (
                <>
                  <img src={user.avatar || "/icon.png"} alt="User" className="w-10 h-10 rounded-full border" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                </>
              ) : (
                <span>Login / Register</span>
              )}
              <span>▼</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 bg-white dark:bg-gray-800 border rounded shadow-lg min-w-[180px] p-1 z-50">
                {token ? (
                  <>
                    {intent === "adopter" ? (
                      <button
                        onClick={() => handlePrivateNav("/rehome")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Rehome a Pet
                      </button>
                    ) : intent === "rehome" ? (
                      <button
                        onClick={() => handlePrivateNav("/adopt")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Adopt a Pet
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePrivateNav("/adopt")}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          Adopt
                        </button>
                        <button
                          onClick={() => handlePrivateNav("/rehome")}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          Rehome
                        </button>
                      </>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => handlePrivateNav("/admin")}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Admin
                      </button>
                    )}

                    <div className="border-t mt-1" />

                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-600/20"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("/login");
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      Register
                    </button>
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
