import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/login", form);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 72px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      background: "radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 60%)",
    }}>
      <div style={{ width: "100%", maxWidth: 440 }} className="fade-up">

        {/* Logo */}
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
            Welcome back
          </h1>
          <p style={{ color: "var(--white-muted)", fontSize: 15 }}>
            Sign in to your ShopHub account
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--white-dim)", transition: "var(--transition)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--gold)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--white-dim)"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15, marginTop: 8 }}
            >
              {loading ? <div className="spinner" /> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <div className="divider" />

          <p style={{ textAlign: "center", color: "var(--white-muted)", fontSize: 14 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--gold)", fontWeight: 500 }}>
              Create one
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: 20, padding: "14px 18px",
          background: "rgba(201,168,76,0.06)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          fontSize: 13, color: "var(--white-muted)",
        }}>
          <strong style={{ color: "var(--gold)" }}>Admin Demo:</strong>{" "}
          admin@ecommerce.com / admin123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;                               