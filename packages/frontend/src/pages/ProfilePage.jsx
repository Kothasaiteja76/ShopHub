import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Lock, Edit3, Save, X, ChevronRight, Shield, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, login, logout } = useAuth();
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: user?.username || "", fullName: user?.fullName || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwLoading, setPwLoading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await API.put("/api/users/profile", form);
      login(data.user, localStorage.getItem("token"));
      toast.success("Profile updated!");
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error("Passwords don't match"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("Min 6 characters required"); return; }
    setPwLoading(true);
    try {
      await API.put("/api/users/change-password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed successfully!");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally { setPwLoading(false); }
  };

  const tabs = [
    { key: "profile", label: "Personal Info", icon: <User size={16} /> },
    { key: "password", label: "Change Password", icon: <Lock size={16} /> },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 108px)", background: "var(--bg)", paddingBottom: 40 }}>
      <div className="container" style={{ paddingTop: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, alignItems: "flex-start" }}>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Avatar Card */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28, fontWeight: 800, color: "#fff" }}>
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{user?.fullName}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 10 }}>{user?.email}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: user?.role === "admin" ? "#fff3e0" : "var(--primary-light)", color: user?.role === "admin" ? "var(--orange)" : "var(--primary)" }}>
                {user?.role === "admin" ? "⚡ Admin" : "👤 Customer"}
              </span>
            </div>

            {/* Nav Links */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              {[
                { key: "profile", label: "Personal Information", icon: <User size={16} /> },
                { key: "password", label: "Change Password", icon: <Lock size={16} /> },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 18px", fontSize: 14, fontWeight: tab === key ? 700 : 500, color: tab === key ? "var(--primary)" : "var(--text)", background: tab === key ? "var(--primary-light)" : "#fff", borderBottom: "1px solid var(--border-light)", borderLeft: tab === key ? "3px solid var(--primary)" : "3px solid transparent", transition: "var(--transition)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>{icon} {label}</span>
                  <ChevronRight size={14} color="var(--text-muted)" />
                </button>
              ))}
              <Link to="/orders"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "14px 18px", fontSize: 14, fontWeight: 500, color: "var(--text)", background: "#fff", borderBottom: "1px solid var(--border-light)", borderLeft: "3px solid transparent" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}><Package size={16} /> My Orders</span>
                <ChevronRight size={14} color="var(--text-muted)" />
              </Link>
              <button onClick={logout}
                style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "14px 18px", fontSize: 14, fontWeight: 500, color: "var(--accent)", background: "#fff", borderLeft: "3px solid transparent", transition: "var(--transition)" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--accent-light)"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>

            {/* Profile Tab */}
            {tab === "profile" && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <User size={16} color="var(--primary)" />
                    <span style={{ fontSize: 16, fontWeight: 700 }}>Personal Information</span>
                  </div>
                  {!editing ? (
                    <button onClick={() => setEditing(true)} className="btn btn-outline" style={{ borderRadius: 2, padding: "7px 18px", fontSize: 13 }}>
                      <Edit3 size={14} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { setEditing(false); setForm({ username: user?.username || "", fullName: user?.fullName || "" }); }} className="btn btn-ghost" style={{ padding: "7px 14px", fontSize: 13 }}>
                        <X size={14} /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving} className="btn btn-primary" style={{ borderRadius: 2, padding: "7px 18px", fontSize: 13 }}>
                        {saving ? <div className="spinner" style={{ width: 14, height: 14, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : <><Save size={14} /> Save</>}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ padding: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                    {[
                      { label: "Full Name", field: "fullName", value: user?.fullName },
                      { label: "Username", field: "username", value: user?.username },
                    ].map(({ label, field, value }) => (
                      <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">{label}</label>
                        {editing ? (
                          <input className="input-field" value={form[field]}
                            onChange={e => setForm({ ...form, [field]: e.target.value })} />
                        ) : (
                          <div style={{ padding: "11px 14px", background: "#fafafa", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", fontSize: 14, fontWeight: 500 }}>
                            {value}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Read-only fields */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {[
                      { label: "Email Address", value: user?.email },
                      { label: "Account Role", value: user?.role === "admin" ? "Administrator" : "Customer" },
                    ].map(({ label, value }) => (
                      <div key={label} className="form-group" style={{ marginBottom: 0 }}>
                        <label className="label">{label}</label>
                        <div style={{ padding: "11px 14px", background: "#f5f5f5", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", fontSize: 14, color: "var(--text-secondary)" }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info Banner */}
                  <div style={{ marginTop: 24, background: "var(--primary-light)", border: "1px solid rgba(255,96,0,0.2)", borderRadius: "var(--radius-sm)", padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                    <Shield size={16} color="var(--primary)" />
                    <p style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500 }}>
                      Your personal information is safe with us and never shared with third parties.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Tab */}
            {tab === "password" && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
                <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border-light)", background: "#fafafa", display: "flex", alignItems: "center", gap: 8 }}>
                  <Lock size={16} color="var(--primary)" />
                  <span style={{ fontSize: 16, fontWeight: 700 }}>Change Password</span>
                </div>
                <div style={{ padding: 24, maxWidth: 440 }}>
                  <form onSubmit={handleChangePassword}>
                    {[
                      { name: "currentPassword", label: "Current Password", placeholder: "Enter current password" },
                      { name: "newPassword", label: "New Password", placeholder: "Min 6 characters" },
                      { name: "confirmPassword", label: "Confirm New Password", placeholder: "Re-enter new password" },
                    ].map(({ name, label, placeholder }) => (
                      <div key={name} className="form-group">
                        <label className="label">{label}</label>
                        <input className="input-field" type="password" placeholder={placeholder}
                          value={pwForm[name]}
                          onChange={e => setPwForm({ ...pwForm, [name]: e.target.value })}
                          required />
                      </div>
                    ))}

                    {/* Password strength */}
                    {pwForm.newPassword && (
                      <div style={{ marginBottom: 20 }}>
                        <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: pwForm.newPassword.length >= i * 3 ? i <= 1 ? "var(--accent)" : i <= 2 ? "var(--orange)" : "var(--green)" : "var(--border)", transition: "var(--transition)" }} />
                          ))}
                        </div>
                        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                          {pwForm.newPassword.length < 4 ? "Weak" : pwForm.newPassword.length < 8 ? "Fair" : pwForm.newPassword.length < 12 ? "Good" : "Strong"} password
                        </p>
                      </div>
                    )}

                    <button type="submit" disabled={pwLoading} className="btn btn-primary" style={{ borderRadius: 2, padding: "13px 36px", fontSize: 14, fontWeight: 700 }}>
                      {pwLoading ? <div className="spinner" style={{ width: 16, height: 16, borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} /> : "Update Password"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}