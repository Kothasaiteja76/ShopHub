import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Search, Truck, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react";
import API from "../api/axios";

const statusConfig = {
  pending:    { label: "Order Placed",  color: "var(--orange)",  bg: "var(--orange-light)",  icon: <Clock size={14} /> },
  processing: { label: "Processing",    color: "var(--primary)", bg: "var(--primary-light)", icon: <RotateCcw size={14} /> },
  shipped:    { label: "Shipped",       color: "#7b1fa2",        bg: "#f3e5f5",              icon: <Truck size={14} /> },
  delivered:  { label: "Delivered",     color: "var(--green)",   bg: "var(--green-light)",   icon: <CheckCircle size={14} /> },
  cancelled:  { label: "Cancelled",     color: "var(--accent)",  bg: "var(--accent-light)",  icon: <XCircle size={14} /> },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const StepTracker = ({ status }) => {
  const steps = ["pending", "processing", "shipped", "delivered"];
  const current = steps.indexOf(status);
  if (status === "cancelled") return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0" }}>
      <XCircle size={16} color="var(--accent)" />
      <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>Order Cancelled</span>
    </div>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 12 }}>
      {steps.map((s, i) => {
        const done = i <= current;
        const active = i === current;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: done ? "var(--green)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", border: active ? "2px solid var(--green)" : "none", transition: "var(--transition)" }}>
                {done && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 10, fontWeight: done ? 700 : 400, color: done ? "var(--green)" : "var(--text-muted)", whiteSpace: "nowrap", textTransform: "capitalize" }}>
                {s === "pending" ? "Placed" : s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < current ? "var(--green)" : "var(--border)", margin: "0 4px", marginBottom: 14, transition: "var(--transition)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get("/api/orders");
        setOrders(data.orders);
      }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filtered = orders.filter(o => {
    const matchFilter = filter === "all" || o.status === filter;
    const matchSearch = !search || o._id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const filterTabs = [
    { key: "all", label: "All Orders" },
    { key: "pending", label: "Pending" },
    { key: "processing", label: "Processing" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingTop: 24 }}>
      <div className="container">
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24, marginBottom: 12 }}>
            <div className="skeleton" style={{ height: 16, width: "30%", marginBottom: 12, borderRadius: 3 }} />
            <div className="skeleton" style={{ height: 12, width: "60%", marginBottom: 8, borderRadius: 3 }} />
            <div className="skeleton" style={{ height: 12, width: "40%", borderRadius: 3 }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>My Orders</h1>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input-field" placeholder="Search by Order ID" value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 240, fontSize: 13 }} />
            </div>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: 0, marginTop: 16, borderBottom: "1px solid var(--border-light)", overflowX: "auto" }}>
            {filterTabs.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{ padding: "10px 18px", fontSize: 13, fontWeight: filter === key ? 700 : 500, color: filter === key ? "var(--primary)" : "var(--text-secondary)", borderBottom: filter === key ? "2px solid var(--primary)" : "2px solid transparent", whiteSpace: "nowrap", transition: "var(--transition)", background: "transparent" }}>
                {label}
                <span style={{ marginLeft: 6, background: filter === key ? "var(--primary)" : "var(--border)", color: filter === key ? "#fff" : "var(--text-muted)", borderRadius: 100, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                  {key === "all" ? orders.length : orders.filter(o => o.status === key).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        {filtered.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "60px 24px", textAlign: "center" }}>
            <Package size={56} color="#e0e0e0" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No orders found</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
              {filter === "all" ? "You haven't placed any orders yet" : `No ${filter} orders`}
            </p>
            <Link to="/products" className="btn btn-primary" style={{ borderRadius: 2 }}>Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((order, idx) => {
              const firstItem = order.items?.[0];
              return (
                <div key={order._id} className="fade-up" style={{ animationDelay: `${idx * 0.05}s`, background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>

                  {/* Order Header */}
                  <div style={{ padding: "12px 20px", background: "#fafafa", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Order ID</p>
                        <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace" }}>#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Date</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Total</p>
                        <p style={{ fontSize: 13, fontWeight: 700 }}>₹{(order.totalAmount * 83).toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Items</p>
                        <p style={{ fontSize: 13, fontWeight: 600 }}>{order.items?.length} item{order.items?.length > 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Order Items Preview */}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      {/* Item images */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {order.items?.slice(0, 3).map((item, i) => (
                          <div key={i} style={{ width: 64, height: 64, background: "#fafafa", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {item.product?.image
                              ? <img src={item.product.image} alt="" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                              : <Package size={24} color="#ccc" />
                            }
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div style={{ width: 64, height: 64, background: "#f5f5f5", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Item name + track */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {firstItem?.name}
                          {order.items?.length > 1 && <span style={{ color: "var(--text-muted)" }}> & {order.items.length - 1} more</span>}
                        </p>
                        <StepTracker status={order.status} />
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                        <Link to={`/orders/${order._id}`} className="btn btn-outline" style={{ borderRadius: 2, padding: "8px 20px", fontSize: 13 }}>
                          View Details <ChevronRight size={14} />
                        </Link>
                        {order.status === "delivered" && (
                          <button className="btn" style={{ borderRadius: 2, padding: "8px 20px", fontSize: 13, border: "1px solid var(--border)", color: "var(--text-secondary)", background: "#fff" }}>
                            Rate & Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}