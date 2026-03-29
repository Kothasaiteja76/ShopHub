import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingBag, TrendingUp, ArrowRight, Clock, CheckCircle, Truck, XCircle, RotateCcw } from "lucide-react";
import API from "../../api/axios";

const statusConfig = {
  pending:    { color: "var(--orange)",  bg: "var(--orange-light)",  label: "Pending" },
  processing: { color: "var(--primary)", bg: "var(--primary-light)", label: "Processing" },
  shipped:    { color: "#7b1fa2",        bg: "#f3e5f5",              label: "Shipped" },
  delivered:  { color: "var(--green)",   bg: "var(--green-light)",   label: "Delivered" },
  cancelled:  { color: "var(--accent)",  bg: "var(--accent-light)",  label: "Cancelled" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, o] = await Promise.all([
          API.get("/api/admin/dashboard"),
          API.get("/api/admin/orders"),
        ]);
        setStats(s.data.dashboard);
        setOrders(o.data.orders.slice(0, 8));
      } catch {}
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const statCards = stats ? [
    { label: "Total Revenue", value: `₹${(stats.totalRevenue * 83).toLocaleString()}`, icon: <TrendingUp size={22} />, color: "var(--green)", bg: "var(--green-light)", change: "+12.5%" },
    { label: "Total Orders", value: stats.totalOrders.toLocaleString(), icon: <ShoppingBag size={22} />, color: "var(--primary)", bg: "var(--primary-light)", change: "+8.2%" },
    { label: "Total Products", value: stats.totalProducts.toLocaleString(), icon: <Package size={22} />, color: "#7b1fa2", bg: "#f3e5f5", change: "+4.1%" },
    { label: "Total Customers", value: stats.totalUsers.toLocaleString(), icon: <Users size={22} />, color: "var(--orange)", bg: "var(--orange-light)", change: "+15.3%" },
  ] : [];

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 2 }}>Admin Dashboard</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "Products", to: "/admin/products" },
              { label: "Orders", to: "/admin/orders" },
              { label: "Users", to: "/admin/users" },
            ].map(({ label, to }) => (
              <Link key={to} to={to} className="btn btn-outline" style={{ borderRadius: 2, padding: "8px 16px", fontSize: 13 }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>

        {/* Stat Cards */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, height: 100 }}>
                <div className="skeleton" style={{ height: 14, width: "50%", marginBottom: 12, borderRadius: 3 }} />
                <div className="skeleton" style={{ height: 28, width: "70%", borderRadius: 3 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>
            {statCards.map(({ label, value, icon, color, bg, change }) => (
              <div key={label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, transition: "var(--transition)" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color }}>
                    {icon}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", background: "var(--green-light)", padding: "3px 8px", borderRadius: 100 }}>
                    {change}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>{label}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "var(--text)" }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>

          {/* Recent Orders */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 16, fontWeight: 700 }}>Recent Orders</span>
              <Link to="/admin/orders" style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa" }}>
                  {["Order ID", "Items", "Amount", "Status", "Date"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}><td colSpan={5} style={{ padding: "12px 16px" }}>
                      <div className="skeleton" style={{ height: 12, borderRadius: 3 }} />
                    </td></tr>
                  ))
                ) : orders.map((order, i) => {
                  const cfg = statusConfig[order.status] || statusConfig.pending;
                  return (
                    <tr key={order._id} style={{ borderBottom: i < orders.length - 1 ? "1px solid var(--border-light)" : "none", transition: "var(--transition)" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: "var(--primary)" }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{order.items?.length} item{order.items?.length > 1 ? "s" : ""}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700 }}>₹{(order.totalAmount * 83).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Order Status Breakdown */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Order Status</p>
              {Object.entries(statusConfig).map(([status, cfg]) => {
                const count = orders.filter(o => o.status === status).length;
                const total = orders.length || 1;
                return (
                  <div key={status} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(count / total) * 100}%`, height: "100%", background: cfg.color, borderRadius: 3, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Links */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <p style={{ fontSize: 14, fontWeight: 700, padding: "14px 18px", borderBottom: "1px solid var(--border-light)" }}>Quick Actions</p>
              {[
                { label: "Manage Products", to: "/admin/products", icon: <Package size={15} />, color: "#7b1fa2" },
                { label: "Manage Orders", to: "/admin/orders", icon: <ShoppingBag size={15} />, color: "var(--primary)" },
                { label: "Manage Users", to: "/admin/users", icon: <Users size={15} />, color: "var(--green)" },
              ].map(({ label, to, icon, color }) => (
                <Link key={to} to={to}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", fontSize: 14, fontWeight: 500, color: "var(--text)", borderBottom: "1px solid var(--border-light)", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: 10, color }}>{icon} <span style={{ color: "var(--text)" }}>{label}</span></span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}