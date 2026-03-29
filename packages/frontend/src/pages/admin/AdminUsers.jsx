import { useState, useEffect } from "react";
import { Search, Users, ToggleLeft, ToggleRight, Shield } from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [toggling, setToggling] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/api/admin/users");
        setUsers(data.users);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const toggleUser = async (id) => {
    setToggling(prev => ({ ...prev, [id]: true }));
    try {
      const { data } = await API.put(`/api/admin/users/${id}/toggle-active`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch { toast.error("Failed to update user"); }
    finally { setToggling(prev => ({ ...prev, [id]: false })); }
  };

  const filtered = users.filter(u => {
    const matchFilter = filter === "all" || (filter === "active" ? u.isActive : !u.isActive) || (filter === "admin" ? u.role === "admin" : true);
    const matchSearch = !search || u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()) || u.fullName?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>User Management</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{users.length} registered users</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input-field" placeholder="Search users..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 240, fontSize: 13 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>

        {/* Filter Tabs */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius) var(--radius) 0 0", display: "flex", borderBottom: "none" }}>
          {[
            { key: "all", label: "All Users", count: users.length },
            { key: "active", label: "Active", count: users.filter(u => u.isActive).length },
            { key: "inactive", label: "Inactive", count: users.filter(u => !u.isActive).length },
            { key: "admin", label: "Admins", count: users.filter(u => u.role === "admin").length },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilter(key)}
              style={{ padding: "12px 18px", fontSize: 13, fontWeight: filter === key ? 700 : 500, color: filter === key ? "var(--primary)" : "var(--text-secondary)", borderBottom: filter === key ? "2px solid var(--primary)" : "2px solid transparent", whiteSpace: "nowrap", background: "transparent", transition: "var(--transition)" }}>
              {label}
              <span style={{ marginLeft: 6, background: filter === key ? "var(--primary)" : "var(--border)", color: filter === key ? "#fff" : "var(--text-muted)", borderRadius: 100, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "0 0 var(--radius) var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: "1px solid var(--border)" }}>
                {["User", "Email", "Role", "Joined", "Status", "Action"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <div className="skeleton" style={{ height: 13, borderRadius: 3 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                  <Users size={32} style={{ margin: "0 auto 8px", display: "block" }} />
                  No users found
                </td></tr>
              ) : filtered.map((user, i) => (
                <tr key={user._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-light)" : "none", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: user.role === "admin" ? "var(--orange-light)" : "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: user.role === "admin" ? "var(--orange)" : "var(--primary)", flexShrink: 0 }}>
                        {user.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{user.fullName}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-secondary)" }}>{user.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: user.role === "admin" ? "var(--orange-light)" : "var(--primary-light)", color: user.role === "admin" ? "var(--orange)" : "var(--primary)" }}>
                      {user.role === "admin" && <Shield size={10} />}
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)" }}>
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: user.isActive ? "var(--green-light)" : "var(--accent-light)", color: user.isActive ? "var(--green)" : "var(--accent)" }}>
                      {user.isActive ? "● Active" : "● Inactive"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {user.role !== "admin" && (
                      <button onClick={() => toggleUser(user._id)} disabled={toggling[user._id]}
                        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: user.isActive ? "var(--accent)" : "var(--green)", background: user.isActive ? "var(--accent-light)" : "var(--green-light)", border: "none", borderRadius: "var(--radius-sm)", padding: "6px 12px", cursor: "pointer", transition: "var(--transition)" }}>
                        {toggling[user._id] ? <div className="spinner" style={{ width: 14, height: 14 }} /> : user.isActive ? <><ToggleLeft size={14} /> Deactivate</> : <><ToggleRight size={14} /> Activate</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}