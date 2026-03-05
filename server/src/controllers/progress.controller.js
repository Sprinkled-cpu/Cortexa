import Skill from "../models/Skill.js";
import Progress from "../models/Progress.js";
import Roadmap from "../models/Roadmap.js";
import AnalysisHistory from "../models/AnalysisHistory.js";

export async function captureProgress(req, res) {
    try {
        const skills = await Skill.find({ user: req.user });

        if (!skills.length) {
            return res.status(400).json({ message: "No skills to capture" });
        }

        const snapshots = skills.map((s) => ({
            user: req.user,
            skill: s._id,
            skillName: s.name,
            level: s.level,
        }));

        await Progress.insertMany(snapshots);

        res.status(201).json({ message: "Progress captured", count: snapshots.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getProgressHistory(req, res) {
    try {
        const history = await Progress.find({ user: req.user })
            .sort({ capturedAt: 1 })
            .lean();

        const grouped = {};
        history.forEach((entry) => {
            if (!grouped[entry.skillName]) {
                grouped[entry.skillName] = [];
            }
            grouped[entry.skillName].push({
                level: entry.level,
                date: entry.capturedAt,
            });
        });

        res.json(grouped);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getDashboardStats(req, res) {
    try {
        const skills = await Skill.find({ user: req.user });
        const roadmaps = await Roadmap.find({ user: req.user });
        const analyses = await AnalysisHistory.find({ user: req.user })
            .sort({ createdAt: -1 })
            .limit(1);

        const totalSkills = skills.length;
        const avgLevel =
            totalSkills > 0
                ? +(skills.reduce((sum, s) => sum + s.level, 0) / totalSkills).toFixed(1)
                : 0;

        const activeRoadmap = roadmaps[0];
        const roadmapCompletion = activeRoadmap ? activeRoadmap.completionPercentage : 0;

        const lastAnalysis = analyses[0] || null;

        res.json({
            totalSkills,
            avgLevel,
            roadmapCompletion,
            lastAnalysisDate: lastAnalysis?.createdAt || null,
            lastStagnationRisk: lastAnalysis?.stagnationRisk || null,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
