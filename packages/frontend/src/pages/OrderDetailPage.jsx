import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Package, MapPin, CreditCard, ChevronRight, XCircle, Truck, CheckCircle, Clock, RotateCcw, ArrowLeft } from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";

const statusConfig = {
  pending:    { label: "Order Placed",  color: "var(--orange)",  bg: "var(--orange-light)",  icon: <Clock size={16} /> },
  processing: { label: "Processing",    color: "var(--primary)", bg: "var(--primary-light)", icon: <RotateCcw size={16} /> },
  shipped:    { label: "Shipped",       color: "#7b1fa2",        bg: "#f3e5f5",              icon: <Truck size={16} /> },
  delivered:  { label: "Delivered",     color: "var(--green)",   bg: "var(--green-light)",   icon: <CheckCircle size={16} /> },
  cancelled:  { label: "Cancelled",     color: "var(--accent)",  bg: "var(--accent-light)",  icon: <XCircle size={16} /> },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/api/orders/${id}`);
        setOrder(data.order);
      } catch { toast.error("Order not found"); navigate("/orders"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const cancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const { data } = await API.put(`/api/orders/${id}/cancel`);
      setOrder(data.order);
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cannot cancel order");
    } finally { setCancelling(false); }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (!order) return null;
  const cfg = statusConfig[order.status] || statusConfig.pending;
  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStep = steps.indexOf(order.status);
  const total = order.totalAmount * 83;

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/orders")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "var(--primary)", fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Orders
          </button>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, fontSize: 13, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
            {cfg.icon} {cfg.label}
          </span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "flex-start" }}>

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Tracking */}
            {order.status !== "cancelled" && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 24 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Order Tracking</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
                  {steps.map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "flex-start", flex: i < steps.length - 1 ? 1 : "none" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= currentStep ? "var(--green)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", border: i === currentStep ? "3px solid #a8e6be" : "none", transition: "all 0.3s ease", flexShrink: 0 }}>
                          {i <= currentStep
                            ? <CheckCircle size={16} color="#fff" />
                            : <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#bbb", display: "block" }} />
                          }
                        </div>
                        <span style={{ fontSize: 11, fontWeight: i <= currentStep ? 700 : 400, color: i <= currentStep ? "var(--green)" : "var(--text-muted)", textTransform: "capitalize", textAlign: "center", maxWidth: 64 }}>
                          {s === "pending" ? "Placed" : s}
                        </span>
                        {i === currentStep && (
                          <span style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", maxWidth: 80 }}>
                            {new Date(order.updatedAt || order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <div style={{ flex: 1, height: 3, background: i < currentStep ? "var(--green)" : "var(--border)", margin: "14px 4px 0", transition: "var(--transition)", borderRadius: 2 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", background: "#fafafa", borderBottom: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 8 }}>
                <Package size={16} color="var(--primary)" />
                <span style={{ fontSize: 15, fontWeight: 700 }}>Order Items ({order.items?.length})</span>
              </div>
              {order.items?.map((item, i) => (
                <div key={i} style={{ padding: "16px 20px", borderBottom: i < order.items.length - 1 ? "1px solid var(--border-light)" : "none", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, background: "#fafafa", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.product?.image
                      ? <img src={item.product.image} alt={item.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                      : <Package size={28} color="#ccc" />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Qty: {item.quantity} × ₹{(item.price * 83).toLocaleString()}</p>
                    {item.product?._id && (
                      <Link to={`/products/${item.product._id}`} style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>View Product →</Link>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 16, fontWeight: 700 }}>₹{(item.price * 83 * item.quantity).toLocaleString()}</p>
                    {order.status === "delivered" && (
                      <button style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, marginTop: 6 }}>Rate item</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Address */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <MapPin size={16} color="var(--primary)" />
                <span style={{ fontSize: 15, fontWeight: 700 }}>Delivery Address</span>
              </div>
              {order.shippingAddress && (
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{order.user?.fullName || "Customer"}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.zipCode}</p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Price Summary */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: 0.5, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
                Price Details
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Order Total", value: `₹${total.toLocaleString()}` },
                  { label: "Delivery", value: "FREE", color: "var(--green)" },
                  { label: "Payment", value: order.paymentStatus === "paid" ? "Paid" : "Pending", color: order.paymentStatus === "paid" ? "var(--green)" : "var(--orange)" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontWeight: 600, color: color || "var(--text)" }}>{value}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Amount Paid</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <CreditCard size={16} color="var(--primary)" />
                <span style={{ fontSize: 15, fontWeight: 700 }}>Payment Info</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                <span style={{ color: "var(--text-secondary)" }}>Method</span>
                <span style={{ fontWeight: 600 }}>Online Payment</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: "var(--text-secondary)" }}>Status</span>
                <span style={{ fontWeight: 700, color: order.paymentStatus === "paid" ? "var(--green)" : "var(--orange)" }}>
                  {order.paymentStatus === "paid" ? "✓ Paid" : "⏳ Pending"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {order.status === "pending" && (
                <button onClick={cancelOrder} disabled={cancelling}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 2, border: "1.5px solid var(--accent)", color: "var(--accent)", background: "#fff", fontSize: 14, fontWeight: 700, transition: "var(--transition)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
                >
                  {cancelling ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <><XCircle size={16} /> Cancel Order</>}
                </button>
              )}
              {order.status === "delivered" && (
                <button className="btn btn-primary" style={{ borderRadius: 2, justifyContent: "center", padding: 13, fontSize: 14 }}>
                  Return / Exchange
                </button>
              )}
              <Link to="/products" className="btn" style={{ borderRadius: 2, justifyContent: "center", padding: 13, fontSize: 14, border: "1px solid var(--border)", color: "var(--text-secondary)", background: "#fff" }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}