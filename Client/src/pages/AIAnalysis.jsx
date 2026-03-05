import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { runAnalysis, getAnalysisHistory } from "../lib/api";
import { NavLink } from "react-router-dom";
import { useToast } from "../components/Toast";
import { Brain, AlertTriangle, Lightbulb, Clock, ArrowRight, Trophy, Target, Zap } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";
import CountUp from "../components/CountUp";
import RoadmapImage from "../components/RoadmapImage";

export default function AIAnalysis() {
  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getAnalysisHistory()
      .then((h) => {
        setHistory(h);
        if (h.length > 0) setData(h[0]);
      })
      .catch(() => { });
  }, []);

  async function handleAnalyze() {
    setLoading(true);
    setError("");

    try {
      const result = await runAnalysis();
      setData(result);
      showToast("Analysis complete!", "success");
      const updated = await getAnalysisHistory();
      setHistory(updated);
    } catch (err) {
      setError(err.message);
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const riskColors = {
    LOW: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
    MEDIUM: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-300", dot: "bg-amber-400" },
    HIGH: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-300", dot: "bg-red-400" },
  };

  const severityColors = {
    CRITICAL: "bg-red-500/10 border-red-500/20 text-red-300",
    MODERATE: "bg-amber-500/10 border-amber-500/20 text-amber-300",
    MILD: "bg-blue-500/10 border-blue-500/20 text-blue-300",
  };

  const priorityColors = {
    HIGH: "bg-red-500/15 text-red-300 border-red-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    LOW: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <GradientText colors={["#a78bfa", "#6366f1", "#ec4899"]} animationSpeed={6} className="inline">
                <h1 className="text-3xl font-bold">AI Skill Analysis</h1>
              </GradientText>
              <p className="text-gray-400 mt-1">AI-powered insights into your growth trajectory</p>
            </div>
            <div className="flex gap-3">
              {history.length > 0 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 text-sm font-medium text-gray-300 hover:border-gray-700 hover:text-white transition"
                >
                  <Clock className="w-4 h-4" />
                  History ({history.length})
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
              >
                <Brain className="w-4 h-4" />
                {loading ? "Analyzing..." : "Analyze My Growth"}
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </motion.div>
        )}

        {showHistory && history.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Past Analyses</h2>
            <div className="space-y-2">
              {history.map((h) => {
                const rc = riskColors[h.stagnationRisk] || riskColors.LOW;
                return (
                  <button
                    key={h._id}
                    onClick={() => { setData(h); setShowHistory(false); }}
                    className="w-full glass rounded-xl p-4 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${rc.dot}`} />
                      <span className="text-sm text-gray-300">
                        {new Date(h.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${rc.bg} ${rc.border} ${rc.text} border`}>
                        {h.stagnationRisk}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{h.weakSkills?.length || 0} weak skills</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {data && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-10 space-y-6">

            {(data.overallScore != null || data.topStrength) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.overallScore != null && (
                  <SpotlightCard className="glass p-6" spotlightColor="rgba(139, 92, 246, 0.15)">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <h2 className="text-lg font-semibold">Overall Score</h2>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-bold text-white">
                        <CountUp to={data.overallScore} duration={1.5} />
                      </span>
                      <span className="text-lg text-gray-400 mb-1">/ 100</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-gray-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.overallScore}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      />
                    </div>
                  </SpotlightCard>
                )}
                {data.topStrength && (
                  <SpotlightCard className="glass p-6" spotlightColor="rgba(16, 185, 129, 0.15)">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-lg font-semibold">Top Strength</h2>
                    </div>
                    <p className="text-2xl font-bold text-emerald-300">{data.topStrength}</p>
                    <p className="text-sm text-gray-400 mt-1">Your strongest skill area</p>
                  </SpotlightCard>
                )}
              </div>
            )}

            <SpotlightCard className="glass p-6" spotlightColor="rgba(245, 158, 11, 0.1)">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold">Stagnation Risk</h2>
              </div>
              {(() => {
                const rc = riskColors[data.stagnationRisk] || riskColors.LOW;
                return (
                  <>
                    <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${rc.bg} ${rc.border} border`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${rc.dot} animate-pulse`} />
                      <span className={`text-sm font-bold ${rc.text}`}>{data.stagnationRisk}</span>
                    </div>
                    {data.riskSummary && (
                      <p className="text-sm text-gray-400 mt-3 leading-relaxed">{data.riskSummary}</p>
                    )}
                  </>
                );
              })()}
            </SpotlightCard>

            {Array.isArray(data.weakSkills) && data.weakSkills.length > 0 && (
              <SpotlightCard className="glass p-6" spotlightColor="rgba(239, 68, 68, 0.1)">
                <h2 className="text-lg font-semibold mb-4">Weak Areas</h2>
                <div className="space-y-3">
                  {data.weakSkills.map((skill, idx) => {
                    const isObject = typeof skill === "object";
                    const name = isObject ? skill.name : skill;
                    const severity = isObject ? skill.severity : null;
                    const reason = isObject ? skill.reason : null;
                    const sc = severityColors[severity] || severityColors.MODERATE;
                    return (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-900/40 border border-gray-800/50">
                        <Zap className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-white">{name}</span>
                            {severity && (
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${sc}`}>
                                {severity}
                              </span>
                            )}
                          </div>
                          {reason && <p className="text-xs text-gray-400 mt-1">{reason}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </SpotlightCard>
            )}

            <SpotlightCard className="glass p-6" spotlightColor="rgba(168, 85, 247, 0.1)">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-semibold">AI Recommendations</h2>
              </div>
              <div className="space-y-4">
                {Array.isArray(data.advice) && data.advice.map((item, idx) => {
                  const isObject = typeof item === "object";
                  const title = isObject ? item.title : null;
                  const description = isObject ? item.description : item;
                  const priority = isObject ? item.priority : null;
                  const pc = priorityColors[priority] || priorityColors.MEDIUM;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/50 hover:border-gray-700 transition">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="h-6 w-6 rounded-full bg-purple-500/20 text-purple-300 grid place-items-center text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        {title && <span className="font-semibold text-white">{title}</span>}
                        {priority && (
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${pc}`}>
                            {priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed ml-9">{description}</p>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>

            <SpotlightCard className="glass p-6" spotlightColor="rgba(99, 102, 241, 0.1)">
              <h2 className="text-lg font-semibold mb-4">14-Day Action Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Array.isArray(data.roadmap) && data.roadmap.map((step, idx) => {
                  const isObject = typeof step === "object";
                  const day = isObject ? (step.day || `Day ${idx + 1}`) : `Day ${idx + 1}`;
                  const task = isObject ? (step.task || step) : step;
                  const focus = isObject ? step.focus : null;
                  const timeEstimate = isObject ? step.timeEstimate : null;
                  const imageQuery = isObject ? step.imageQuery : null;
                  return (
                    <div key={idx} className="rounded-xl border border-gray-800/60 bg-gray-900/40 p-4 hover:border-gray-700 transition overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-purple-300">{day}</p>
                        {timeEstimate && (
                          <span className="text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{timeEstimate}</span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mt-1">{task}</p>
                      {focus && <p className="text-xs text-gray-500 mt-2">Focus: {focus}</p>}
                      {imageQuery && <RoadmapImage query={imageQuery} />}
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>

            <div className="flex justify-end">
              <NavLink
                to="/roadmap"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all"
              >
                View Full Roadmap <ArrowRight className="w-4 h-4" />
              </NavLink>
            </div>
          </motion.div>
        )}

        {!data && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 text-center py-16"
          >
            <Brain className="w-12 h-12 mx-auto mb-4 text-gray-700" />
            <p className="text-gray-400 font-medium">Run an analysis to see AI-powered insights</p>
            <p className="text-sm text-gray-600 mt-1">Make sure you have skills added first</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
