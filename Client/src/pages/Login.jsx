import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <SpotlightCard className="glass p-8" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
              <LogIn className="w-5 h-5 text-white" />
            </div>
            <div>
              <GradientText colors={["#a78bfa", "#ec4899", "#6366f1"]} animationSpeed={6} className="inline">
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              </GradientText>
              <p className="text-gray-400 text-sm">Continue your learning journey</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition">
              Register
            </NavLink>
          </p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
