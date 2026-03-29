import { useState, useEffect } from "react";
import { Search, ChevronDown, Package } from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const statusConfig = {
  pending:    { color: "var(--orange)",  bg: "var(--orange-light)" },
  processing: { color: "var(--primary)", bg: "var(--primary-light)" },
  shipped:    { color: "#7b1fa2",        bg: "#f3e5f5" },
  delivered:  { color: "var(--green)",   bg: "var(--green-light)" },
  cancelled:  { color: "var(--accent)",  bg: "var(--accent-light)" },
};

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/api/admin/orders");
        setOrders(data.orders);
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdating(prev => ({ ...prev, [id]: true }));
    try {
      await API.put(`/api/admin/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
      toast.success("Order status updated!");
    } catch { toast.error("Update failed"); }
    finally { setUpdating(prev => ({ ...prev, [id]: false })); }
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = !search || o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>Order Management</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{orders.length} total orders</p>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input className="input-field" placeholder="Search by ID or email..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36, width: 260, fontSize: 13 }} />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>

        {/* Filter Tabs */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius) var(--radius) 0 0", display: "flex", overflowX: "auto", borderBottom: "none" }}>
          {["all", ...statuses].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "12px 18px", fontSize: 13, fontWeight: filter === s ? 700 : 500, color: filter === s ? "var(--primary)" : "var(--text-secondary)", borderBottom: filter === s ? "2px solid var(--primary)" : "2px solid transparent", whiteSpace: "nowrap", textTransform: "capitalize", background: "transparent", transition: "var(--transition)" }}>
              {s === "all" ? "All" : s}
              <span style={{ marginLeft: 6, background: filter === s ? "var(--primary)" : "var(--border)", color: filter === s ? "#fff" : "var(--text-muted)", borderRadius: 100, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                {s === "all" ? orders.length : orders.filter(o => o.status === s).length}
              </span>
            </button>
          ))}
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "0 0 var(--radius) var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: "1px solid var(--border)" }}>
                {["Order ID", "Customer", "Items", "Amount", "Date", "Status", "Update Status"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} style={{ padding: "14px" }}>
                        <div className="skeleton" style={{ height: 13, borderRadius: 3 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 8px", display: "block" }} />
                  No orders found
                </td></tr>
              ) : filtered.map((order, i) => {
                const cfg = statusConfig[order.status] || statusConfig.pending;
                return (
                  <tr key={order._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-light)" : "none", transition: "var(--transition)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 14px", fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "var(--primary)" }}>
                      #{order._id.slice(-7).toUpperCase()}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{order.user?.username || "—"}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{order.user?.email}</p>
                    </td>
                    <td style={{ padding: "12px 14px", fontSize: 13 }}>{order.items?.length}</td>
                    <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700 }}>₹{(order.totalAmount * 83).toLocaleString()}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12, color: "var(--text-muted)" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, textTransform: "capitalize" }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      {updating[order._id] ? (
                        <div className="spinner" style={{ width: 16, height: 16 }} />
                      ) : (
                        <div style={{ position: "relative", display: "inline-block" }}>
                          <select value={order.status}
                            onChange={e => updateStatus(order._id, e.target.value)}
                            style={{ appearance: "none", padding: "6px 28px 6px 10px", fontSize: 12, fontWeight: 600, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", background: "#fff", cursor: "pointer", color: "var(--text)" }}>
                            {statuses.map(s => <option key={s} value={s} style={{ textTransform: "capitalize" }}>{s}</option>)}
                          </select>
                          <ChevronDown size={12} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}