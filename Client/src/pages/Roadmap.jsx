import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getRoadmaps, generateRoadmap, toggleRoadmapTask, deleteRoadmap } from "../lib/api";
import { NavLink } from "react-router-dom";
import { Map, Check, Loader2, Trash2, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";
import RoadmapImage from "../components/RoadmapImage";

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [active, setActive] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRoadmaps();
  }, []);

  async function loadRoadmaps() {
    try {
      const data = await getRoadmaps();
      setRoadmaps(data);
      if (data.length > 0) setActive(data[0]);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError("");
    try {
      const newRoadmap = await generateRoadmap();
      setRoadmaps((prev) => [newRoadmap, ...prev]);
      setActive(newRoadmap);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggle(weekIndex, taskIndex) {
    if (!active) return;
    try {
      const updated = await toggleRoadmapTask(active._id, weekIndex, taskIndex);
      setActive(updated);
      setRoadmaps((prev) => prev.map((r) => (r._id === updated._id ? updated : r)));
    } catch { }
  }

  async function handleDelete(id) {
    try {
      await deleteRoadmap(id);
      setRoadmaps((prev) => prev.filter((r) => r._id !== id));
      if (active?._id === id) {
        const remaining = roadmaps.filter((r) => r._id !== id);
        setActive(remaining[0] || null);
      }
    } catch { }
  }

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-gray-800/60">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/5 to-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm text-gray-400 font-medium tracking-wider uppercase">Cortexa Roadmap</p>
            <GradientText colors={["#a78bfa", "#06b6d4", "#10b981"]} animationSpeed={6} className="inline">
              <h1 className="text-3xl md:text-4xl font-bold mt-2">Your AI Learning Plan</h1>
            </GradientText>
            <p className="text-gray-400 mt-2 max-w-2xl">
              Personalized roadmaps generated from your skill profile and growth data
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
              >
                {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {generating ? "Generating..." : "Generate New Roadmap"}
              </button>

              {roadmaps.length > 1 && (
                <div className="relative">
                  <select
                    value={active?._id || ""}
                    onChange={(e) => setActive(roadmaps.find((r) => r._id === e.target.value))}
                    className="appearance-none px-4 py-3 pr-10 rounded-xl bg-gray-900/60 border border-gray-800 text-white text-sm focus:outline-none"
                  >
                    {roadmaps.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title} — {new Date(r.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              )}

              <NavLink
                to="/analysis"
                className="px-5 py-3 rounded-xl border border-gray-800 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-white transition"
              >
                Back to Analysis
              </NavLink>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          </div>
        )}

        {!loading && !active && (
          <div className="text-center py-20">
            <Map className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="text-gray-400 font-medium">No roadmaps yet</p>
            <p className="text-sm text-gray-600 mt-1">Generate your first AI-powered learning plan</p>
          </div>
        )}

        {active && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={active._id} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard label="Duration" value={active.duration || "4 Weeks"} />
              <InfoCard label="Objective" value={active.objective || "Skill Development"} />
              <InfoCard label="Completion" value={`${active.completionPercentage || 0}%`}>
                <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${active.completionPercentage || 0}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  />
                </div>
              </InfoCard>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Weekly Plan</h2>
                <button
                  onClick={() => handleDelete(active._id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-5">
                {active.weeks?.map((week, wIdx) => (
                  <div key={wIdx} className="rounded-2xl border border-gray-800/60 bg-gray-900/30 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{week.week}</p>
                        <h3 className="text-base font-semibold mt-0.5">{week.title}</h3>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 border border-gray-700 text-gray-300">
                        {week.items?.filter((i) => i.completed).length}/{week.items?.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {week.items?.map((item, tIdx) => (
                        <div key={tIdx}>
                          <button
                            onClick={() => handleToggle(wIdx, tIdx)}
                            className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${item.completed
                              ? "bg-emerald-500/5 border border-emerald-500/10"
                              : "bg-gray-950/40 border border-gray-800/40 hover:border-gray-700"
                              }`}
                          >
                            <div className={`mt-0.5 h-5 w-5 rounded-md border flex-shrink-0 grid place-items-center transition ${item.completed
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-gray-600"
                              }`}>
                              {item.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${item.completed ? "text-gray-500 line-through" : "text-gray-300"}`}>
                              {item.task}
                            </span>
                          </button>
                          {item.imageQuery && <RoadmapImage query={item.imageQuery} />}
                          {item.resources?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 ml-1">
                              {item.resources.map((res, rIdx) => {
                                const typeColors = {
                                  video: "bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20",
                                  article: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20",
                                  course: "bg-amber-500/10 border-amber-500/20 text-amber-300 hover:bg-amber-500/20",
                                  documentation: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/20",
                                };
                                const tc = typeColors[res.type] || "bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50";
                                return (
                                  <a
                                    key={rIdx}
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition ${tc}`}
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {res.title}
                                  </a>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ label, value, children }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
      {children}
    </div>
  );
}
