import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addSkill, getSkills, deleteSkill, updateSkill } from "../lib/skills";
import { useToast } from "../components/Toast";
import { Plus, Trash2, ChevronDown, Zap, Pencil, Check, X } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";

const CATEGORIES = ["Frontend", "Backend", "DevOps", "Data Science", "Mobile", "Design", "DSA", "Other"];

export default function SkillInput() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    level: 5,
    lastPracticedDays: 0,
    category: "Other",
    targetLevel: 10,
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const { showToast } = useToast();

  async function loadSkills() {
    const data = await getSkills();
    setSkills(data);
  }

  useEffect(() => {
    loadSkills();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);

    try {
      await addSkill({
        name: form.name,
        level: Number(form.level),
        lastPracticedDays: Number(form.lastPracticedDays),
        category: form.category,
        targetLevel: Number(form.targetLevel),
        notes: form.notes,
      });
      setForm({ name: "", level: 5, lastPracticedDays: 0, category: "Other", targetLevel: 10, notes: "" });
      setShowNotes(false);
      showToast("Skill added!", "success");
      await loadSkills();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await deleteSkill(id);
    showToast("Skill deleted", "success");
    await loadSkills();
  }

  function startEdit(skill) {
    setEditingId(skill._id);
    setEditForm({ level: skill.level, targetLevel: skill.targetLevel || 10, notes: skill.notes || "" });
  }

  async function saveEdit(id) {
    try {
      await updateSkill(id, {
        level: Number(editForm.level),
        targetLevel: Number(editForm.targetLevel),
        notes: editForm.notes,
      });
      setEditingId(null);
      showToast("Skill updated!", "success");
      await loadSkills();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  const grouped = {};
  skills.forEach((s) => {
    const cat = s.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s);
  });

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GradientText colors={["#a78bfa", "#6366f1", "#ec4899"]} animationSpeed={6} className="inline">
            <h1 className="text-3xl font-bold">Your Skills</h1>
          </GradientText>
          <p className="text-gray-400 mt-1">Add and manage your skill inventory for AI analysis</p>
        </motion.div>

        <motion.form
          onSubmit={handleAdd}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8 glass rounded-2xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Skill name (e.g. React, Python)"
              className="px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              required
            />
            <div className="relative">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Current Level (1-10)</label>
              <input
                name="level"
                type="number"
                min="1"
                max="10"
                value={form.level}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Target Level (1-10)</label>
              <input
                name="targetLevel"
                type="number"
                min="1"
                max="10"
                value={form.targetLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Days Since Practice</label>
              <input
                name="lastPracticedDays"
                type="number"
                min="0"
                value={form.lastPracticedDays}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
              />
            </div>
          </div>

          {!showNotes ? (
            <button type="button" onClick={() => setShowNotes(true)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-800 bg-gray-950 text-sm font-medium text-purple-400 hover:border-purple-500/30 hover:text-purple-300 hover:bg-purple-500/5 transition">
              <Plus className="w-3.5 h-3.5" />
              Add Notes
            </button>
          ) : (
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Optional notes about this skill..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition resize-none"
            />
          )}

          <button
            disabled={loading}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
          >
            <Plus className="w-4 h-4" />
            {loading ? "Adding..." : "Add Skill"}
          </button>
        </motion.form>

        <div className="mt-10 space-y-8">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{category}</h2>
              <div className="space-y-2">
                {catSkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="glass rounded-xl p-4 group hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {editingId === skill._id ? (
                      <div className="space-y-3">
                        <p className="font-semibold text-white">{skill.name}</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="text-[10px] text-gray-500 block mb-1">Level</label>
                            <input
                              type="number" min="1" max="10"
                              value={editForm.level}
                              onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 block mb-1">Target</label>
                            <input
                              type="number" min="1" max="10"
                              value={editForm.targetLevel}
                              onChange={(e) => setEditForm({ ...editForm, targetLevel: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <button onClick={() => saveEdit(skill._id)} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <input
                          value={editForm.notes}
                          onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                          placeholder="Notes..."
                          className="w-full px-3 py-2 rounded-lg bg-gray-950 border border-gray-700 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500/40"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-white truncate">{skill.name}</p>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {skill.level}/{skill.targetLevel || 10}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex-1 max-w-[200px] h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                                style={{ width: `${(skill.level / (skill.targetLevel || 10)) * 100}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              {skill.lastPracticedDays === 0 ? "Practiced today" : `${skill.lastPracticedDays}d ago`}
                            </p>
                          </div>
                          {skill.notes && <p className="text-xs text-gray-500 mt-1 truncate">{skill.notes}</p>}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(skill)}
                            className="p-2 rounded-lg text-gray-600 hover:text-purple-400 hover:bg-purple-500/10 transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {skills.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Zap className="w-10 h-10 mx-auto mb-3 text-gray-700" />
              <p className="font-medium">No skills added yet</p>
              <p className="text-sm mt-1">Add your first skill above to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
