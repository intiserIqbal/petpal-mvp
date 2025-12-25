import { NavLink, useNavigate, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "../context/NotificationContext";

interface User {
  name: string;
  avatar?: string;
  role?: string;
}

export default function Navbar() {
  const { adoptNotifCount } = useNotification();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );
  const [intent, setIntent] = useState<string | null>(localStorage.getItem("userIntent"));
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [notifCount, setNotifCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState<number>(0);

  useEffect(() => {
    const updateWishlistCount = () => {
      const stored = localStorage.getItem("wishlist");
      if (stored) setWishlistCount(JSON.parse(stored).length);
      else setWishlistCount(0);
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    return () => window.removeEventListener("storage", updateWishlistCount);
  }, []);

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        searchRef.current && !searchRef.current.contains(e.target as Node)
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
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
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
      console.error(err);
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
    <header className="bg-white shadow-sm border rounded-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <img src="/petpal.png" className="h-12" alt="PetPal" />

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-gray-600 font-medium items-center">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-500 font-semibold" : ""}>Home</NavLink>
          {intent !== "rehome" && <button onClick={() => handlePrivateNav("/adopt")}>Adopt</button>}
          {intent !== "adopter" && <button onClick={() => handlePrivateNav("/rehome")}>Rehome</button>}
          <NavLink to="/about">About Us</NavLink>

          {/* Search */}
          <div className="relative ml-4" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                value={search}
                onChange={(e) => fetchSearchResults(e.target.value)}
                type="text"
                placeholder="Search pets..."
                className="border rounded-full pl-4 pr-10 py-2 w-56 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 mt-4"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">🔍</button>
            </form>
            {searchResults.length > 0 && (
              <div className="absolute bg-white shadow-md border rounded-lg mt-2 w-56 max-h-64 overflow-auto z-50">
                {searchResults.map((pet) => (
                  <div
                    key={pet._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/pet/${pet._id}`);
                      setSearchResults([]);
                      setSearch("");
                    }}
                  >
                    <img src={pet.image} className="w-10 h-10 rounded-md object-cover" />
                    <span>{pet.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right panel */}
        <div className="flex items-center gap-3">

          {/* Wishlist */}
          <button
            onClick={() => navigate("/wishlist")}
            className="relative hidden md:block p-2 rounded-full hover:bg-gray-100"
            title="Wishlist"
          >
            ❤️
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={() => navigate("/rehome/notification")}
            className="relative hidden md:block p-2 rounded-full hover:bg-gray-100"
          >
            🔔
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 rounded-full">
                {notifCount}
              </span>
            )}
          </button>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="px-4 py-2 border rounded-full flex items-center gap-2"
            >
              {user ? <span>{user.name}</span> : "Login / Register"} ▼
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md min-w-[180px] z-50">
                {token ? (
                  <>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">Wishlist ❤️</Link>
                    <Link to="/adopt" className="block px-4 py-2 hover:bg-gray-100">Adopt</Link>
                    <Link to="/rehome" className="block px-4 py-2 hover:bg-gray-100">Rehome</Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin</Link>
                    )}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-100">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { navigate("/login"); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Login</button>
                    <button onClick={() => { navigate("/register"); setMenuOpen(false); }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Register</button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 border-t relative z-50">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
          <button onClick={() => navigate("/adopt")}>Adopt</button>
          <button onClick={() => navigate("/rehome")}>Rehome</button>
          <button onClick={() => navigate("/wishlist")}>Wishlist ❤️</button>
          <button onClick={() => navigate("/rehome/notification")}>Notifications 🔔</button>

          <div className="relative mt-2" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input
                value={search}
                onChange={(e) => fetchSearchResults(e.target.value)}
                type="text"
                placeholder="Search pets..."
                className="border rounded-full pl-4 pr-10 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-500">🔍</button>
            </form>
            {searchResults.length > 0 && (
              <div className="absolute bg-white shadow-md border rounded-lg mt-2 w-full max-h-64 overflow-auto z-50">
                {searchResults.map((pet) => (
                  <div
                    key={pet._id}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/pet/${pet._id}`);
                      setSearchResults([]);
                      setSearch("");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <img src={pet.image} className="w-10 h-10 rounded-md object-cover" />
                    <span>{pet.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
