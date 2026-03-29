import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

   const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }
  if (form.username.includes(" ")) {
    toast.error("Username cannot have spaces");
    return;
  }
  setLoading(true);
  try {
    const { data } = await API.post("/api/auth/register", form);
    login(data.user, data.token);
    toast.success("Account created successfully!");
    navigate("/");
  } catch (err) {
    toast.error(err.response?.data?.message || "Registration failed");
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{
      minHeight: "calc(100vh - 72px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
      background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }} className="fade-up">

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <ShoppingBag size={26} color="#0a0a0f" strokeWidth={2.5} />
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600, marginBottom: 8 }}>
            Create account
          </h1>
          <p style={{ color: "var(--white-muted)", fontSize: 15 }}>
            Join ShopHub and start shopping
          </p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Username</label>
                <input className="input-field" type="text" name="username"
                  placeholder="johndoe" value={form.username}
                  onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Full Name</label>
                <input className="input-field" type="text" name="fullName"
                  placeholder="John Doe" value={form.fullName}
                  onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="label">Email Address</label>
              <input className="input-field" type="email" name="email"
                placeholder="you@example.com" value={form.email}
                onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--white-dim)" }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--white-dim)"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password strength */}
            {form.password && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{
                      height: 3, flex: 1, borderRadius: 2,
                      background: form.password.length >= i * 3
                        ? i <= 1 ? "var(--danger)" : i <= 2 ? "var(--gold)" : "var(--success)"
                        : "var(--bg-hover)",
                      transition: "var(--transition)",
                    }} />
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--white-dim)" }}>
                  {form.password.length < 4 ? "Weak" : form.password.length < 8 ? "Fair" : form.password.length < 12 ? "Good" : "Strong"} password
                </p>
              </div>
            )}

            <button type="submit" className="btn btn-gold" disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15 }}>
              {loading ? <div className="spinner" /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: "center", color: "var(--white-muted)", fontSize: 14 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--gold)", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;