import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { UserPlus, Loader2 } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = details, 2 = otp

  const { loadUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      showToast("Please fill all fields", "error");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      showToast("Password too short", "error");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      setStep(2);
      showToast("OTP sent to your email!", "success");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!form.otp) {
      setError("Please enter the OTP sent to your email.");
      showToast("OTP required", "error");
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          otp: form.otp,
        }),
      });

      localStorage.setItem("token", data.token);
      await loadUser();
      showToast("Account created!", "success");
      navigate("/");
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <SpotlightCard className="glass p-8" spotlightColor="rgba(16, 185, 129, 0.15)">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <GradientText colors={["#10b981", "#06b6d4", "#6366f1"]} animationSpeed={6} className="inline">
                <h1 className="text-2xl font-bold">Create Account</h1>
              </GradientText>
              <p className="text-gray-400 text-sm">Start your Cortexa journey</p>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={step === 1 ? handleSendOtp : handleRegister}>
            {step === 1 ? (
              <>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
                  />
                </div>

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
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Verification Code (OTP)</label>
                <input
                  name="otp"
                  type="text"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="6-digit code"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition text-center tracking-widest text-lg"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-2 text-center">We sent a verification code to {form.email}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> {step === 1 ? "Sending..." : "Verifying..."}
                </span>
              ) : step === 1 ? (
                "Continue"
              ) : (
                "Verify & Create Account"
              )}
            </button>

            {step === 2 && !loading && (
              <button
                type="button"
                onClick={() => { setStep(1); setForm({ ...form, otp: "" }); setError(""); }}
                className="w-full py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Back to details
              </button>
            )}
          </form>

          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <NavLink to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition">
              Sign In
            </NavLink>
          </p>
        </SpotlightCard>
      </motion.div>
    </div>
  );
}
