import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, Zap, Brain, Map, User, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/skills", label: "Skills", icon: Zap },
  { to: "/analysis", label: "AI Analysis", icon: Brain },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-950/70 border-b border-gray-800/50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center text-white text-sm font-bold">
            C
          </div>
          <span className="hidden sm:inline">CORTEXA</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `relative inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? "text-white bg-white/5"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center text-white text-xs font-bold">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">{user.name}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-800/50 bg-gray-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive
                    ? "text-white bg-white/5 border-l-2 border-purple-500"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
