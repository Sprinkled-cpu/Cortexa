import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../lib/api";
import { getSkills } from "../lib/skills";
import { Zap, Brain, Map, TrendingUp, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import SpotlightCard from "../components/SpotlightCard";
import CountUp from "../components/CountUp";
import GradientText from "../components/GradientText";

const riskColors = {
  LOW: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-red-400",
};

const riskBg = {
  LOW: "bg-emerald-500/10 border-emerald-500/20",
  MEDIUM: "bg-amber-500/10 border-amber-500/20",
  HIGH: "bg-red-500/10 border-red-500/20",
};

const barColors = ["#8b5cf6", "#6366f1", "#a78bfa", "#818cf8", "#c084fc", "#7c3aed", "#6d28d9", "#4f46e5"];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats().catch(() => null),
      getSkills().catch(() => []),
    ]).then(([s, sk]) => {
      setStats(s);
      setSkills(sk);
      setLoading(false);
    });
  }, []);

  const chartData = skills.map((s) => ({
    name: s.name,
    level: s.level,
    target: s.targetLevel || 10,
  }));

  const cards = [
    {
      label: "Skills Tracked",
      value: stats?.totalSkills ?? "—",
      numericValue: stats?.totalSkills,
      hint: stats?.totalSkills ? `Avg level ${stats.avgLevel}` : "Add skills to begin",
      color: "from-violet-500/20 to-purple-500/10",
    },
    {
      label: "Roadmap Progress",
      value: stats?.roadmapCompletion != null ? `${stats.roadmapCompletion}%` : "—",
      numericValue: stats?.roadmapCompletion,
      suffix: "%",
      hint: stats?.roadmapCompletion != null ? "Current roadmap" : "Generate a roadmap",
      color: "from-cyan-500/20 to-blue-500/10",
    },
    {
      label: "Stagnation Risk",
      value: stats?.lastStagnationRisk ?? "—",
      hint: stats?.lastAnalysisDate
        ? `Last: ${new Date(stats.lastAnalysisDate).toLocaleDateString()}`
        : "Run AI analysis",
      color: "from-emerald-500/20 to-green-500/10",
      isRisk: true,
    },
  ];

  const actions = [
    { to: "/skills", label: "Manage Skills", icon: Zap, desc: "Add and track your skill inventory" },
    { to: "/analysis", label: "AI Analysis", icon: Brain, desc: "Get AI-powered growth insights" },
    { to: "/roadmap", label: "View Roadmap", icon: Map, desc: "Follow your learning plan" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Welcome back,{" "}
            <GradientText colors={["#a78bfa", "#ec4899", "#8b5cf6"]} animationSpeed={6} className="inline">
              {user?.name || "there"}
            </GradientText>
          </h1>
          <p className="text-gray-400 mt-2">Here's your skill intelligence overview</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {cards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.1 }}
            >
              <SpotlightCard
                className="p-6 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden glass"
                spotlightColor="rgba(139, 92, 246, 0.15)"
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-50 pointer-events-none`} />
                <div className="relative">
                  <p className="text-sm text-gray-400">{card.label}</p>
                  {loading ? (
                    <div className="skeleton h-9 w-20 mt-2" />
                  ) : card.isRisk && card.value !== "—" ? (
                    <div className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full border ${riskBg[card.value] || ""}`}>
                      <span className={`text-2xl font-bold ${riskColors[card.value] || "text-white"}`}>{card.value}</span>
                    </div>
                  ) : card.numericValue != null ? (
                    <h3 className="text-3xl font-bold mt-2">
                      <CountUp to={card.numericValue} duration={1.5} />
                      {card.suffix || ""}
                    </h3>
                  ) : (
                    <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{card.hint}</p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <SpotlightCard className="mt-10 glass p-6" spotlightColor="rgba(99, 102, 241, 0.1)">
              <h2 className="text-lg font-semibold mb-5">Skill Levels</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} barCategoryGap="20%">
                  <XAxis dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 10]} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "12px", color: "#fff", fontSize: "13px" }}
                    cursor={{ fill: "rgba(139,92,246,0.05)" }}
                  />
                  <Bar dataKey="level" radius={[8, 8, 0, 0]} maxBarSize={50}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={barColors[i % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SpotlightCard>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10"
        >
          <h2 className="text-xl font-semibold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {actions.map((action) => (
              <NavLink key={action.to} to={action.to} className="block">
                <SpotlightCard
                  className="group glass p-6 hover:-translate-y-1 transition-all duration-300 h-full"
                  spotlightColor="rgba(168, 85, 247, 0.15)"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-white/5">
                      <action.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-lg font-semibold mt-4">{action.label}</h3>
                  <p className="text-sm text-gray-400 mt-1">{action.desc}</p>
                </SpotlightCard>
              </NavLink>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10"
        >
          <SpotlightCard
            className="glass p-8 bg-gradient-to-r from-purple-500/5 via-cyan-500/5 to-emerald-500/5"
            spotlightColor="rgba(139, 92, 246, 0.2)"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Track Your Growth</h2>
                <p className="text-gray-400 mt-1 max-w-2xl">
                  Add your skills, run AI analysis regularly, and follow your personalized roadmap.
                  Cortexa tracks your progress and helps you grow faster.
                </p>
                <NavLink
                  to="/skills"
                  className="inline-flex items-center gap-2 mt-4 text-purple-400 font-medium hover:text-purple-300 transition"
                >
                  Get started <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </div>
  );
}
