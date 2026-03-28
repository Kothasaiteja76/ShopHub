import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Search } from "lucide-react";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";

const categories = ["Electronics", "Fashion", "Home", "Books", "Sports", "Beauty", "Toys", "Food"];
const sortOptions = [
  { label: "Relevance", value: "createdAt-desc" },
  { label: "Price — Low to High", value: "price-asc" },
  { label: "Price — High to Low", value: "price-desc" },
  { label: "Newest First", value: "createdAt-asc" },
  { label: "Name A–Z", value: "name-asc" },
];
const priceRanges = [
  { label: "Under ₹500", min: 0, max: 6 },
  { label: "₹500 – ₹1,000", min: 6, max: 12 },
  { label: "₹1,000 – ₹5,000", min: 12, max: 60 },
  { label: "₹5,000 – ₹10,000", min: 60, max: 120 },
  { label: "Above ₹10,000", min: 120, max: 99999 },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: 16, marginBottom: 16 }}>
      <button onClick={() => setOpen(!open)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: open ? 12 : 0 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</span>
        {open ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
      </button>
      {open && children}
    </div>
  );
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "createdAt-desc";
  const priceRange = searchParams.get("price") || "";

  const selectedRange = priceRanges.find(r => `${r.min}-${r.max}` === priceRange);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete("page");
    setPage(1);
    setSearchParams(p);
  };

  const clearAll = () => { setSearchParams({}); setPage(1); };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (search) {
          const { data } = await API.get(`/api/products/search?q=${search}`);
          setProducts(data.products); setTotal(data.products.length); setTotalPages(1);
        } else {
          const [sb, so] = sort.split("-");
          const params = new URLSearchParams({ page, limit: 16, sortBy: sb, sortOrder: so });
          if (category && category !== "All") params.set("category", category);
          if (selectedRange) { params.set("minPrice", selectedRange.min); params.set("maxPrice", selectedRange.max); }
          const { data } = await API.get(`/api/products?${params}`);
          setProducts(data.products); setTotal(data.total); setTotalPages(data.pages);
        }
      } catch { setProducts([]); }
      finally { setLoading(false); }
    };
    fetchProducts();
  }, [category, search, sort, priceRange, page]);

  const hasFilters = category !== "All" || search || priceRange || sort !== "createdAt-desc";

  return (
    <div style={{ minHeight: "calc(100vh - 108px)" }}>

      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "10px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, fontWeight: 800 }}>
              {search ? `Results for "${search}"` : category !== "All" ? category : "All Products"}
            </span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 400 }}>
              ({total.toLocaleString()} items)
            </span>
          </div>

          {/* Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 600 }}>Sort by:</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {sortOptions.map(opt => (
                <button key={opt.value} onClick={() => updateParam("sort", opt.value)}
                  style={{
                    padding: "5px 12px", borderRadius: 2, fontSize: 13, fontWeight: 500,
                    border: sort === opt.value ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                    color: sort === opt.value ? "var(--primary)" : "var(--text-secondary)",
                    background: sort === opt.value ? "var(--primary-light)" : "#fff",
                    transition: "var(--transition)",
                  }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ display: "flex", gap: 16, paddingTop: 16, paddingBottom: 40, alignItems: "flex-start" }}>

        {/* Sidebar Filters */}
        <aside style={{ width: 240, flexShrink: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "16px", position: "sticky", top: 120 }} className="hide-mobile">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
              <SlidersHorizontal size={16} /> Filters
            </span>
            {hasFilters && (
              <button onClick={clearAll} style={{ color: "var(--primary)", fontSize: 13, fontWeight: 600 }}>Clear All</button>
            )}
          </div>

          <FilterSection title="Category">
            {["All", ...categories].map(cat => (
              <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                <input type="radio" name="category" checked={category === cat} onChange={() => updateParam("category", cat === "All" ? "" : cat)}
                  style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
                <span style={{ fontSize: 13, color: category === cat ? "var(--primary)" : "var(--text)", fontWeight: category === cat ? 600 : 400 }}>{cat}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Price Range">
            {priceRanges.map(r => (
              <label key={r.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                <input type="radio" name="price" checked={priceRange === `${r.min}-${r.max}`}
                  onChange={() => updateParam("price", priceRange === `${r.min}-${r.max}` ? "" : `${r.min}-${r.max}`)}
                  style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
                <span style={{ fontSize: 13, color: priceRange === `${r.min}-${r.max}` ? "var(--primary)" : "var(--text)", fontWeight: priceRange === `${r.min}-${r.max}` ? 600 : 400 }}>{r.label}</span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Customer Rating">
            {[4, 3, 2].map(r => (
              <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
                <input type="checkbox" style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--text)" }}>
                  <span style={{ background: "var(--green)", color: "#fff", padding: "1px 5px", borderRadius: 3, fontSize: 11, fontWeight: 700 }}>{r} ★</span>
                  & above
                </span>
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Availability">
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "var(--primary)", width: 14, height: 14 }} />
              <span style={{ fontSize: 13 }}>In Stock Only</span>
            </label>
          </FilterSection>
        </aside>

        {/* Product Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Active filters chips */}
          {hasFilters && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {category !== "All" && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--primary-light)", color: "var(--primary)", padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                  {category}
                  <button onClick={() => updateParam("category", "")}><X size={12} /></button>
                </span>
              )}
              {priceRange && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--primary-light)", color: "var(--primary)", padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                  {selectedRange?.label}
                  <button onClick={() => updateParam("price", "")}><X size={12} /></button>
                </span>
              )}
              {search && (
                <span style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--primary-light)", color: "var(--primary)", padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                  Search: "{search}"
                  <button onClick={() => updateParam("search", "")}><X size={12} /></button>
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {[...Array(16)].map((_, i) => (
                <div key={i} style={{ padding: 16, borderRight: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
                  <div className="skeleton" style={{ aspectRatio: "1/1", marginBottom: 10 }} />
                  <div className="skeleton" style={{ height: 13, marginBottom: 6, borderRadius: 3 }} />
                  <div className="skeleton" style={{ height: 11, width: "60%", marginBottom: 8, borderRadius: 3 }} />
                  <div className="skeleton" style={{ height: 16, width: "40%", borderRadius: 3 }} />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "60px 24px", textAlign: "center" }}>
              <Search size={48} color="var(--text-muted)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No products found</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Try adjusting filters or search term</p>
              <button className="btn btn-primary" onClick={clearAll}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
                {products.map((p, i) => (
                  <div key={p._id} className="fade-up" style={{ animationDelay: `${i * 0.03}s` }}>
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 24 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 2, background: "#fff", fontSize: 13, fontWeight: 600, color: page === 1 ? "var(--text-muted)" : "var(--primary)", cursor: page === 1 ? "not-allowed" : "pointer" }}>
                    Previous
                  </button>
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => (
                    <button key={i} onClick={() => setPage(i + 1)}
                      style={{ width: 36, height: 36, borderRadius: 2, border: "1px solid", borderColor: page === i + 1 ? "var(--primary)" : "var(--border)", background: page === i + 1 ? "var(--primary)" : "#fff", color: page === i + 1 ? "#fff" : "var(--text)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 2, background: "#fff", fontSize: 13, fontWeight: 600, color: page === totalPages ? "var(--text-muted)" : "var(--primary)", cursor: page === totalPages ? "not-allowed" : "pointer" }}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}