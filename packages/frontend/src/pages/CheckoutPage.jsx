import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, CheckCircle, ChevronRight, Shield, Truck, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const steps = ["Delivery Address", "Order Summary", "Payment"];

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [address, setAddress] = useState({
    fullName: "", phone: "", street: "", city: "",
    state: "", zipCode: "", country: "India",
  });

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = subtotal > 500 ? 0 : 40;
  const total = subtotal + delivery;

  const handleAddressChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const validateAddress = () => {
    const required = ["fullName", "phone", "street", "city", "state", "zipCode"];
    for (const f of required) {
      if (!address[f].trim()) { toast.error(`Please enter ${f}`); return false; }
    }
    if (address.phone.length < 10) { toast.error("Enter valid phone number"); return false; }
    if (address.zipCode.length < 5) { toast.error("Enter valid ZIP/Pincode"); return false; }
    return true;
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/api/orders/checkout", {
        shippingAddress: {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
          country: address.country,
        },
      });
      setOrderId(data.order._id);
      await fetchCart();
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Order failed");
    } finally { setLoading(false); }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      await API.post("/api/payments/confirm", { orderId });
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch {
      toast.error("Payment failed. Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Step Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", height: 56, gap: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)", marginRight: 40 }}>
            Shop<span style={{ color: "#333" }}>Hub</span>
          </span>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", height: 56, borderBottom: step === i ? "2px solid var(--primary)" : "2px solid transparent" }}>
                <span style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: i < step ? "var(--green)" : step === i ? "var(--primary)" : "var(--border)",
                  color: i <= step ? "#fff" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                }}>
                  {i < step ? "✓" : i + 1}
                </span>
                <span style={{ fontSize: 13, fontWeight: step === i ? 700 : 500, color: step === i ? "var(--primary)" : i < step ? "var(--green)" : "var(--text-muted)" }}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && <ChevronRight size={16} color="var(--text-muted)" />}
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "flex-start" }}>

          {/* Main Content */}
          <div>

            {/* Step 0 — Address */}
            {step === 0 && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "var(--primary-light)", display: "flex", alignItems: "center", gap: 10 }}>
                  <MapPin size={18} color="var(--primary)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>Delivery Address</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {[
                      { name: "fullName", label: "Full Name", placeholder: "John Doe", span: 1 },
                      { name: "phone", label: "Mobile Number", placeholder: "10-digit number", span: 1 },
                      { name: "street", label: "Address (House No, Street, Area)", placeholder: "123 Main Street, Near Park", span: 2 },
                      { name: "city", label: "City / District / Town", placeholder: "Mumbai", span: 1 },
                      { name: "state", label: "State", placeholder: "Maharashtra", span: 1 },
                      { name: "zipCode", label: "Pincode", placeholder: "400001", span: 1 },
                      { name: "country", label: "Country", placeholder: "India", span: 1 },
                    ].map(({ name, label, placeholder, span }) => (
                      <div key={name} className="form-group" style={{ gridColumn: `span ${span}`, marginBottom: 0 }}>
                        <label className="label">{label}</label>
                        <input className="input-field" name={name} placeholder={placeholder}
                          value={address[name]} onChange={handleAddressChange} />
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                    <button onClick={() => { if (validateAddress()) setStep(1); }}
                      className="btn btn-primary" style={{ borderRadius: 2, padding: "13px 40px", fontSize: 14, fontWeight: 700 }}>
                      DELIVER HERE <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 — Order Summary */}
            {step === 1 && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "var(--primary-light)", display: "flex", alignItems: "center", gap: 10 }}>
                  <Package size={18} color="var(--primary)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>Order Summary</span>
                </div>

                {/* Delivery Address display */}
                <div style={{ padding: "14px 24px", background: "#fafafa", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{address.fullName} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>| {address.phone}</span></p>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>{address.street}, {address.city}, {address.state} — {address.zipCode}</p>
                  </div>
                  <button onClick={() => setStep(0)} style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600 }}>Change</button>
                </div>

                {/* Items */}
                {items.map((item, idx) => {
                  const p = item.product;
                  if (!p) return null;
                  return (
                    <div key={idx} style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 64, height: 64, background: "#fafafa", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {p.image ? <img src={p.image} alt={p.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} /> : <Package size={24} color="#ccc" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 16, fontWeight: 700 }}>₹{(item.price * 83 * item.quantity).toLocaleString()}</p>
                        <p style={{ fontSize: 11, color: "var(--green)", fontWeight: 500 }}>Free delivery</p>
                      </div>
                    </div>
                  );
                })}

                <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 15 }}>Total: <strong>₹{(total * 83).toLocaleString()}</strong></span>
                  <button onClick={placeOrder} disabled={loading}
                    className="btn btn-primary" style={{ borderRadius: 2, padding: "12px 36px", fontSize: 14, fontWeight: 700 }}>
                    {loading ? <div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <>CONFIRM ORDER <ChevronRight size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "var(--primary-light)", display: "flex", alignItems: "center", gap: 10 }}>
                  <CreditCard size={18} color="var(--primary)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: "var(--primary)" }}>Payment</span>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--green-light)", border: "1px solid var(--green)", borderRadius: "var(--radius-sm)", padding: 16, marginBottom: 24 }}>
                    <CheckCircle size={20} color="var(--green)" />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>Order confirmed!</p>
                      <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Order ID: {orderId?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Select Payment Method</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {[
                      { id: "upi", label: "UPI / Google Pay / PhonePe", desc: "Pay using UPI apps", icon: "📱" },
                      { id: "card", label: "Credit / Debit Card", desc: "All major cards accepted", icon: "💳" },
                      { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: "🏦" },
                      { id: "cod", label: "Cash on Delivery", desc: "Pay when delivered", icon: "💵" },
                    ].map(({ id, label, desc, icon }) => (
                      <label key={id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "var(--transition)" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--primary-light)"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; }}
                      >
                        <input type="radio" name="payment" defaultChecked={id === "upi"} style={{ accentColor: "var(--primary)", width: 16, height: 16 }} />
                        <span style={{ fontSize: 20 }}>{icon}</span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600 }}>{label}</p>
                          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button onClick={handlePayment} disabled={loading}
                    className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: 15, fontSize: 16, fontWeight: 700, borderRadius: 2 }}>
                    {loading ? <div className="spinner" style={{ width: 18, height: 18, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <>PAY ₹{(total * 83).toLocaleString()} <ChevronRight size={18} /></>}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16 }}>
                    <Shield size={14} color="var(--text-muted)" />
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>100% Secure Payments powered by ShopHub</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 18, position: "sticky", top: 120 }}>
            <p style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: 0.5, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
              Price Details
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: `Price (${items.length} items)`, value: `₹${(subtotal * 83).toLocaleString()}` },
                { label: "Discount", value: "—" },
                { label: "Delivery Charges", value: delivery === 0 ? "FREE" : `₹${(delivery * 83).toFixed(0)}`, color: "var(--green)" },
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
              {delivery === 0 && (
                <p style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>🎉 You are saving ₹{(40 * 83)} on delivery!</p>
              )}
            </div>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
              {[
                { icon: <Truck size={14} />, text: "Free delivery on this order" },
                { icon: <Shield size={14} />, text: "Safe & secure payments" },
                { icon: <CheckCircle size={14} />, text: "Easy returns & refunds" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12, color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--green)" }}>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}