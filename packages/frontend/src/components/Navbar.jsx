import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, ChevronDown, Package, LogOut, LayoutDashboard, Heart, Bell, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const categories = ["Electronics", "Fashion", "Home", "Books", "Sports", "Beauty", "Toys", "Food"];

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = async (val) => {
    setQuery(val);
    if (val.length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const { data } = await API.get(`/api/products/search?q=${val}`);
      setSuggestions(data.products.slice(0, 6));
      setShowSuggestions(true);
    } catch { setSuggestions([]); }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) { navigate(`/products?search=${query}`); setShowSuggestions(false); }
  };

  const handleLogout = () => { logout(); toast.success("Logged out!"); navigate("/"); setUserMenu(false); };

  return (
    <>
      {/* Main Navbar */}
      <nav style={{ background: "var(--primary)", position: "sticky", top: 0, zIndex: 1000, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 16, height: 60 }}>

          {/* Logo */}
          <Link to="/" style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.5px" }}>
              Shop<span style={{ color: "#ffe033" }}>Hub</span>
            </span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontStyle: "italic", letterSpacing: "0.5px" }}>
              Explore Plus ✦
            </span>
          </Link>

          {/* Search Bar */}
          <div ref={searchRef} style={{ flex: 1, maxWidth: 600, position: "relative" }}>
            <form onSubmit={submitSearch} style={{ display: "flex" }}>
              <input
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => query.length > 1 && setShowSuggestions(true)}
                placeholder="Search for products, brands and more"
                style={{
                  width: "100%", padding: "10px 16px", border: "none", outline: "none",
                  fontSize: 14, borderRadius: "2px 0 0 2px", color: "var(--text)",
                  background: "#fff",
                }}
              />
              <button type="submit" style={{
                background: "#ffe033", border: "none", padding: "0 20px",
                borderRadius: "0 2px 2px 0", cursor: "pointer", color: "var(--primary)",
                display: "flex", alignItems: "center",
              }}>
                <Search size={18} strokeWidth={2.5} />
              </button>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "#fff", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-lg)",
                zIndex: 1001, overflow: "hidden", animation: "slideDown 0.15s ease",
              }}>
                {suggestions.map(p => (
                  <Link key={p._id} to={`/products/${p._id}`} onClick={() => { setShowSuggestions(false); setQuery(""); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid var(--border-light)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <Search size={14} color="var(--text-muted)" />
                    <span style={{ fontSize: 14, color: "var(--text)" }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>{p.category}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>

            {/* User Menu */}
            <div ref={userMenuRef} style={{ position: "relative" }}>
              <button
                onClick={() => user ? setUserMenu(!userMenu) : navigate("/login")}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 14px", color: "#fff", borderRadius: "var(--radius-sm)", transition: "var(--transition)", minWidth: 72 }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                  {user ? `Hello, ${user.username}` : "Login"}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 13, fontWeight: 700 }}>
                  {user ? "Account" : "Sign In"} <ChevronDown size={12} />
                </span>
              </button>

              {userMenu && user && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)",
                  border: "1px solid var(--border)", minWidth: 200, zIndex: 1001,
                  animation: "slideDown 0.15s ease", overflow: "hidden",
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-light)", background: "var(--primary-light)" }}>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{user.fullName}</p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{user.email}</p>
                  </div>
                  {[
                    { icon: <User size={15} />, label: "My Profile", to: "/profile" },
                    { icon: <Package size={15} />, label: "My Orders", to: "/orders" },
                    ...(isAdmin ? [{ icon: <LayoutDashboard size={15} />, label: "Admin Panel", to: "/admin" }] : []),
                  ].map(({ icon, label, to }) => (
                    <Link key={to} to={to} onClick={() => setUserMenu(false)}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: 13, color: "var(--text)", borderBottom: "1px solid var(--border-light)", transition: "var(--transition)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    >
                      <span style={{ color: "var(--primary)" }}>{icon}</span> {label}
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: 13, color: "var(--accent)", width: "100%", transition: "var(--transition)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to={user ? "/cart" : "/login"}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 14px", color: "#fff", borderRadius: "var(--radius-sm)", transition: "var(--transition)", position: "relative", minWidth: 64 }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ position: "relative" }}>
                <ShoppingCart size={22} strokeWidth={2} />
                {cartCount > 0 && (
                  <span style={{
                    position: "absolute", top: -8, right: -8,
                    background: "#ffe033", color: "var(--primary)",
                    width: 18, height: 18, borderRadius: "50%",
                    fontSize: 10, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{cartCount}</span>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, marginTop: 1 }}>Cart</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Category Sub-Nav */}
      <div style={{ background: "#1a65d6", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", height: 40 }}>
          {categories.map(cat => (
            <Link key={cat} to={`/products?category=${cat}`}
              style={{ padding: "0 14px", color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", height: "100%", display: "flex", alignItems: "center", transition: "var(--transition)", borderBottom: "2px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderBottomColor = "#ffe033"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderBottomColor = "transparent"; }}
            >{cat}</Link>
          ))}
          <Link to="/products"
            style={{ padding: "0 14px", color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", height: "100%", display: "flex", alignItems: "center" }}
          >More ›</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;