import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, Shield, Truck, RefreshCw } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [updating, setUpdating] = useState({});

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal - discount + delivery;

  const handleQty = async (productId, qty) => {
    if (qty < 1) return;
    setUpdating(prev => ({ ...prev, [productId]: true }));
    try { await updateCartItem(productId, qty); }
    catch { toast.error("Failed to update"); }
    finally { setUpdating(prev => ({ ...prev, [productId]: false })); }
  };

  const handleRemove = async (productId) => {
    try { await removeFromCart(productId); toast.success("Item removed"); }
    catch { toast.error("Failed to remove"); }
  };

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "SAVE10") { setCouponApplied(true); toast.success("Coupon applied! 10% off"); }
    else toast.error("Invalid coupon code");
  };

  if (items.length === 0) return (
    <div style={{ minHeight: "calc(100vh - 108px)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "60px 48px", textAlign: "center", maxWidth: 420 }}>
        <ShoppingBag size={64} color="#e0e0e0" style={{ margin: "0 auto 20px" }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Your cart is empty!</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>Add items to it now</p>
        <Link to="/products" className="btn btn-primary btn-lg" style={{ borderRadius: 2 }}>Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", padding: "16px 0 40px" }}>
      <div className="container">
        <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
          My Cart <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 15 }}>({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "flex-start" }}>

          {/* Cart Items */}
          <div>
            {/* Delivery Banner */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "12px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
              <Truck size={18} color="var(--green)" />
              {subtotal > 500
                ? <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>✓ Your order is eligible for FREE Delivery!</span>
                : <span style={{ fontSize: 13 }}>Add <strong style={{ color: "var(--primary)" }}>₹{((500 - subtotal) * 83).toFixed(0)}</strong> more for FREE delivery</span>
              }
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {items.map((item, idx) => {
                const p = item.product;
                const disc = Math.floor(Math.random() * 30) + 10;
                const orig = (item.price * (1 + disc / 100)).toFixed(0);
                if (!p) return null;
                return (
                  <div key={item._id || idx} style={{ padding: "20px 24px", borderBottom: idx < items.length - 1 ? "1px solid var(--border-light)" : "none", display: "flex", gap: 20, alignItems: "flex-start" }}>

                    {/* Image */}
                    <Link to={`/products/${p._id}`}>
                      <div style={{ width: 100, height: 100, flexShrink: 0, background: "#fafafa", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        {p.image
                          ? <img src={p.image} alt={p.name} style={{ width: "85%", height: "85%", objectFit: "contain" }} />
                          : <ShoppingBag size={32} color="#ddd" />
                        }
                      </div>
                    </Link>

                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/products/${p._id}`}>
                        <p style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 4, lineHeight: 1.4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{p.name}</p>
                      </Link>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Category: {p.category}</p>

                      {/* Price */}
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 20, fontWeight: 700 }}>₹{(item.price * 83 * item.quantity).toLocaleString()}</span>
                        <span style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "line-through" }}>₹{(orig * 83 * item.quantity).toLocaleString()}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green)" }}>{disc}% off</span>
                      </div>

                      {/* Delivery tag */}
                      <p style={{ fontSize: 12, color: "var(--green)", fontWeight: 500, marginBottom: 14 }}>
                        <Truck size={11} style={{ display: "inline", marginRight: 4 }} />
                        Free delivery by {new Date(Date.now() + 3 * 86400000).toDateString()}
                      </p>

                      {/* Qty + Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                        <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 2, overflow: "hidden" }}>
                          <button onClick={() => handleQty(p._id, item.quantity - 1)} disabled={item.quantity <= 1 || updating[p._id]}
                            style={{ width: 36, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", transition: "var(--transition)", opacity: item.quantity <= 1 ? 0.4 : 1 }}
                            onMouseEnter={e => { if (item.quantity > 1) e.currentTarget.style.background = "#e0e0e0"; }}
                            onMouseLeave={e => e.currentTarget.style.background = "#f5f5f5"}
                          >
                            {updating[p._id] ? <div className="spinner" style={{ width: 10, height: 10 }} /> : <Minus size={13} />}
                          </button>
                          <span style={{ width: 44, textAlign: "center", fontSize: 14, fontWeight: 700, borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", lineHeight: "32px" }}>{item.quantity}</span>
                          <button onClick={() => handleQty(p._id, item.quantity + 1)} disabled={updating[p._id]}
                            style={{ width: 36, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", transition: "var(--transition)" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e0e0e0"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f5f5f5"}
                          ><Plus size={13} /></button>
                        </div>

                        <button onClick={() => handleRemove(p._id)}
                          style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 2, transition: "var(--transition)", background: "#fff" }}
                          onMouseEnter={e => { e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.background = "var(--accent-light)"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>

                        <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)", padding: "6px 12px", border: "1px solid var(--border)", borderRadius: 2, background: "#fff" }}>
                          <Tag size={13} /> Save for Later
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Place Order bottom bar */}
              <div style={{ padding: "16px 24px", background: "#fff", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Total ({items.length} items): </span>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>₹{(total * 83).toLocaleString()}</span>
                  {discount > 0 && <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600, marginLeft: 8 }}>You save ₹{(discount * 83).toFixed(0)}</span>}
                </div>
                <button onClick={() => navigate("/checkout")} className="btn btn-primary btn-lg" style={{ borderRadius: 2, minWidth: 200 }}>
                  PLACE ORDER <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Coupon */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <Tag size={15} color="var(--primary)" /> Apply Coupon
              </p>
              {couponApplied ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--green-light)", border: "1px solid var(--green)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
                  <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>✓ SAVE10 applied — 10% off!</span>
                  <button onClick={() => { setCouponApplied(false); setCoupon(""); }} style={{ fontSize: 12, color: "var(--text-muted)" }}>Remove</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input className="input-field" placeholder="Enter coupon code" value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    style={{ flex: 1, fontSize: 13, padding: "9px 12px", textTransform: "uppercase", letterSpacing: 1 }} />
                  <button onClick={applyCoupon} style={{ padding: "0 16px", background: "var(--primary)", color: "#fff", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, transition: "var(--transition)", flexShrink: 0 }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--primary-dark)"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--primary)"}
                  >Apply</button>
                </div>
              )}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>Try: <strong>SAVE10</strong> for 10% off</p>
            </div>

            {/* Price Details */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 18 }}>
              <p style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--text-muted)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
                Price Details
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: `Price (${items.length} items)`, value: `₹${(subtotal * 83).toLocaleString()}` },
                  { label: "Discount", value: discount > 0 ? `-₹${(discount * 83).toFixed(0)}` : "—", color: discount > 0 ? "var(--green)" : undefined },
                  { label: "Delivery Charges", value: delivery === 0 ? "FREE" : `₹${(delivery * 83).toFixed(0)}`, color: delivery === 0 ? "var(--green)" : undefined },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                    <span style={{ color: "var(--text-secondary)" }}>{label}</span>
                    <span style={{ fontWeight: 500, color: color || "var(--text)" }}>{value}</span>
                  </div>
                ))}

                <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total Amount</span>
                  <span style={{ fontSize: 18, fontWeight: 800 }}>₹{(total * 83).toLocaleString()}</span>
                </div>

                {(discount > 0 || delivery === 0) && (
                  <div style={{ background: "var(--green-light)", borderRadius: "var(--radius-sm)", padding: "10px 14px" }}>
                    <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>
                      🎉 You will save ₹{((discount + (delivery === 0 ? 40 : 0)) * 83).toFixed(0)} on this order!
                    </p>
                  </div>
                )}
              </div>

              <button onClick={() => navigate("/checkout")} className="btn btn-primary"
                style={{ width: "100%", justifyContent: "center", marginTop: 16, padding: 14, fontSize: 15, fontWeight: 700, borderRadius: 2 }}>
                PROCEED TO CHECKOUT <ChevronRight size={16} />
              </button>
            </div>

            {/* Safe Payment */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <Shield size={18} color="var(--text-muted)" />
              <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </p>
            </div>

            {/* Services */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 14 }}>
              {[
                { icon: <Truck size={15} />, text: "Free delivery on orders above ₹499" },
                { icon: <RefreshCw size={15} />, text: "Easy 7-day return & exchange" },
                { icon: <Shield size={15} />, text: "1-year warranty on electronics" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--primary)", flexShrink: 0 }}>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}