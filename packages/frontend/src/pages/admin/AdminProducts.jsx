import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Search, ToggleLeft, ToggleRight, Package, X, Save } from "lucide-react";
import API from "../../api/axios";
import toast from "react-hot-toast";

const empty = { name: "", description: "", price: "", stock: "", category: "", image: "" };
const categories = ["Electronics", "Fashion", "Home", "Books", "Sports", "Beauty", "Toys", "Food"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/products?limit=100");
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, category: p.category, image: p.image || "" }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); setForm(empty); };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock || !form.category) { toast.error("Fill all required fields"); return; }
    setSaving(true);
    try {
      if (editing) {
        await API.put(`/api/products/${editing._id}`, { ...form, price: Number(form.price), stock: Number(form.stock) });
        toast.success("Product updated!");
      } else {
        await API.post("/api/products", { ...form, price: Number(form.price), stock: Number(form.stock) });
        toast.success("Product created!");
      }
      closeModal();
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await API.delete(`/api/products/${id}`); toast.success("Deleted!"); fetchProducts(); }
    catch { toast.error("Delete failed"); }
  };

  const toggleAvailability = async (id) => {
    try { await API.put(`/api/admin/products/${id}/availability`); fetchProducts(); toast.success("Availability updated!"); }
    catch { toast.error("Failed"); }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800 }}>Product Management</h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{products.length} total products</p>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input className="input-field" placeholder="Search products..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: 36, width: 220, fontSize: 13 }} />
            </div>
            <button onClick={openCreate} className="btn btn-primary" style={{ borderRadius: 2, gap: 6 }}>
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa", borderBottom: "1px solid var(--border)" }}>
                {["Product", "Category", "Price", "Stock", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, textAlign: "left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <div className="skeleton" style={{ height: 14, borderRadius: 3 }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                  <Package size={32} style={{ margin: "0 auto 8px", display: "block" }} />
                  No products found
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p._id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border-light)" : "none", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 44, background: "#f5f5f5", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                        {p.image ? <img src={p.image} alt="" style={{ width: "90%", height: "90%", objectFit: "contain" }} /> : <Package size={18} color="#ccc" />}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>{p.category}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700 }}>₹{(p.price * 83).toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: p.stock > 10 ? "var(--green)" : p.stock > 0 ? "var(--orange)" : "var(--accent)" }}>
                      {p.stock > 0 ? p.stock : "Out"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => toggleAvailability(p._id)}
                      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: p.isAvailable ? "var(--green)" : "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                      {p.isAvailable ? <ToggleRight size={20} color="var(--green)" /> : <ToggleLeft size={20} color="var(--text-muted)" />}
                      {p.isAvailable ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => openEdit(p)}
                        style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", transition: "var(--transition)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-light)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--border)"; }}
                      ><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(p._id)}
                        style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", transition: "var(--transition)" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-light)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--border)"; }}
                      ><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 560, maxHeight: "90vh", overflow: "auto", boxShadow: "var(--shadow-lg)" }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>{editing ? "Edit Product" : "Add New Product"}</span>
              <button onClick={closeModal} style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="label">Product Name *</label>
                  <input className="input-field" placeholder="e.g. iPhone 15 Pro" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="label">Description *</label>
                  <textarea className="input-field" placeholder="Product description..." value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3} style={{ resize: "vertical" }} />
                </div>
                <div className="form-group">
                  <label className="label">Price (USD) *</label>
                  <input className="input-field" type="number" placeholder="0.00" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Stock *</label>
                  <input className="input-field" type="number" placeholder="0" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="label">Category *</label>
                  <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Image URL</label>
                  <input className="input-field" placeholder="https://..." value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                </div>
              </div>

              {form.image && (
                <div style={{ marginBottom: 16, textAlign: "center" }}>
                  <img src={form.image} alt="Preview" style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }} />
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button onClick={closeModal} className="btn btn-ghost" style={{ borderRadius: 2 }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ borderRadius: 2, padding: "10px 28px" }}>
                  {saving ? <div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <><Save size={15} /> {editing ? "Update" : "Create"}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}