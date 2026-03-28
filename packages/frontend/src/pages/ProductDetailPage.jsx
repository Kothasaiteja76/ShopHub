import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Zap, ChevronRight, Shield, RefreshCw, Truck, CheckCircle, Star, Plus, Minus, Package } from "lucide-react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const discount = Math.floor(Math.random() * 35) + 10;

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buying, setBuying] = useState(false);
  const [tab, setTab] = useState("overview");
  const [pincode, setPincode] = useState("");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data.product);
      } catch { toast.error("Product not found"); navigate("/products"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAdd = async () => {
    if (!user) { toast.error("Please login first"); navigate("/login"); return; }
    setAdding(true);
    try { await addToCart(product._id, qty); toast.success("Added to cart!"); }
    catch { toast.error("Failed to add to cart"); }
    finally { setAdding(false); }
  };

  const handleBuyNow = async () => {
    if (!user) { navigate("/login"); return; }
    setBuying(true);
    try { await addToCart(product._id, qty); navigate("/cart"); }
    catch { toast.error("Something went wrong"); }
    finally { setBuying(false); }
  };

  const checkDelivery = () => {
    if (pincode.length === 6) setDeliveryMsg(`✓ Delivery available by ${new Date(Date.now() + 3 * 86400000).toDateString()}`);
    else toast.error("Enter valid 6-digit pincode");
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (!product) return null;
  const originalPrice = (product.price * (1 + discount / 100)).toFixed(2);
  const rating = (3.8 + Math.random() * 1.2).toFixed(1);
  const reviews = Math.floor(Math.random() * 5000) + 500;

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", paddingBottom: 40 }}>

      {/* Breadcrumb */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border-light)", padding: "10px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text-secondary)", flexWrap: "wrap" }}>
          {[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: product.category, to: `/products?category=${product.category}` }, { label: product.name }].map((item, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {item.to ? (
                <Link to={item.to} style={{ color: "var(--primary)", fontWeight: 500 }}
                  onMouseEnter={e => e.target.style.textDecoration = "underline"}
                  onMouseLeave={e => e.target.style.textDecoration = "none"}
                >{item.label}</Link>
              ) : (
                <span style={{ color: "var(--text)", fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
              )}
              {i < arr.length - 1 && <ChevronRight size={12} color="var(--text-muted)" />}
            </span>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr", gap: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>

          {/* Left — Image */}
          <div style={{ padding: 24, borderRight: "1px solid var(--border-light)", position: "sticky", top: 120, height: "fit-content" }}>
            <div style={{ background: "#fafafa", borderRadius: "var(--radius)", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, overflow: "hidden" }}>
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
              ) : (
                <Package size={80} color="#ccc" />
              )}
            </div>

            {/* Thumbnail row */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ width: 52, height: 52, borderRadius: 4, border: i === 0 ? "2px solid var(--primary)" : "1px solid var(--border)", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {product.image ? <img src={product.image} alt="" style={{ width: "70%", height: "70%", objectFit: "contain" }} /> : <Package size={20} color="#ccc" />}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={handleAdd} disabled={adding || !product.isAvailable}
                className="btn" style={{ background: "var(--orange)", color: "#fff", justifyContent: "center", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 2 }}>
                {adding ? <div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <><ShoppingCart size={18} /> ADD TO CART</>}
              </button>
              <button onClick={handleBuyNow} disabled={buying || !product.isAvailable}
                className="btn" style={{ background: "var(--primary)", color: "#fff", justifyContent: "center", padding: "14px", fontSize: 15, fontWeight: 700, borderRadius: 2 }}>
                {buying ? <div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <><Zap size={18} /> BUY NOW</>}
              </button>
            </div>
          </div>

          {/* Middle — Details */}
          <div style={{ padding: 24, borderRight: "1px solid var(--border-light)" }}>
            <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "2px 8px", borderRadius: 2, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
              {product.category}
            </span>

            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "10px 0 8px", lineHeight: 1.4 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
              <span style={{ background: parseFloat(rating) >= 4 ? "var(--green)" : "var(--orange)", color: "#fff", padding: "3px 8px", borderRadius: 3, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                {rating} <Star size={11} fill="#fff" />
              </span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{reviews.toLocaleString()} Ratings & {Math.floor(reviews / 4).toLocaleString()} Reviews</span>
              <span style={{ color: "var(--green)", fontSize: 12, fontWeight: 600 }}>✓ Flipkart Assured</span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 28, fontWeight: 700 }}>₹{(product.price * 83).toLocaleString()}</span>
                <span style={{ fontSize: 16, color: "var(--text-muted)", textDecoration: "line-through" }}>₹{(originalPrice * 83).toLocaleString()}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: "var(--green)" }}>{discount}% off</span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>+ ₹0 Shipping. <span style={{ color: "var(--primary)" }}>Free delivery</span> on this order</p>
            </div>

            {/* Offers */}
            <div style={{ background: "#f9f9f9", borderRadius: "var(--radius-sm)", padding: 14, marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Available Offers</p>
              {[
                { icon: "💳", text: "10% off on SBI Credit Card, up to ₹1,500" },
                { icon: "🏷️", text: "Extra 5% off on first purchase" },
                { icon: "🎁", text: "Buy 2 get 5% extra off — code: SAVE5" },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8, fontSize: 13 }}>
                  <span>{icon}</span>
                  <span style={{ color: "var(--text-secondary)" }}>{text}</span>
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Quantity:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: 2, overflow: "hidden" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e0e0e0"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f5f5f5"}
                ><Minus size={14} /></button>
                <span style={{ width: 44, textAlign: "center", fontSize: 15, fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#e0e0e0"}
                  onMouseLeave={e => e.currentTarget.style.background = "#f5f5f5"}
                ><Plus size={14} /></button>
              </div>
              <span style={{ fontSize: 12, color: product.stock > 5 ? "var(--green)" : "var(--accent)", fontWeight: 600 }}>
                {product.stock > 0 ? product.stock > 5 ? "✓ In Stock" : `Only ${product.stock} left!` : "✗ Out of Stock"}
              </span>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Product Description</p>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{product.description}</p>
            </div>

            {/* Tabs */}
            <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: 16 }}>
              <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: "1px solid var(--border-light)" }}>
                {["overview", "specs", "reviews"].map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ padding: "10px 20px", fontSize: 13, fontWeight: 600, color: tab === t ? "var(--primary)" : "var(--text-secondary)", borderBottom: tab === t ? "2px solid var(--primary)" : "2px solid transparent", textTransform: "capitalize", transition: "var(--transition)" }}>
                    {t}
                  </button>
                ))}
              </div>
              {tab === "overview" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["Category", product.category], ["Stock", `${product.stock} units`], ["Status", product.isAvailable ? "Available" : "Unavailable"], ["Rating", `${rating} / 5`]].map(([k, v]) => (
                    <div key={k} style={{ background: "#f9f9f9", borderRadius: "var(--radius-sm)", padding: "10px 12px" }}>
                      <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</p>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{v}</p>
                    </div>
                  ))}
                </div>
              )}
              {tab === "specs" && (
                <table style={{ width: "100%", fontSize: 13 }}>
                  {[["Brand", "ShopHub Brand"], ["Model", product.name.split(" ")[0]], ["Color", "Multiple"], ["Warranty", "1 Year"], ["Country", "Made in India"]].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <td style={{ padding: "8px 12px", color: "var(--text-secondary)", background: "#fafafa", fontWeight: 600, width: "35%" }}>{k}</td>
                      <td style={{ padding: "8px 12px" }}>{v}</td>
                    </tr>
                  ))}
                </table>
              )}
              {tab === "reviews" && (
                <div>
                  {[5, 4, 3].map(stars => (
                    <div key={stars} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <span style={{ background: stars >= 4 ? "var(--green)" : "var(--orange)", color: "#fff", padding: "2px 6px", borderRadius: 3, fontSize: 11, fontWeight: 700, width: 36, textAlign: "center" }}>{stars} ★</span>
                      <div style={{ flex: 1, height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${(6 - stars) * 15 + 25}%`, height: "100%", background: stars >= 4 ? "var(--green)" : "var(--orange)", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", width: 40, textAlign: "right" }}>{Math.floor(reviews * ((6 - stars) * 0.12 + 0.1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — Delivery + Seller */}
          <div style={{ padding: 24 }}>
            {/* Delivery Check */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={15} color="var(--primary)" /> Delivery Options
              </p>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="input-field" placeholder="Enter pincode" maxLength={6} value={pincode}
                  onChange={e => { setPincode(e.target.value); setDeliveryMsg(""); }}
                  style={{ flex: 1, fontSize: 13, padding: "9px 12px" }} />
                <button onClick={checkDelivery} style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700, padding: "0 12px", border: "1.5px solid var(--primary)", borderRadius: "var(--radius-sm)", background: "var(--primary-light)" }}>
                  Check
                </button>
              </div>
              {deliveryMsg && <p style={{ fontSize: 12, color: "var(--green)", fontWeight: 600 }}>{deliveryMsg}</p>}
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>Free delivery on all orders</p>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Highlights</p>
              {["Premium quality product", "1 Year manufacturer warranty", "Easy 7-day return policy", "100% authentic product"].map(h => (
                <div key={h} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <CheckCircle size={14} color="var(--green)" />
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{h}</span>
                </div>
              ))}
            </div>

            {/* Seller Info */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Seller</p>
              <p style={{ fontSize: 13, color: "var(--primary)", fontWeight: 600, marginBottom: 4 }}>ShopHub Official Store</p>
              <span style={{ background: "var(--green-light)", color: "var(--green)", padding: "2px 8px", borderRadius: 3, fontSize: 11, fontWeight: 700 }}>4.8 ★ Trusted Seller</span>
            </div>

            {/* Services */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Services</p>
              {[
                { icon: <Shield size={14} />, text: "7 Day Replacement" },
                { icon: <RefreshCw size={14} />, text: "Easy Returns" },
                { icon: <Truck size={14} />, text: "Free Delivery" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: "var(--text-secondary)", fontSize: 13 }}>
                  <span style={{ color: "var(--primary)" }}>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}