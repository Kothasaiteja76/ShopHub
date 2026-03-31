import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CreditCard, Shield, Lock, CheckCircle, ChevronRight, Smartphone, Building2, Wallet, Truck } from "lucide-react";
import API from "../api/axios";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchCart } = useCart();
  const [orderId,_setOrderId] = useState(location.state?.orderId || null);
  const [orderAmount,_setOrderAmount] = useState(location.state?.amount || 0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);
  const [Paid, setPaid] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [step, setStep] = useState("method"); // method | details | processing | success

  useEffect(() => {
    if (!orderId) {
      toast.error("No order found. Please checkout first.");
      navigate("/cart");
    }
  },[orderId, navigate]);

  const formatCard = (val) => {
    return val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
  };

  const formatExpiry = (val) => {
    return val.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2").slice(0, 5);
  };

  const handlePayment = async () => {
    // Validate based on method
    if (paymentMethod === "upi" && !upiId.includes("@")) {
      toast.error("Enter valid UPI ID (e.g. name@upi)");
      return;
    }
    if (paymentMethod === "card") {
      if (card.number.replace(/\s/g, "").length < 16) { toast.error("Enter valid 16-digit card number"); return; }
      if (!card.name.trim()) { toast.error("Enter cardholder name"); return; }
      if (card.expiry.length < 5) { toast.error("Enter valid expiry date"); return; }
      if (card.cvv.length < 3) { toast.error("Enter valid CVV"); return; }
    }

    setStep("processing");
    setLoading(true);

    try {
      // Simulate payment processing delay
      await new Promise(res => setTimeout(res, 2000));

      // Confirm payment on backend
      await API.post("/api/payments/confirm", { orderId });
      await fetchCart();

      setStep("success");
      setPaid(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed. Try again.");
      setStep("method");
    } finally {
      setLoading(false);
    }
  };

  // Success Screen
  if (step === "success") return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "48px 40px", textAlign: "center", maxWidth: 480, width: "100%" }} className="fade-up">
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <CheckCircle size={40} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: "var(--text)" }}>Payment Successful!</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 6 }}>
          Your order has been placed successfully.
        </p>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
          Order ID: <strong style={{ fontFamily: "monospace", color: "var(--primary)" }}>#{orderId?.slice(-8).toUpperCase()}</strong>
        </p>

        <div style={{ background: "var(--green-light)", border: "1px solid var(--green)", borderRadius: "var(--radius-sm)", padding: "14px 20px", marginBottom: 28, textAlign: "left" }}>
          {[
            { icon: <Truck size={15} />, text: "Estimated delivery in 3–5 business days" },
            { icon: <CheckCircle size={15} />, text: "Order confirmation sent to your email" },
            { icon: <Shield size={15} />, text: "100% purchase protection guaranteed" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, fontSize: 13, color: "var(--green)" }}>
              {icon} <span style={{ color: "var(--text-secondary)" }}>{text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => navigate("/orders")} className="btn btn-primary btn-lg" style={{ borderRadius: 2, justifyContent: "center" }}>
            View My Orders <ChevronRight size={16} />
          </button>
          <button onClick={() => navigate("/products")} className="btn" style={{ borderRadius: 2, justifyContent: "center", border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "12px" }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  // Processing Screen
  if (step === "processing") return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "48px 40px", textAlign: "center", maxWidth: 400 }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3, borderColor: "rgba(255,96,0,0.2)", borderTopColor: "var(--primary)" }} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Processing Payment...</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>Please do not close or refresh this page</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", opacity: 0.3, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }`}</style>
      </div>
    </div>
  );

  const paymentMethods = [
    { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: <Smartphone size={20} />, color: "#4CAF50" },
    { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, Rupay", icon: <CreditCard size={20} />, color: "var(--primary)" },
    { id: "netbanking", label: "Net Banking", desc: "All major banks supported", icon: <Building2 size={20} />, color: "#1565C0" },
    { id: "cod", label: "Cash on Delivery", desc: "Pay when order arrives", icon: <Wallet size={20} />, color: "var(--orange)" },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "12px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "var(--primary)" }}>
            Shop<span style={{ color: "#333" }}>Hub</span>
          </span>
          <span style={{ color: "var(--border)" }}>|</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, color: "var(--text-secondary)" }}>
            <Lock size={14} color="var(--green)" /> Secure Payment
          </span>
          <span style={{ marginLeft: "auto", fontSize: 14, color: "var(--text-secondary)" }}>
            Amount: <strong style={{ color: "var(--text)", fontSize: 16 }}>₹{(orderAmount * 83).toLocaleString()}</strong>
          </span>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, alignItems: "flex-start" }}>

          {/* Payment Form */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "#fafafa" }}>
              <p style={{ fontSize: 16, fontWeight: 700 }}>Select Payment Method</p>
            </div>

            <div style={{ display: "flex", gap: 0 }}>

              {/* Left — Method List */}
              <div style={{ width: 220, borderRight: "1px solid var(--border-light)", flexShrink: 0 }}>
                {paymentMethods.map(({ id, label, desc, icon, color }) => (
                  <button key={id} onClick={() => setPaymentMethod(id)}
                    style={{ width: "100%", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border-light)", background: paymentMethod === id ? "var(--primary-light)" : "#fff", borderLeft: paymentMethod === id ? `3px solid var(--primary)` : "3px solid transparent", transition: "var(--transition)", textAlign: "left" }}>
                    <span style={{ color: paymentMethod === id ? "var(--primary)" : color, flexShrink: 0 }}>{icon}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: paymentMethod === id ? 700 : 500, color: paymentMethod === id ? "var(--primary)" : "var(--text)", marginBottom: 1 }}>{label}</p>
                      <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right — Method Details */}
              <div style={{ flex: 1, padding: 24 }}>

                {/* UPI */}
                {paymentMethod === "upi" && (
                  <div className="fade-in">
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Pay via UPI</p>

                    {/* UPI Apps */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
                      {[
                        { name: "Google Pay", emoji: "🟢", color: "#e8f5e9" },
                        { name: "PhonePe", emoji: "🟣", color: "#f3e5f5" },
                        { name: "Paytm", emoji: "🔵", color: "#e3f2fd" },
                        { name: "BHIM", emoji: "🟠", color: "#fff3e0" },
                      ].map(({ name, emoji, color }) => (
                        <div key={name} style={{ background: color, borderRadius: "var(--radius-sm)", padding: "12px 8px", textAlign: "center", cursor: "pointer", border: "1.5px solid transparent", transition: "var(--transition)" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                        >
                          <div style={{ fontSize: 24, marginBottom: 4 }}>{emoji}</div>
                          <p style={{ fontSize: 11, fontWeight: 600 }}>{name}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ position: "relative", marginBottom: 20 }}>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                        <span style={{ padding: "0 12px", fontSize: 12, color: "var(--text-muted)", background: "#fff" }}>or enter UPI ID</span>
                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                      </div>
                      <div style={{ height: 20 }} />
                    </div>

                    <div className="form-group">
                      <label className="label">UPI ID</label>
                      <input className="input-field" placeholder="yourname@upi" value={upiId}
                        onChange={e => setUpiId(e.target.value)} />
                      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>Example: mobilenumber@upi or name@bankname</p>
                    </div>
                  </div>
                )}

                {/* Card */}
                {paymentMethod === "card" && (
                  <div className="fade-in">
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Credit / Debit Card</p>

                    {/* Card Preview */}
                    <div style={{ background: "linear-gradient(135deg, #1a237e, #283593)", borderRadius: "var(--radius)", padding: "20px 24px", marginBottom: 24, color: "#fff", position: "relative", overflow: "hidden" }}>
                      <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                      <div style={{ position: "absolute", bottom: -30, right: 30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                      <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 16, letterSpacing: 1 }}>CARD NUMBER</p>
                      <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3, marginBottom: 20, fontFamily: "monospace" }}>
                        {card.number || "•••• •••• •••• ••••"}
                      </p>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <p style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>CARD HOLDER</p>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{card.name || "YOUR NAME"}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 10, opacity: 0.7, marginBottom: 2 }}>EXPIRES</p>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{card.expiry || "MM/YY"}</p>
                        </div>
                        <div style={{ display: "flex", gap: -8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,96,0,0.8)" }} />
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,180,0,0.8)", marginLeft: -10 }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label className="label">Card Number</label>
                        <input className="input-field" placeholder="1234 5678 9012 3456" value={card.number}
                          onChange={e => setCard({ ...card, number: formatCard(e.target.value) })}
                          maxLength={19} style={{ letterSpacing: 2, fontFamily: "monospace" }} />
                      </div>
                      <div className="form-group" style={{ gridColumn: "span 2" }}>
                        <label className="label">Cardholder Name</label>
                        <input className="input-field" placeholder="As on card" value={card.name}
                          onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })} />
                      </div>
                      <div className="form-group">
                        <label className="label">Expiry Date</label>
                        <input className="input-field" placeholder="MM/YY" value={card.expiry}
                          onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                          maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label className="label">CVV</label>
                        <input className="input-field" placeholder="•••" type="password" value={card.cvv}
                          onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                          maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Banking */}
                {paymentMethod === "netbanking" && (
                  <div className="fade-in">
                    <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Net Banking</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                      {[
                        { name: "SBI", color: "#e3f2fd" },
                        { name: "HDFC", color: "#e8f5e9" },
                        { name: "ICICI", color: "#fff3e0" },
                        { name: "Axis", color: "#fce4ec" },
                        { name: "Kotak", color: "#f3e5f5" },
                        { name: "PNB", color: "#e0f2f1" },
                      ].map(({ name, color }) => (
                        <button key={name}
                          style={{ padding: "14px 10px", background: color, borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700, border: "1.5px solid transparent", transition: "var(--transition)", textAlign: "center" }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--primary)"}
                          onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                        >{name}</button>
                      ))}
                    </div>
                    <div className="form-group">
                      <label className="label">Or select other bank</label>
                      <select className="input-field">
                        <option>Select your bank</option>
                        {["Bank of Baroda", "Canara Bank", "Union Bank", "IndusInd Bank", "Yes Bank", "IDFC Bank"].map(b => (
                          <option key={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* COD */}
                {paymentMethod === "cod" && (
                  <div className="fade-in">
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                      <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--orange-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <Wallet size={32} color="var(--orange)" />
                      </div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Cash on Delivery</h3>
                      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                        Pay ₹{(orderAmount * 83).toLocaleString()} in cash when your order arrives
                      </p>
                      <div style={{ background: "var(--orange-light)", border: "1px solid rgba(255,159,0,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", textAlign: "left" }}>
                        {[
                          "Keep exact change ready",
                          "Available on orders under ₹50,000",
                          "Additional ₹40 COD charge may apply",
                        ].map(note => (
                          <p key={note} style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: "var(--orange)", fontWeight: 700 }}>•</span> {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Pay Button */}
                <button onClick={handlePayment} disabled={loading}
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%", justifyContent: "center", borderRadius: 2, marginTop: 16, fontSize: 15, fontWeight: 700 }}>
                  {loading
                    ? <div className="spinner" style={{ width: 18, height: 18, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                    : <><Lock size={16} /> PAY ₹{(orderAmount * 83).toLocaleString()} SECURELY</>
                  }
                </button>

                {/* Security note */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}>
                  <Shield size={13} color="var(--green)" />
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>256-bit SSL encrypted. Your payment info is safe.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: 0.5, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
                Order Summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Order ID</span>
                  <span style={{ fontWeight: 700, fontFamily: "monospace", color: "var(--primary)", fontSize: 13 }}>#{orderId?.slice(-8).toUpperCase()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                  <span style={{ fontWeight: 500 }}>₹{(orderAmount * 83).toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                  <span style={{ color: "var(--text-secondary)" }}>Delivery</span>
                  <span style={{ fontWeight: 600, color: "var(--green)" }}>FREE</span>
                </div>
                <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800 }}>₹{(orderAmount * 83).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Accepted Payments */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>We Accept</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Visa", "Mastercard", "Rupay", "UPI", "Paytm", "GPay"].map(p => (
                  <span key={p} style={{ background: "#f5f5f5", border: "1px solid var(--border)", padding: "4px 10px", borderRadius: "var(--radius-sm)", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)" }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 16 }}>
              {[
                { icon: <Shield size={15} />, text: "100% Secure Payments", color: "var(--green)" },
                { icon: <Lock size={15} />, text: "256-bit SSL Encryption", color: "var(--primary)" },
                { icon: <CheckCircle size={15} />, text: "Buyer Protection Guaranteed", color: "var(--orange)" },
              ].map(({ icon, text, color }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 12 }}>
                  <span style={{ color }}>{icon}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}