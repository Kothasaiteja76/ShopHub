import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Stars = ({ rating = 4.2, count = 1240 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
    <span style={{ background: rating >= 4 ? "var(--green)" : rating >= 3 ? "var(--orange)" : "var(--accent)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 3, display: "flex", alignItems: "center", gap: 2 }}>
      {rating} ★
    </span>
    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({count.toLocaleString()})</span>
  </div>
);

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = Math.floor(Math.random() * 30) + 10;
  const original = (product.price * (1 + discount / 100)).toFixed(0);
  const rating = (3.8 + Math.random() * 1.2).toFixed(1);
  const reviews = Math.floor(Math.random() * 5000) + 200;

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!user) { toast.error("Please login first"); return; }
    setLoading(true);
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart!");
    } catch { toast.error("Failed to add"); }
    finally { setLoading(false); }
  };

  return (
    <Link to={`/products/${product._id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRight: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
          padding: "16px 12px 20px",
          transition: "var(--transition)",
          cursor: "pointer",
          position: "relative",
          boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.12)" : "none",
          zIndex: hovered ? 2 : 1,
          transform: hovered ? "translateY(-2px)" : "none",
        }}
      >
        {/* Discount badge */}
        {product.isAvailable && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "var(--green)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 3, zIndex: 1 }}>
            {discount}% off
          </div>
        )}

        {/* Image */}
        <div style={{ aspectRatio: "1/1", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", borderRadius: 4, overflow: "hidden", position: "relative" }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: "80%", height: "80%", objectFit: "contain", transition: "transform 0.3s ease", transform: hovered ? "scale(1.08)" : "scale(1)" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #f5f5f5, #e8e8e8)" }}>
              <ShoppingCart size={32} color="#ccc" />
            </div>
          )}
          {!product.isAvailable && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "var(--accent)", color: "#fff", padding: "4px 10px", borderRadius: 3, fontSize: 11, fontWeight: 700 }}>OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p style={{ fontSize: 13, color: "var(--text)", marginBottom: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: 1.4, minHeight: 36, fontWeight: 500 }}>
            {product.name}
          </p>

          <Stars rating={parseFloat(rating)} count={reviews} />

          <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "var(--text)" }}>₹{(product.price * 83).toFixed(0)}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "line-through" }}>₹{(original * 83)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)" }}>{discount}% off</span>
          </div>

          {product.stock <= 5 && product.stock > 0 && (
            <p style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600, marginTop: 4 }}>Only {product.stock} left!</p>
          )}

          <p style={{ fontSize: 11, color: "var(--green)", marginTop: 4, fontWeight: 500 }}>Free Delivery</p>
        </div>

        {/* Hover Add to Cart */}
        {hovered && product.isAvailable && (
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", animation: "fadeUp 0.15s ease" }}>
            <button onClick={handleAddToCart} disabled={loading}
              style={{ flex: 1, padding: "10px 0", background: "var(--orange)", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              {loading ? <div className="spinner" style={{ width: 14, height: 14, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <><ShoppingCart size={14} /> ADD TO CART</>}
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;