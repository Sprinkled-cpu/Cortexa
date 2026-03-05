import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../lib/api";
import { User, Save, Loader2 } from "lucide-react";
import SpotlightCard from "../components/SpotlightCard";
import GradientText from "../components/GradientText";

export default function Profile() {
    const { user, login } = useAuth();
    const [form, setForm] = useState({ name: "", bio: "", careerGoal: "" });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile()
            .then((data) => {
                setForm({ name: data.name || "", bio: data.bio || "", careerGoal: data.careerGoal || "" });
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setSaved(false);
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            await updateProfile(form);
            setSaved(true);
        } catch {
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <GradientText colors={["#a78bfa", "#ec4899", "#6366f1"]} animationSpeed={6} className="inline">
                        <h1 className="text-3xl font-bold">Profile</h1>
                    </GradientText>
                    <p className="text-gray-400 mt-1">Manage your Cortexa profile</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-8"
                >
                    <SpotlightCard className="glass p-8" spotlightColor="rgba(168, 85, 247, 0.15)">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 grid place-items-center text-2xl font-bold uppercase">
                                {form.name?.[0] || user?.email?.[0] || "?"}
                            </div>
                            <div>
                                <p className="text-lg font-semibold">{form.name || "Your Name"}</p>
                                <p className="text-sm text-gray-400">{user?.email}</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                            </div>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-5">
                                <div>
                                    <label className="text-sm text-gray-400 mb-1.5 block">Full Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-1.5 block">Career Goal</label>
                                    <input
                                        name="careerGoal"
                                        value={form.careerGoal}
                                        onChange={handleChange}
                                        placeholder="e.g. Full-Stack Developer"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-400 mb-1.5 block">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        placeholder="Tell us about yourself..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                                </button>
                            </form>
                        )}
                    </SpotlightCard>
                </motion.div>
            </div>
        </div>
    );
}
