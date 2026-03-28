import { useState, useEffect,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, RefreshCw, Headphones, Zap, Tag, Grid } from "lucide-react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const banners = [
  { bg: "linear-gradient(135deg, #1a237e 0%, #283593 100%)", title: "Big Billion Days", subtitle: "Up to 80% off on Electronics", cta: "Shop Now", accent: "#ffe033" },
  { bg: "linear-gradient(135deg, #880e4f 0%, #ad1457 100%)", title: "Fashion Festival", subtitle: "Trendy styles at unbeatable prices", cta: "Explore", accent: "#fff" },
  { bg: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)", title: "Home & Kitchen Sale", subtitle: "Transform your space today", cta: "Discover", accent: "#a5d6a7" },
];

const categoryIcons = [
  { name: "Electronics", icon: "💻", color: "#e3f2fd" },
  { name: "Fashion", icon: "👗", color: "#fce4ec" },
  { name: "Home", icon: "🏠", color: "#f3e5f5" },
  { name: "Books", icon: "📚", color: "#e8f5e9" },
  { name: "Sports", icon: "⚽", color: "#fff3e0" },
  { name: "Beauty", icon: "💄", color: "#fce4ec" },
  { name: "Toys", icon: "🎮", color: "#e8eaf6" },
  { name: "Food", icon: "🍎", color: "#e0f2f1" },
];

const features = [
  { icon: <Truck size={20} />, title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: <RefreshCw size={20} />, title: "Easy Returns", desc: "7-day return policy" },
  { icon: <Shield size={20} />, title: "Secure Pay", desc: "100% safe payments" },
  { icon: <Headphones size={20} />, title: "24/7 Support", desc: "Always here to help" },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p1, p2] = await Promise.all([
          API.get("/api/products?limit=10&sortBy=createdAt&sortOrder=desc"),
          API.get("/api/products?limit=10&sortBy=price&sortOrder=asc"),
        ]);
        setProducts(p1.data.products);
        setDeals(p2.data.products);
      } catch {}
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBanner(b => (b + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, []);

  const b = banners[banner];

  return (
    <div style={{ minHeight: "calc(100vh - 100px)" }}>

      {/* Hero Banner */}
      <div style={{ background: b.bg, transition: "background 0.6s ease", padding: "0", overflow: "hidden", position: "relative" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "48px 16px", minHeight: 260 }}>
          <div className="fade-in" key={banner}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14, display: "inline-block" }}>
              ✦ Limited Time Offer
            </span>
            <h1 style={{ color: "#fff", fontSize: "clamp(28px,5vw,52px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>{b.title}</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 24 }}>{b.subtitle}</p>
            <Link to="/products" className="btn" style={{ background: b.accent, color: b.accent === "#fff" ? "#880e4f" : "#1a237e", fontWeight: 800, fontSize: 14, padding: "12px 28px" }}>
              {b.cta} <ArrowRight size={16} />
            </Link>
          </div>

          {/* Banner dots */}
          <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
            {banners.map((_, i) => (
              <button key={i} onClick={() => setBanner(i)}
                style={{ width: i === banner ? 20 : 8, height: 8, borderRadius: 100, background: i === banner ? "#fff" : "rgba(255,255,255,0.4)", transition: "all 0.3s ease" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
          {features.map(({ icon, title, desc }, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderRight: i < features.length - 1 ? "1px solid var(--border-light)" : "none" }}>
              <span style={{ color: "var(--primary)", flexShrink: 0 }}>{icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13 }}>{title}</p>
                <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16, paddingBottom: 40 }}>

        {/* Category Icons */}
        <div style={{ background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "20px 16px", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, color: "var(--text)" }}>Shop by Category</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 8 }}>
            {categoryIcons.map(({ name, icon, color }) => (
              <Link key={name} to={`/products?category=${name}`}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 8px", borderRadius: "var(--radius)", background: color, transition: "var(--transition)", textAlign: "center" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}
              >
                <span style={{ fontSize: 28 }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text)" }}>{name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Deal of the Day */}
        <div style={{ background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Zap size={20} fill="var(--accent)" color="var(--accent)" />
              <span style={{ fontSize: 18, fontWeight: 800, color: "var(--text)" }}>Deal of the Day</span>
              <span style={{ background: "var(--accent)", color: "#fff", padding: "3px 10px", borderRadius: 3, fontSize: 12, fontWeight: 700 }}>Limited Offers</span>
            </div>
            <Link to="/products" style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ padding: 16 }}>
                  <div className="skeleton" style={{ aspectRatio: "1/1", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 6, borderRadius: 3 }} />
                  <div className="skeleton" style={{ height: 10, width: "60%", borderRadius: 3 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {deals.slice(0, 6).map((p, i) => (
                <div key={p._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Arrivals */}
        <div style={{ background: "#fff", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-light)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Tag size={20} color="var(--primary)" />
              <span style={{ fontSize: 18, fontWeight: 800 }}>New Arrivals</span>
            </div>
            <Link to="/products" style={{ color: "var(--primary)", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} style={{ padding: 16 }}>
                  <div className="skeleton" style={{ aspectRatio: "1/1", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 12, marginBottom: 6, borderRadius: 3 }} />
                  <div className="skeleton" style={{ height: 10, width: "60%", borderRadius: 3 }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {products.slice(0, 8).map((p, i) => (
                <div key={p._id} className="fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Banner */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {[
            { bg: "#e3f2fd", text: "var(--primary)", title: "Electronics Store", desc: "Gadgets, phones & more", emoji: "💻" },
            { bg: "#fce4ec", text: "#c2185b", title: "Fashion Hub", desc: "Latest trends & styles", emoji: "👗" },
            { bg: "#e8f5e9", text: "var(--green)", title: "Home Essentials", desc: "Everything for your home", emoji: "🏠" },
          ].map(({ bg, text, title, desc, emoji }) => (
            <Link key={title} to="/products"
              style={{ background: bg, borderRadius: "var(--radius)", padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "var(--transition)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div>
                <p style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>{desc}</p>
                <span style={{ color: text, fontSize: 13, fontWeight: 700 }}>Shop Now →</span>
              </div>
              <span style={{ fontSize: 48 }}>{emoji}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#172337", color: "#fff", padding: "32px 0 20px", marginTop: 24 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24, marginBottom: 24 }}>
            {[
              { title: "About", links: ["About Us", "Careers", "Press", "Blog"] },
              { title: "Help", links: ["Payments", "Shipping", "Returns", "FAQ"] },
              { title: "Policy", links: ["Privacy", "Terms", "Security", "Sitemap"] },
              { title: "Social", links: ["Facebook", "Twitter", "Instagram", "YouTube"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#9e9e9e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>{title}</p>
                {links.map(l => (
                  <p key={l} style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 8, cursor: "pointer" }}
                    onMouseEnter={e => e.target.style.color = "#fff"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
                  >{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>Shop<span style={{ color: "#ffe033" }}>Hub</span></span>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 ShopHub. All rights reserved.</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Visa", "Mastercard", "UPI", "PayPal"].map(p => (
                <span key={p} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "3px 8px", borderRadius: 3, fontSize: 11, fontWeight: 600 }}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}